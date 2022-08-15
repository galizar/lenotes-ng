import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '@lenotes-ng/api-interfaces';
import { UpdateGroupDto } from '@lenotes-ng/api-interfaces';

import { DomainObjectStorage } from '@lenotes-ng/data-storage';
import { Group } from '@lenotes-ng/model';

@Injectable()
export class GroupsService {

	constructor(
		private storage: DomainObjectStorage<Group>
	) {}

  create(createGroupDto: CreateGroupDto) {

		const newGroup = {
			...createGroupDto,
			id: -1 // id will be set by storage service
		};
		return this.storage.create(newGroup);
  }

  getAll() {
		return this.storage.getAll();
  }

  get(id: number): Group {
		return this.storage.get(id);
  }

  update(id: number, dto: UpdateGroupDto) {

		const groupToUpdate = this.get(id);
		const updatedGroup = {...groupToUpdate, ...dto};
		this.storage.update(updatedGroup);
  }

  remove(id: number) {
		this.storage.delete(id);
  }
}
