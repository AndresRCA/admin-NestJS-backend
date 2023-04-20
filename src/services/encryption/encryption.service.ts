import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) { }

  /*------------------------ DBFULL ENCRYPTION --------------------*/
  //Encripta la los datos
  public dbFullEncrypt(str: string) {
    return CryptoJS.AES.encrypt(str, this.configService.get('dbfull.encryptKey')!, {
      keySize: 16,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  // Encripta los datos que deben ser enviados en una peticion
  public dbFullEncrypDataHash(Datos: any) {
    return new Promise((resolve, reject) => {
      try {
        Object.entries(Datos).forEach(([keyOriginal, valueKey]: any, index: number) => {
          var Tamano = Object.keys(Datos);
          if (typeof valueKey != "number" && valueKey != "" && valueKey != undefined && valueKey != null) {
            const Encrypt = this.dbFullEncrypt(valueKey); //Encripto
            Datos[keyOriginal] = Encrypt;
          }
          if (index == Tamano.length - 1) {
            resolve(Datos);
          }
        })
      } catch (error) {
        reject(error);
      }
    })
  }
  /*---------------------------------------------------------------*/
}
