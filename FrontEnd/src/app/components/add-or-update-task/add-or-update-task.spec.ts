import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateTask } from './add-or-update-task';

describe('AddOrUpdateTask', () => {
  let component: AddOrUpdateTask;
  let fixture: ComponentFixture<AddOrUpdateTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrUpdateTask],
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
