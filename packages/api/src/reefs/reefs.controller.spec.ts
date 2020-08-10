import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReefsController } from './reefs.controller';
import { Reef } from './reefs.entity';
import { DailyData } from './daily-data.entity';
import { ReefsService } from './reefs.service';

describe('Reefs Controller', () => {
  let controller: ReefsController;
  let service: ReefsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Mock version of ReefRepository - it will inject the `useValue` as the service in the controller, so you can add
      // mock implementations there.
      providers: [
        ReefsService,
        { provide: getRepositoryToken(Reef), useClass: Repository },
        { provide: getRepositoryToken(DailyData), useClass: Repository },
      ],
      // You could also provide it the real ReefRepository, but then you'll also have to take care of providing *its*
      // dependencies too (e.g. with an `imports` block.
      // providers: [ReefRepository],
      controllers: [ReefsController],
    }).compile();

    service = module.get<ReefsService>(ReefsService);
    controller = module.get<ReefsController>(ReefsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
