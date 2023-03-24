import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key-auth.guard';
import { Form } from './entities/form.entity';
import { FormQueryDto } from './dto/form-query.dto';
import { FormGroup } from './entities/form-group.entity';
import { Cookies } from 'src/decorators/cookies.decorator';
import { ConfigService } from '@nestjs/config';
import { DynamicContentService } from './dynamic-content.service';


@ApiTags('dynamic-content')
@ApiSecurity('X-API-Key')
@UseGuards(ApiKeyAuthGuard)
@Controller()
export class DynamicContentController {
  constructor(
    private configService: ConfigService,
    private readonly dynamicContentService: DynamicContentService
  ) { }

  /**
   * Return forms that match the query parameters passed by the request
   * @param query a partial object of the Form entity
   * @returns Form(s) with corresponding form groups
   */
  @Get('forms')
  @ApiOkResponse({ description: 'Form with corresponding form groups', type: Form, isArray: true })
  @ApiNotFoundResponse({ description: 'No resource was found' })
  async getForms(@Query() query: FormQueryDto): Promise<Form[]> {
    const forms = await this.dynamicContentService.findAllForms(query);
    if (forms.length > 0) return forms;
    else throw new NotFoundException('The resource you were looking for could not be found');
  }

  /**
   * Returns form with the provided id
   * @param id 
   * @returns Form with given id
   */
  @Get('forms/:id')
  @ApiOkResponse({ description: 'Form with corresponding form groups', type: Form })
  @ApiNotFoundResponse({ description: 'No resource was found' })
  @ApiUnauthorizedResponse({ description: 'If session id was provided, the authentication failed' })
  async getForm(@Param('id') id: number, @Cookies() cookies: any): Promise<Form> {
    const sessionToken: string | undefined = cookies[this.configService.get('SESSION_ID_NAME') as string];
    console.log('user session token:', sessionToken);
    // try {
    //   await this.dynamicContentService.findForm({ id }, sessionToken)
    // } catch (error) {
    //   console.log(error)
    // }
    const form = await this.dynamicContentService.findForm({ id }, sessionToken)

    if (form) return form;
    else throw new NotFoundException('The resource you were looking for could not be found');
  }

  /**
   * Returns form with the provided id
   * @param id 
   * @returns Form with given id
   */
   @Get('forms/:id/form-groups')
   @ApiOkResponse({ description: 'Form with corresponding form groups', type: Array<FormGroup> })
   @ApiNotFoundResponse({ description: 'No resource was found' })
   async getFormGroup(@Param('id') id: number): Promise<FormGroup[]> {
     const form = await this.dynamicContentService.findForm({ id });
     if (form) return form.formGroups;
     else throw new NotFoundException('The resource you were looking for could not be found');
   }

  /**
   * Return the following form format (form groups) and data regarding client registration:
   * - datos del contrato
   * - datos del abonado
   * - datos de direccion
   * - datos de residencia
   * - solicitud de instalacion
   */
  @Get('forms/abonado-registro')
  @ApiOkResponse({ description: 'Form and form groups with data included for client registration', type: Form })
  @ApiInternalServerErrorResponse({ description: 'Internal server error, there was an issue with the code' })
  async abonadoRegistroForm(): Promise<Form> {
    let registerClientForm = await this.dynamicContentService.findForm({ name: 'registro abonado' });
    if (registerClientForm === null) throw new InternalServerErrorException('Internal server error', { description: "Couldn't find a form" })

    // fill form groups with data according to the name of the form
    for (let formGroup of registerClientForm.formGroups) {
      let fgName = formGroup.name;
      let formGroupData;
      switch (fgName) {
        case 'datos del contrato':
          formGroupData = this.dynamicContentService.getContractDataFormData();
          break;
    
        case 'datos del abonado':
          formGroupData = this.dynamicContentService.getClientDataFormData();
          break;
        
        case 'datos de dirección':
          formGroupData = this.dynamicContentService.getDirectionsDataFormData();
          break;

        case 'datos de residencia':
          formGroupData = this.dynamicContentService.getResidenceDataFormData();
          break;
      }
      if(!formGroupData) continue;

      // append the data to our form controls that came from the json
      for (let control of formGroup.controls) {
        if (control.is_form_array) {
          for (let groupControl of control.form_array_controls!) {
            if (groupControl.data !== undefined) {
              groupControl.data = formGroupData[groupControl.name];
            }
          }
        } else if (control.data !== undefined) {
          control.data = formGroupData[control.name];
        }
      }
    }
    
    return registerClientForm;
  }
}
