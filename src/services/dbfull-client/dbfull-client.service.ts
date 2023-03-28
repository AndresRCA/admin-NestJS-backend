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
        'TokenAuthPlataform': this.configService.get('dbfull.authToken'),
        'type': this.encryptionService.dbFullEncrypt('any-queries')
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
    let res = await this.dbFullClient.get(this.configService.get('dbfull.url')!, {
      headers: {
        'db': this.encryptionService.dbFullEncrypt(dbName),
        'x-data-query': this.encryptionService.dbFullEncrypt(query)
      }
    });
    return res.data;
  }
}
