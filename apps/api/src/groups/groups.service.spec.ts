import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

	it('creates group', () => {
		fail('not impl');
	});

	it('updates group name', () => {
		fail('not impl');
	});

	it('updates group isTrashed property', () => {
		fail('not impl');
	});

	it('removes group', () => {
		fail('not impl');
	});
});
