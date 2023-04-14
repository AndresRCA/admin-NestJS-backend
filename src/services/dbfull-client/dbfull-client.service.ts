import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EncryptionService } from '../encryption/encryption.service';

/**
 * Servicio que se encarga de realizar operaciones con el backend dbfull, su 'type' por defecto para realizar
 * operaciones es 'any-queries'.
 */
@Injectable()
export class DbfullClientService {
  // instancia custom de axios que tendra la configuracion por defecto para cada operacion que involucre el backend dbfull
  private readonly dbFullClient: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {
    // inicializa un objeto custom de axios con la siguiente configuracion
    this.dbFullClient = axios.create({
      headers: {
        'Authorization': 'Basic ' + Buffer.from(this.configService.get('dbfull.authBasic')!).toString('base64'),
        'TokenAuthPlataform': this.configService.get('dbfull.authToken')
      }
    });
  }

  /**
   * Ejecuta un query sql para la base de datos dada
   * @param query sql query
   * @param dbName nombre de la base de datos a usar
   * @returns resultado del query (data)
   */
  public async execute(query: string, dbName: string) {
    this.configService.get('dbfull.url')
    let res = await this.dbFullClient.get(`${this.configService.get('dbfull.url')}/api`, {
      headers: {
        'db': this.encryptionService.dbFullEncrypt(dbName),
        'x-data-query': this.encryptionService.dbFullEncrypt(query),
        'type': this.encryptionService.dbFullEncrypt('any-queries')
      }
    });
    return res.data;
  }

  async GetAllData(table: string) {
    return new Promise(async (resolve, reject) => {
      axios.get(`/api/v1/find-all-info/${this.configService.get('dbfull.dbClubFibex')}/${table}`)
        .then((resp: any) => resolve(resp.data))
        .catch((error: any) => reject(error));
    })
  }

  async GetAllT() {
    return new Promise(async (resolve, reject) => {
      axios.get(`/api/v1/show-all-info/${this.configService.get('dbfull.dbClubFibex')}`)
        .then((resp: any) => resolve(resp.data))
        .catch((error: any) => reject(error));
    })
  }

  async GetAllDataCampo(table: string, campo: string, valor: any) {
    const iURL = `/api/v1/find-any-info/${this.configService.get('dbfull.dbClubFibex')}/${table}/${campo}/${valor}`
    console.log(iURL)
    let res = await this.dbFullClient.get(iURL);
    return res.data;
  }

  async GetAllEstrucura(table: string, campo: string, valor: any) {
    //https://backend.thomas-talk.me/api/v1/find-any-info/thomas_clubfibex/cb_Estructura/TableName/cb_EmpresaConvenio
    return new Promise(async (resolve, reject) => {
      this.dbFullClient.get(`/api/v1/find-any-info/${this.configService.get('dbfull.dbClubFibex')}/${table}/${campo}/${valor}`)
        .then((resp: any) => resolve(resp.data))
        .catch((error: any) => reject(error));
    })
  }

  async CreateData(table: string, idkey: string, body: any) {
    return new Promise(async (resolve, reject) => {
      console.log("body");
      console.log(body);
      console.log("key");
      console.log(idkey)
      console.log("table");
      console.log(table);

      let config = {
        method: 'post',
        url: `${this.configService.get('dbfull.url')}/api/v1/create-info/${this.configService.get('dbfull.dbClubFibex')}/${table}`,
        headers: {
          'x-keys-to-add-id': `["${idkey}"]`,
          'x-keys-of-arrays': '[]',
          'x-relations': 'false',
          'Content-Type': 'application/json'
        },
        data: body
      };
      axios.request(config)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    })
  }
}
