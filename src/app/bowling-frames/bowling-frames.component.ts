import {Bowling} from 'src/app/bowling-frames/bowling.interface';
import {Component} from '@angular/core';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss']
})
export class BowlingFramesComponent {
  pins = this.fillPins();
  rolls = [[], [], [], [], [], [], [], [], [], []];


  frames: Bowling[] = [];
  currentFrame = 0;
  totalScore = 300;

  hasBonus = false;

  constructor() {
    // init frame
    for (let i = 1; i <= 10; i++) {
      // last frame should be filled with [null, null, null]
      i !== 10 ? this.initFrame(i, [null, null]) : this.initFrame(i, [null, null, null]);
    }
  }

  // the hdcp is the maximum score
  get hdcp(): number {
    return Math.max(...this.frames.map(o => o.score || 0), 0);
  }

  /* *
      Helpers
   */

  get currentRoll(): number[] {
    return this.rolls[this.currentFrame];
  }

  get isLastFrame(): boolean {
    return this.currentFrame === 9;
  }

  get selectedFrame(): Bowling {
    return this.frames[this.currentFrame];
  }

  protected get activeFrame(): Bowling {
    return this.frames[this.currentFrame];
  }

  // todo reactor this to one func or create a prototype
  protected get latestFiledFrame(): number {
    let index = 0;
    for (let i = 0; i <= this.frames.length; i++) {
      const filled: number = this.frames[i]?.frame.filter(item => item !== null).length;
      if (filled <= 3 && filled >= 1) {
        index = i;
      }
    }
    return index;
  }

  /*
     Display Pins Value
   */
  displayPins(pin: number): void {
    if (pin !== 10) {
      this.pins = [];
      for (let i = 0; i <= (10 - pin); i++) {
        this.pins.push(i);
      }
    }

    console.log('currentRoll', this.currentRoll)

    if (this.currentRoll.length === 2) {
      this.rolls[this.currentFrame] = [];
      this.frames[this.currentFrame].frame = [null, null];
    }

    this.addFrame(pin);
    this.calculateScore();
    console.log('frame', this.frames);
  }

  addStrikeToLatestFrame(pin: number): void {
    this.hasBonus = true;
    if (this.selectedFrame.frame[0] === null) {
      this.selectedFrame.frame[0] = pin;
    } else if (this.selectedFrame.frame[1] === null) {
      this.selectedFrame.frame[1] = pin;
    } else if (this.selectedFrame.frame[2] === null) {
      this.selectedFrame.frame[2] = pin;
    }
    this.currentRoll.push(pin);
  }

  addFrame(pin: number): void {
    if (
      this.currentRoll.length <= 1
      || this.hasBonus && this.currentRoll.length !== 3) {
      if (
        pin === 10
        && this.isLastFrame
        || this.currentRoll.length === 2
        && this.hasBonus) {
        this.addStrikeToLatestFrame(pin);
        console.log('this.rolls', this.rolls);
      } else {
        this.displayOneFrame(pin);
        // just for displaying empty throw [null]
        if (this.isLastFrame && !this.hasBonus) {
          this.selectedFrame.frame[2] = null;
        }
      }
    } else {
      this.resetPins();
    }
  }

  trackById(frame: Bowling): number {
    return frame.id;
  }

  switchFrame(index: number): void {
    const lastCurrent: number = this.currentFrame;
    this.currentFrame = index;
    if (this.rolls[this.currentFrame - 1].length <= 1 ) {
      alert('please fill the latest frame');
      this.currentFrame = lastCurrent;
    }
    this.activateFrame();
  }

  protected incrementFrame() {
    this.currentFrame += 1;
  }

  /*
      Fill all pins form 1 to 10
   */
  protected fillPins(): number[] {
    return Array.from(Array(11).keys());
  }

  protected deactivateFrame(): void {
    this.frames.map(frame => frame.active = false);
  }

  protected activateFrame(): void {
    this.deactivateFrame();
    this.selectedFrame.active = true;
  }

  private displayOneFrame(pin: number): void {
    this.currentRoll.push(pin); // add pin
    this.addBonus(); // add bonus case of last frame

    // strike we need to add 10 to last elem
    if (pin === 10) {
      this.selectedFrame.frame[1] = pin;
      if (!this.isLastFrame) {
        this.incrementFrame();
        this.activateFrame();
      }
    } else {
      this.selectedFrame.frame[0] = pin;
      if (this.currentRoll.length === 2) {
        this.selectedFrame.frame = this.currentRoll;
        this.resetPins();
        // no need to increment when we are in the last frame
        if (!this.isLastFrame) {
          this.incrementFrame();
          this.activateFrame();
        }
      }
    }
  }

  private addBonus(): void {
    const isSpare: boolean = this.currentRoll[0] + this.currentRoll[1] === 10;
    const isStrike: boolean = this.currentRoll[0] === 10 || this.currentRoll[1] === 10;
    this.hasBonus = (isSpare || isStrike) && this.isLastFrame && this.currentRoll.length < 3;
  }

  private initFrame(id: number, frame: number[]): void {
    this.frames.push({
      id,
      frame,
      score: 0,
      active: false,
      showScore: true,
      spare: false,
      strike: false
    });
  }

  private calculateScore(): void {
    let sumOfScore = 0;
    let hasBonus = false;

    this.rolls.forEach((roll, index) => {
      const isSpare = roll[0] + roll[1] === 10;
      const isStrike = roll[0] === 10 && index < 9;

      if (index === 9) {
        hasBonus = isSpare || roll[0] === 10 || roll[1] === 10;
        if (hasBonus) {
          sumOfScore += roll[0] + roll[1] + roll[2];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        } else {
          sumOfScore += roll[0] + roll[1];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        }
      } else if (isStrike) { // strike
        if (this.rolls[index + 1][0] === 10 && index !== 8) {
          sumOfScore += 10 + 10 + this.rolls[index + 2][0];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        } else if (index === 8) {
          sumOfScore += 10 + 10 + this.rolls[index + 1][0];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        } else {
          sumOfScore += 10 + this.rolls[index + 1][0] + this.rolls[index + 1][1];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        }

      } else if (isSpare) {
        sumOfScore += 10 + this.rolls[index + 1][0];
        this.frames[index].score = sumOfScore;
        this.frames[index].showScore = true;
      } else {
        sumOfScore += roll[0] + roll[1];
        this.frames[index].score = sumOfScore;
        this.frames[index].showScore = true;
      }
    });
  }

  // reset pin after selecting tow frame
  private resetPins(): void {
    this.pins = this.fillPins();
  }
}
