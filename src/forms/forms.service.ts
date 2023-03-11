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
      relations: { // bring along the form groups
        formGroups: true
      }
    });
  }

  findForm(fields: FormQueryDto): Promise<Form | null> {
    return this.formsRepository.findOne({
      where: fields, 
      relations: { // bring along the form groups
        formGroups: true
      }
    });
  }

  /**
   * Connect to the DB and collects the data for the contract data form
   */
  getContractDataFormData() {
    return {
      tipo_abonado: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}], // control_name: Array<data>
      tipo_facturacion: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}],
      franquicia: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      grupo_afinidad: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}],
      vendedor: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  getClientDataFormData(): any {
    return {
      tipo_cliente: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}], // control_name: Array<data>
      tipo_doc: [{name: 'Ej 1', value: 'val1'},{name: 'Ej 2', value: 'val2'}]
    }
  }

  getDirectionsDataFormData(): any {
    return {
      residencia: [{name: 'Ej 1', value: true},{name: 'Ej 2', value: false}]
    }
  }
}
