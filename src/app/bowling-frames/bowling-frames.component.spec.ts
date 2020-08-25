import {fakeAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {BowlingFramesComponent} from './bowling-frames.component';

describe('BowlingFramesComponent', () => {
  let fixture: ComponentFixture<BowlingFramesComponent>;
  let component: BowlingFramesComponent;
  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(BowlingFramesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create component', () => {
    const comp = new BowlingFramesComponent();
    expect(comp).toBeTruthy();
  });

  it('should add frames', () => {
    const comp = new BowlingFramesComponent();
    comp.frames = [
      {
        id: 1,
        frame: [
          4,
          1
        ],
        score: 5,
        active: true,
        showScore: true
      },
      {
        id: 2,
        frame: [
          4,
          5
        ],
        score: 14,
        active: false,
        showScore: true
      },
      {
        id: 3,
        frame: [
          6,
          4
        ],
        score: 29,
        active: false,
        showScore: true
      },
      {
        id: 4,
        frame: [
          5,
          5
        ],
        score: 49,
        active: false,
        showScore: true
      },
      {
        id: 5,
        frame: [
          null,
          10
        ],
        score: 60,
        active: false,
        showScore: true
      },
      {
        id: 6,
        frame: [
          0,
          1
        ],
        score: 61,
        active: false,
        showScore: true
      },
      {
        id: 7,
        frame: [
          7,
          3
        ],
        score: 77,
        active: false,
        showScore: true
      },
      {
        id: 8,
        frame: [
          6,
          4
        ],
        score: 97,
        active: false,
        showScore: true
      },
      {
        id: 9,
        frame: [
          null,
          10
        ],
        score: 117,
        active: false,
        showScore: true
      },
      {
        id: 10,
        frame: [
          2,
          8,
          6
        ],
        score: 133,
        active: false,
        showScore: true
      }
    ];
    fixture.detectChanges();

    expect(comp.rolls.length).toEqual(10);
  });

  it('should add strike', () => {
    const comp = new BowlingFramesComponent();
    const frame = comp.frames;
    comp.addPin(10);
    comp.addPin(1);
    comp.addPin(2);
    fixture.detectChanges();
    expect(frame[1].score).toEqual(16);
    expect(frame[0].score).toEqual(13);
  });

  it('should add spare', () => {
    const comp = new BowlingFramesComponent();
    comp.addPin(9);
    comp.addPin(1);
    comp.addPin(2);
    comp.addPin(2);
    fixture.detectChanges();
    expect(comp.frames[0].score).toEqual(12);
    expect(comp.frames[1].score).toEqual(16);
  });

  it('should verify announcement example', () => {
    const comp = new BowlingFramesComponent();
    const frame = comp.frames;
    // frame num 1
    comp.addPin(1);
    comp.addPin(4);
    // frame num 2
    comp.addPin(4);
    comp.addPin(5);
    // frame num 3
    comp.addPin(6);
    comp.addPin(4);
    // frame num 4
    comp.addPin(5);
    comp.addPin(5);
    // frame num 5
    comp.addPin(10);
    // frame num 6
    comp.addPin(0);
    comp.addPin(1);
    // frame num 7
    comp.addPin(7);
    comp.addPin(3);
    // frame num 8
    comp.addPin(6);
    comp.addPin(4);
    // frame num 9
    comp.addPin(10);
    // frame num 10
    comp.addPin(2);
    comp.addPin(8);
    comp.addPin(6);

    fixture.detectChanges();
    expect(frame[0].score).toEqual(5);
    expect(frame[1].score).toEqual(14);
    expect(frame[2].score).toEqual(29);
    expect(frame[3].score).toEqual(49);
    expect(frame[4].score).toEqual(60);
    expect(frame[5].score).toEqual(61);
    expect(frame[6].score).toEqual(77);
    expect(frame[7].score).toEqual(97);
    expect(frame[7].score).toEqual(97);
    expect(frame[8].score).toEqual(117);
    expect(frame[9].score).toEqual(133);
  });
});
