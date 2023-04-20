import { Injectable } from '@nestjs/common';

@Injectable()
export class FormFilterService {
  /**
   * Using a string call a function loaded in the FormFilterService class
   * @param funcName 
   */
  public async findFormFilterFormat(funcName: keyof FormFilterService) {
    return eval('this.' + funcName + '();');
  }

  public async getFacturacionFilters() {
    console.log('is it working?')
  }
}
