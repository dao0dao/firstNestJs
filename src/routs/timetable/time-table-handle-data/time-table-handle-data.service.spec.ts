import { Test, TestingModule } from '@nestjs/testing';
import { TimeTableHandleDataService } from './time-table-handle-data.service';

describe('TimeTableHandleDataService', () => {
  let service: TimeTableHandleDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTableHandleDataService],
    }).compile();

    service = module.get<TimeTableHandleDataService>(TimeTableHandleDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
