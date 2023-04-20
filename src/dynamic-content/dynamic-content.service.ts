import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/services/user.service';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { FormQueryDto } from './dto/form-query.dto';
import { ModuleQueryDto } from './dto/module-query.dto';
import { ContentBlock } from './entities/content-block.entity';
import { Form } from './entities/form.entity';

@Injectable()
export class DynamicContentService {
  constructor(
    @InjectRepository(ContentBlock) private contentBlockRepository: Repository<ContentBlock>,
    @InjectRepository(Form) private formsRepository: Repository<Form>,
    private userService: UserService
  ) { }

  /**
   * Retrieves all forms that meet the criteria in fields, if sessionToken is specified the result will be adjusted to the user
   * @param fields fields to search the form with (id, name, etc).
   * @param sessionToken session id for a user
   * @returns forms, if sessionToken is present the returned form will be adjusted to user, if not present the returned form will unaltered
   */
  public async findAllForms(fields?: FormQueryDto, sessionToken?: string): Promise<Form[]> {
    // object that represents the SQL query
    let searchOptions: FindManyOptions<Form> = {
      where: fields,
      order: {
        formGroups: { // returns form groups ordered by their column `order`
          order: 'ASC',
          formControls: {
            order: 'ASC'
          }
        }
      }
    }

    // if session is not specified, return form in its fullness
    if (!sessionToken) return this.formsRepository.find(searchOptions);

    // if session is specified, adjust form to return to user
    const userId = await this.userService.findUserId({ relations: { session: { where: { sessionToken } } } });
    // if userId does not exist, the sessionToken must not have been valid or it was revoked by the backend
    if (!userId) throw new UnauthorizedException();

    let controlIds = await this.userService.getUserBlackListControlIds(userId);
    console.log('user controlIds', controlIds);

    let extraFields: any = {
      formGroups: {
        formControls: {
          id: Not(In(controlIds))
        }
      }
    };
    searchOptions.where = { ...fields, ...extraFields}; // note: be careful of field overwriting (extraFields should not have any properties the object fields can hold)
    return this.formsRepository.find(searchOptions);
  }

  /**
   * Retrieves a single form that meets the criteria in fields, if sessionToken is specified the result will be adjusted to the user
   * @param fields fields to search the form with (id, name, etc)
   * @param sessionToken session id for a user
   * @returns forms, if sessionToken is present the returned form will be adjusted to user, if not present the returned form will unaltered
   */
  public async findForm(fields: FormQueryDto, sessionToken?: string): Promise<Form | null> {
    // object that represents the SQL query
    let searchOptions: FindManyOptions<Form> = {
      where: fields,
      order: {
        formGroups: { // returns form groups ordered by their column `order`
          order: 'ASC',
          formControls: {
            order: 'ASC'
          }
        }
      }
    }

    // if session is not specified, return form in its fullness
    if (!sessionToken) return this.formsRepository.findOne(searchOptions);

    // if session is specified, adjust form to return to user
    const userId = await this.userService.findUserId({ relations: { session: { where: { sessionToken } } } });
    // if userId does not exist, the sessionToken must not have been valid or it was revoked by the backend
    if (!userId) throw new UnauthorizedException();

    let controlIds = await this.userService.getUserBlackListControlIds(userId);
    console.log('user controlIds', controlIds);

    let extraFields: any = {
      formGroups: {
        formControls: {
          id: Not(In(controlIds))
        }
      }
    };
    searchOptions.where = { ...fields, ...extraFields}; // note: be careful of field overwriting (extraFields should not have any properties the object fields can hold)
    return this.formsRepository.findOne(searchOptions);
  }

  /**
   * Fetch a module's content, be it forms, action buttons, tables, or other kinds of views
   * @param fields fields to search the form with (id, name, etc)
   * @param sessionToken session id for a user
   * @returns ContentBlock with content adjusted to user
   */
  public async findModuleContent(moduleFields: ModuleQueryDto, userId: number): Promise<ContentBlock[]> {
    /**
     * find this user's list of elements they should have no access to (we use this to filter our query result of the module's content blocks
     * if the content block posseses an element this user should not have, it gets removed by the where clause)
     */
    let controlIds = await this.userService.getUserBlackListControlIds(userId);
    console.log('user controlIds', controlIds);
    let buttonIds = await this.userService.getUserBlackListActionButtonsIds(userId)
    console.log('user buttonIds', buttonIds);

    let queryBuilder = this.contentBlockRepository.createQueryBuilder('contentBlock')
      .leftJoinAndSelect('contentBlock.forms', 'forms')
      .leftJoinAndSelect('forms.formGroups', 'formGroups')
      .where('contentBlock.module_id = :moduleId', { moduleId: moduleFields.id })
      .orderBy('contentBlock.order', 'ASC');

    if (controlIds.length > 0) {
      queryBuilder.leftJoinAndSelect('formGroups.formControls', 'formControls', 'formControls.id NOT IN (:...controlIds)', { controlIds });
    } else {
      queryBuilder.leftJoinAndSelect('formGroups.formControls', 'formControls');
    }

    if (buttonIds.length > 0) {
      queryBuilder.leftJoinAndSelect('contentBlock.actionButtons', 'actionButtons', 'actionButtons.id NOT IN (:...buttonIds)', { buttonIds });
    } else {
      queryBuilder.leftJoinAndSelect('contentBlock.actionButtons', 'actionButtons');
    }

    return queryBuilder.getMany();
    
    /* this is not working as intended... */
    return this.contentBlockRepository.find({
      where: {
        module: {
          ...moduleFields,
          contentBlocks: {
            forms: {
              formGroups: {
                formControls: {
                  id: Not(In(controlIds)) // this is not working
                }
              }
            },
            actionButtons: {
              id: Not(In(buttonIds))
            }
          }
        }
      },
      order: { order: 'ASC' }
    });
  }

  /**
   * Connect to the DB and collects the data for the contract data form
   */
  public getContractDataFormData() {
    return {
      tipo_abonado: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      tipo_facturacion: [{name: 'Ej 1', value: 1},{name: 'Ej 2', value: 2}],
      franquicia: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      grupo_afinidad: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      vendedor: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  public getClientDataFormData(): any {
    return {
      tipo_cliente: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      tipo_doc: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  public getDirectionsDataFormData(): any {
    return {
      departamento: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      ciudad_municipio: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      zona: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      sector: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      nomeclatura: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      valor: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
    }
  }

  public getResidenceDataFormData(): any {
    return {
      residencia: [{name: 'Ej 1', value: 1},{name: 'Ej 2', value: false}],
    }
  }
}