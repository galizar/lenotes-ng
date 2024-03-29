import { Observable } from 'rxjs';

import { ObjectMap, Note, Group } from '@lenotes-ng/model';
import { CreateNoteDto, UpdateNoteDto } from '@lenotes-ng/data-storage';

export interface INoteService {
	/** Returns id of created note */
	create(dto: CreateNoteDto): Observable<Note['id']>;

	get(id: Note['id']): Observable<Note['props']>;
	getInGroup(groupId: Note['id']): Observable<ObjectMap<Note>>;
	getAll(): Observable<ObjectMap<Note>>;

	update(id: Note['id'], dto: UpdateNoteDto): Observable<object>;
	batchUpdate(ids: Note['id'][], dto: UpdateNoteDto): Observable<object>;
	trashInGroups(ids: Group['id'][]): Observable<object>;
	restoreInGroups(ids: Group['id'][]): Observable<object>;

	delete(id: Note['id']): Observable<object>;
	batchDelete(ids: Note['id'][]): Observable<object>;
}
