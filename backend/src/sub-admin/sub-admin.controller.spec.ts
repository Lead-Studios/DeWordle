import { Test, TestingModule } from '@nestjs/testing';
import { SubAdminController } from './sub-admin.controller';
import { SubAdminService } from './sub-admin.service';

describe('SubAdminController', () => {
  let controller: SubAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAdminController],
      providers: [SubAdminService],
    }).compile();

    controller = module.get<SubAdminController>(SubAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
