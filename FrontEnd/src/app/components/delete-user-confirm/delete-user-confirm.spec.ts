import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserConfirm } from './delete-user-confirm';

describe('DeleteUserConfirm', () => {
  let component: DeleteUserConfirm;
  let fixture: ComponentFixture<DeleteUserConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserConfirm],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserConfirm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
