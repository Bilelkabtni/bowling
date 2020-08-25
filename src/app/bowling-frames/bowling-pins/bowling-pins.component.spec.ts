import {fakeAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {BowlingPinsComponent} from './bowling-pins.component';

describe('BowlingPinsComponent', () => {
  let fixture: ComponentFixture<BowlingPinsComponent>;
  let component: BowlingPinsComponent;
  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(BowlingPinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create component', () => {
    const comp = new BowlingPinsComponent();
    expect(comp).toBeTruthy();
  });

  it('should have the remaining pins after a roll', () => {
    const comp = new BowlingPinsComponent();
    comp.addPin(3);
    fixture.detectChanges();

    expect(comp.pins).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('should have zero after a strike', () => {
    const comp = new BowlingPinsComponent();
    comp.addPin(10);
    fixture.detectChanges();

    expect(comp.pins).toEqual([]);
  });

  it('should emit the selected pin', () => {
    const comp = new BowlingPinsComponent();
    spyOn(comp.selectedPin, 'emit');
    comp.addPin(6);
    fixture.detectChanges();

    expect(comp.selectedPin.emit).toHaveBeenCalledWith(6);
    expect(comp.selectedPin.emit).toHaveBeenCalledTimes(1);
  });
});
