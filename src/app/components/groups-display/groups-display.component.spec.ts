import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { By } from '@angular/platform-browser';

import { GroupsDisplayComponent } from './groups-display.component';
import { AppStateService, GroupService, NoteService } from 'src/app/services';
import { testNotes, groupServiceStubBuilder, noteServiceStubBuilder, appStateServiceStubBuilder} from 'src/assets/test';
import { DebugElement } from '@angular/core';
import { Note } from 'src/app/model';

describe('GroupsDisplayComponent', () => {
  let component: GroupsDisplayComponent;
  let fixture: ComponentFixture<GroupsDisplayComponent>;
	let debugElement: DebugElement;
	
  beforeEach(async () => {

		const appStateServiceStub = appStateServiceStubBuilder.build();
		const groupServiceStub = groupServiceStubBuilder.build();
		const noteServiceStub = noteServiceStubBuilder.build();

    await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
      declarations: [ GroupsDisplayComponent ],
			providers: [
				{ provide: GroupService, useValue: groupServiceStub }, 
			  { provide: NoteService, useValue: noteServiceStub },
				{ provide: AppStateService, useValue: appStateServiceStub }
			]
    })
    .compileComponents();
  });

	beforeEach(() => {
    fixture = TestBed.createComponent(GroupsDisplayComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
		debugElement = fixture.debugElement;
	});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

	it('displays the correct list of group buttons', () => {

		// it should display only buttons for groups that
		// are not trashed. trashed groups will be handled
		// elsewhere
		let expectedButtonCount = -1; // dummy, otherwise the compiler blabs
		component.vm$.subscribe(vm => {
			expectedButtonCount = vm.groups.filter(group => !group.isTrashed).length;
		});

		const groupButtons = debugElement.queryAll(By.css('.group-button'));

		expect(groupButtons.length).toEqual(expectedButtonCount);
	});

	it('selects group when group button is clicked', () => {

		let expectedGroupOnDisplayId: number | undefined;
		const firstGroupButton = debugElement.query(By.css('.group-button'));
		expectedGroupOnDisplayId = Number(firstGroupButton.attributes['data-group-id']);

		firstGroupButton.triggerEventHandler('click');

		fixture.detectChanges();
		let actualGroupOnDisplayId: number | undefined;
		component.vm$.subscribe(vm => actualGroupOnDisplayId = vm.groupOnDisplayId);

		expect(actualGroupOnDisplayId).toEqual(expectedGroupOnDisplayId);
	});

	it('moves dropped note to group over which it was dropped', () => {

		let noteToMove = testNotes[0];
		let otherNote = testNotes[1]
		const toGroupId = otherNote.groupId;
		const dataTransfer = new DataTransfer();
		dataTransfer.setData('Note', JSON.stringify(noteToMove));
		const droppedNoteEvent = new DragEvent('drop', {dataTransfer});

		component.dropOnGroup(droppedNoteEvent, toGroupId);

		// if the note was moved successfully then the note should be in 
		// the state when the group it was moved to is on display
		component.appStateService.setGroupOnDisplayId(toGroupId);

		let actualNote: Note | undefined;
		component.noteStateService.notes$.subscribe(notes => {
			actualNote = notes.find(n => n.id === noteToMove.id);
		});

		if (!actualNote) return fail('note is not being moved to target group');
		expect(actualNote.groupId).toEqual(toGroupId);
	});
});
