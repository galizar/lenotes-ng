import { ApiNotesService } from "./api-notes.service";
import { DomainObjectStorage, NaiveNotesStorage } from '@lenotes-ng/data-storage';
import { Note, testNotes } from '@lenotes-ng/model';
import { UpdateNoteDto } from '../../index';

describe('ApiNotesService', () => {

	let storage: DomainObjectStorage<Note>;
	let service: ApiNotesService;

	beforeEach(() => {
		storage = new NaiveNotesStorage;
		service = new ApiNotesService(storage);
	});

	it('gets note', () => {

		const noteToGet = testNotes[0];

		const actualNote = service.get(noteToGet.id);

		expect(actualNote).toEqual(noteToGet);
	});

	it('gets notes in group', () => {

		const groupId = 1;
		const expectedNotes = testNotes.filter(n => n.groupId === groupId).sort((a, b) => a.id - b.id);

		const actualNotes = service.getInGroup(groupId).sort((a, b) => a.id - b.id);

		expect(actualNotes).toEqual(expectedNotes);
	});

	it('creates note', () => {

		let expectedNote = {
			// no id here. id is defined by service
			name: 'a test note',
			groupId: 0,
			content: 'some content created at ' + Date.now(),
			isTrashed: false
		} 

		const createdNoteId = service.create(expectedNote);
		const actualNote = service.get(createdNoteId);

		for (const prop of Object.keys(expectedNote)) {
			const key = prop as keyof typeof expectedNote;
			expect(actualNote[key]).toEqual(expectedNote[key]);
		}
		expect(createdNoteId).toBe(actualNote.id);
	});

	describe('note update operations', () => {

		const updateTestFunction = (updateDto: UpdateNoteDto) => {
			const noteToUpdate = service.get(0);

			service.update(noteToUpdate.id, updateDto);

			const actualNote = service.get(noteToUpdate.id);
			for (const [prop, value] of Object.entries(updateDto)) {
				expect(actualNote[prop as keyof UpdateNoteDto]).toEqual(value)
			}
		};

		it('update name', () => {
			updateTestFunction({name: 'new name created at ' + Date.now()});
		});

		it('update groupId', () => {
			updateTestFunction({groupId: 1});
		});
		
		it('updates content', () => {
				updateTestFunction({content: 'this is some fresh content created at ' + Date.now()});
			}
		);

		it('updates isTrashed', () => {
			updateTestFunction({isTrashed: true});
		});
	});

	it('removes note', () => {

		const noteToRemove = service.get(0);

		service.delete(noteToRemove.id);

		expect(() => {
			service.get(noteToRemove.id);
		}).toThrowError();
	});
});