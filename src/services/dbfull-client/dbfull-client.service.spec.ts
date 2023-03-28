import { Test, TestingModule } from '@nestjs/testing';
import { DbfullClientService } from './dbfull-client.service';

describe('DbfullClientService', () => {
  let service: DbfullClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbfullClientService],
    }).compile();

    service = module.get<DbfullClientService>(DbfullClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
