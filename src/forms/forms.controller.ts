import { Controller, Get, InternalServerErrorException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key-auth.guard';
import { IContractDataFormData } from './interfaces/IContractDataFormData.interface';
import { Form } from './entities/form.entity';
import { FormQueryDto } from './dto/form-query.dto';

@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  /**
   * Return form(s) either through query parameters or none in order to get all of them
   * @param name name of the form
   * @returns Form with corresponding form groups
   */
  @Get()
  @ApiOkResponse({ description: 'Form with corresponding form groups', type: Form })
  async getForms(@Query() query: FormQueryDto): Promise<Form[] | Form | null> {
    if (Object.keys(query).length !== 0) {
      return await this.formsService.findOne(query);
    } else {
      return await this.formsService.findAll();
    }
  }

  /**
   * Returns form with the provided id
   * @param id 
   * @returns Form with given id
   */
  @Get(':id')
  @ApiOkResponse({ description: 'Form with corresponding form groups', type: Form })
  async getForm(@Param('id') id: number): Promise<Form | null> {
    return await this.formsService.findOne({ id });
  }

  /**
   * Return the following form format (form groups) and data regarding client registration:
   * - datos del contrato
   * - datos del abonado
   * - datos de direccion
   * - datos de residencia
   * - solicitud de instalacion
   */
  @Get('abonado-registro')
  @ApiOkResponse({ description: 'Form and form groups with data included for client registration', type: Form })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async abonadoRegistroForm(): Promise<Form> {
    let registerClientForm = await this.formsService.findOne({ name: 'registro abonado' });
    if (registerClientForm === null) {
      throw new InternalServerErrorException('Internal server error', { description: "Couldn't find a form" })
    }

    for (let formGroup of registerClientForm.formGroups) {
      let fgName = formGroup.name;
      let formGroupData;
      switch (fgName) {
        case 'datos del contrato':
          formGroupData = this.formsService.getContractDataFormData();
          break;
    
        case 'datos del abonado':
          formGroupData = this.formsService.getClientDataFormData();
          break;
        
        case 'datos de dirección':
          formGroupData = this.formsService.getDirectionsDataFormData();
          break;
      }
      if(!formGroupData) continue;

      for (let control of formGroup.controls) {
        if (control.data !== undefined) {
          control.data = formGroupData[control.attributes.name];
        }
      }
    }
    registerClientForm.formGroups.pop();
    return registerClientForm;
  }
}
