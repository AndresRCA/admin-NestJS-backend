import { Test, TestingModule } from '@nestjs/testing';
import { FormFilterService } from './form-filter.service';

describe('FormFilterService', () => {
  let service: FormFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormFilterService],
    }).compile();

    service = module.get<FormFilterService>(FormFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
