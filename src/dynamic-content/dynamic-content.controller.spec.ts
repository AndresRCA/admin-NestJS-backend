import { Test, TestingModule } from '@nestjs/testing';
import { DynamicContentController } from './dynamic-content.controller';
import { DynamicContentService } from './dynamic-content.service';

describe('DynamicContentController', () => {
  let controller: DynamicContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicContentController],
      providers: [DynamicContentService],
    }).compile();

    controller = module.get<DynamicContentController>(DynamicContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
