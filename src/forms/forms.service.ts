import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities/session.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserService } from 'src/auth/services/user.service';
import { In, Not, Repository } from 'typeorm';
import { FormQueryDto } from './dto/form-query.dto';
import { Form } from './entities/form.entity';

@Injectable()
export class FormsService {

  constructor(
    @InjectRepository(Form) private formsRepository: Repository<Form>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
    private userService: UserService
  ) { }

  public findAllForms(fields?: FormQueryDto): Promise<Form[]> {
    return this.formsRepository.find({
      where: fields,
      order: {
        formGroups: { // returns form groups ordered by their column `order`
          order: 'ASC',
          formControls: {
            order: 'ASC'
          }
        }
      }
    });
  }

  /**
   * 
   * @param fields fields to search the form with (id, name, etc).
   * @param sessionToken session id for a user, if present returned form will be adjusted to user, if not present retu
   * @returns forms, if sessionToken is present the returned form will be adjusted to user, if not present the returned form will unaltered
   */
  public async findForm(fields: FormQueryDto, sessionToken?: string): Promise<Form | null> {
    if (!sessionToken) {
      // if session is not specified, return form in its fullness
      return this.formsRepository.findOne({
        where: fields,
        order: {
          formGroups: { // returns form groups ordered by their column `order`
            order: 'ASC',
            formControls: {
              order: 'ASC'
            }
          }
        }
      });
    }

    // if session is specified, adjust form to return to user
    const userId = await this.userService.findUserId({ relations: { session: { where: { sessionToken } } } });
    // if userId does not exist, the sessionToken must not have been valid or it was revoked by the backend
    if (!userId) throw new UnauthorizedException();

    let controlIds = await this.getUserBlackListControlIds(userId);
    console.log('user controlIds', controlIds);

    let extraFields: any = {
      formGroups: {
        formControls: {
          id: Not(In(controlIds))
        }
      }
    };
    console.log('original fields', fields);
    fields = { ...fields, ...extraFields}; // note: be careful of field overwriting (extraFields should not have any properties the object fields can hold)
    console.log('new fields', fields);

    return this.formsRepository.findOne({
      where: fields,
      order: {
        formGroups: { // returns form groups ordered by their column `order`
          order: 'ASC',
          formControls: {
            order: 'ASC'
          }
        }
      }
    });
  }

  /**
   * Get list of ids of controls the user should not have access to.
   * @param userId id to identify user
   * @returns array of ids (FK) that belong to form controls
   */
  private async getUserBlackListControlIds(userId: number): Promise<Array<number>> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { controlsBlackList: true } });
    let controlIds: Array<number> = [];
    if (user!.controlsBlackList && user!.controlsBlackList.length > 0) {
      // get only an array of ids for the where clause
      controlIds = user!.controlsBlackList.map((control) => control.id);
    }

    return controlIds;
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
