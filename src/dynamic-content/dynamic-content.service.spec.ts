import { Test, TestingModule } from '@nestjs/testing';
import { DynamicContentService } from './dynamic-content.service';

describe('DynamicContentService', () => {
  let service: DynamicContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicContentService],
    }).compile();

    service = module.get<DynamicContentService>(DynamicContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
