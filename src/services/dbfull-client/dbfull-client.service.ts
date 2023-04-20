import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EncryptionService } from '../encryption/encryption.service';

/**
 * Servicio que se encarga de realizar operaciones con el backend dbfull.
 */
@Injectable()
export class DbfullClientService {
  // instancia custom de axios que tendra la configuracion por defecto para cada operacion que involucre el backend dbfull
  private readonly http: AxiosInstance;

  // no se para que se utiliza esto aqui en este servicio especificamente
  private ShowInfoTable: any = "";

  constructor(
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {
    // inicializa un objeto custom de axios con la siguiente configuracion
    this.http = axios.create({
      headers: {
        'Authorization': 'Basic ' + Buffer.from(this.configService.get('dbfull.authBasic')!).toString('base64'),
        'TokenAuthPlataform': this.configService.get('dbfull.authToken')
      }
    });

    // No estoy seguro si este metodo actua como un tipo de cache para ShowInfoTable
    this.showInfo();
  }

  /**
   * Ejecuta un query sql para la base de datos dada
   * @param query sql query
   * @param dbName nombre de la base de datos a usar
   * @returns resultado del query (data)
   */
  public async execute(query: string, dbName: string): Promise<any> {
    this.configService.get('dbfull.url')
    let res = await this.http.get(`${this.configService.get('dbfull.url')}/api`, {
      headers: {
        'db': this.encryptionService.dbFullEncrypt(dbName),
        'x-data-query': this.encryptionService.dbFullEncrypt(query),
        'type': this.encryptionService.dbFullEncrypt('any-queries')
      }
    });
    return res.data;
  }

  async getAllData(table: string) {
    let resp = await this.http.get(`/api/v1/find-all-info/${this.configService.get('dbfull.dbClubFibex')}/${table}`);
    return resp.data;
  }

  async getAllT() {
    let resp = await this.http.get(`/api/v1/show-all-info/${this.configService.get('dbfull.dbClubFibex')}`);
    return resp.data;
  }

  async getAllDataCampo(table: string, campo: string, valor: any) {
    const iURL = `/api/v1/find-any-info/${this.configService.get('dbfull.dbClubFibex')}/${table}/${campo}/${valor}`;
    console.log(iURL);
    let res = await this.http.get(iURL);
    return res.data;
  }

  async getAllEstrucura(table: string, campo: string, valor: any) {
    //https://backend.thomas-talk.me/api/v1/find-any-info/thomas_clubfibex/cb_Estructura/TableName/cb_EmpresaConvenio
    let resp = await this.http.get(`/api/v1/find-any-info/${this.configService.get('dbfull.dbClubFibex')}/${table}/${campo}/${valor}`);
    return resp.data;
  }

  async createData(table: string, idkey: string, body: any) {
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
    let res = await axios.request(config);
    return res.data;
  }

  async updateData(table: string, campoSearch: string, body: any) {
    let config = {
      method: 'put',
      url: `${this.configService.get('dbfull.url')}/api/v1/update-info/${this.configService.get('dbfull.dbClubFibex')}/${table}/${campoSearch}`,
      headers: {
        'x-multiple-update': 'false',
        'x-elements-obj': '[]',
        'x-attr-duplicate': '[]',
        'campo': '',
        'Content-Type': 'application/json'
      },
      data: body
    };
    let res = await axios.request(config);
    return res.data;
  }

  async showInfo() {
    if (this.ShowInfoTable && this.ShowInfoTable != "") {
      return this.ShowInfoTable;
    }

    let config = {
      method: 'get',
      url: `${this.configService.get('dbfull.url')}/api/v1/show-all-info/${this.configService.get('dbfull.dbClubFibex')}`,
    };
    let res = await axios.request(config);
    this.ShowInfoTable = res.data;
    return res.data;
  }

  private filtrado(table: any) {
    let info = this.ShowInfoTable.model.filter((datadb: any) => (datadb.tableName === table));
    if (info.length > 0) {
      info = info[0].attr.filter((camposexluido: any) => (camposexluido != "createdAt" && camposexluido != "updatedAt"));
    }
    return info; // retorna o un arreglo vacio (filter puede retornar vacio) o un arreglo modificado
  }

  async camposTableReturn(table: string) {
    if (!table || table == "") {
      throw new Error("Error debes poner un nombre de tabla");
    }

    if (this.ShowInfoTable && this.ShowInfoTable != "") {
      let info = this.filtrado(table);
      return info;
    }

    let resp = await this.showInfo();
    this.ShowInfoTable = resp;
    let info = this.filtrado(table);
    return info;
  }
}
