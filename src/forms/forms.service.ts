import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormQueryDto } from './dto/form-query.dto';
import { Form } from './entities/form.entity';

@Injectable()
export class FormsService {

  constructor(@InjectRepository(Form) private formsRepository: Repository<Form>) {}

  findAllForms(fields?: FormQueryDto): Promise<Form[]> {
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

  findForm(fields: FormQueryDto): Promise<Form | null> {
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
   * Connect to the DB and collects the data for the contract data form
   */
  getContractDataFormData() {
    return {
      tipo_abonado: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      tipo_facturacion: [{name: 'Ej 1', value: 1},{name: 'Ej 2', value: 2}],
      franquicia: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      grupo_afinidad: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      vendedor: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  getClientDataFormData(): any {
    return {
      tipo_cliente: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      tipo_doc: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  getDirectionsDataFormData(): any {
    return {
      departamento: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      ciudad_municipio: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      zona: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      sector: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      nomeclatura: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      valor: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
    }
  }

  getResidenceDataFormData(): any {
    return {
      residencia: [{name: 'Ej 1', value: 1},{name: 'Ej 2', value: false}],
    }
  }
}
