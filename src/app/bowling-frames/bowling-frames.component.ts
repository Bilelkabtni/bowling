import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Frame} from 'src/app/bowling-frames/frame.interface';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BowlingFramesComponent {
  pins = this.fillPins();
  rolls = [[], [], [], [], [], [], [], [], [], []];

  frames: Frame[] = [];
  currentFrame = 0;
  hasBonus = false;

  constructor() {
    // init frame
    for (let i = 1; i <= 10; i++) {
      // last frame should be filled with [null, null, null]
      i !== 10 ? this.initFrame(i, [null, null]) : this.initFrame(i, [null, null, null]);
    }
    // activate first frame by default
    this.activateFrame();
  }

  // the score is the maximum score value
  get score(): number {
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

  get selectedFrame(): Frame {
    return this.frames[this.currentFrame];
  }

  /*
     Display Pins Value
   */
  addPin(pin: number): void {
    this.resetActiveFrame();
    this.addPinToFrame(pin);
    this.calculateScore();
  }

  addStrikeToLatestFrame(pin: number): void {
    this.hasBonus = true;
    if (this.selectedFrame.frame[0] === null) {
      this.selectedFrame.frame[0] = pin;
    } else if (this.selectedFrame.frame[1] === null) {
      this.selectedFrame.frame[1] = pin;
      this.resetPins();
    } else if (this.selectedFrame.frame[2] === null) {
      this.selectedFrame.frame[2] = pin;
    }
    this.currentRoll.push(pin);
    // reset pin and go back to the first case in case last frame is filled
    if (this.currentRoll.length === 3) {
      this.resetPins();
      this.currentFrame = 0;
      this.activateFrame();
    }
  }

  addPinToFrame(pin: number): void {
    // in the last frame the user could add 10 to the first or second throw
    if (this.currentRoll.length <= 1 || this.hasBonus && this.currentRoll.length !== 3) {
      if (pin === 10 && this.isLastFrame  || this.currentRoll.length === 2 && this.hasBonus) {
        this.addStrikeToLatestFrame(pin);
        console.log('this.rolls', this.rolls);
      } else {
        // display one frame
        this.displayOneFrame(pin);
        // just for displaying empty throw [null]
        if (this.isLastFrame && !this.hasBonus) {
          this.selectedFrame.frame[2] = null;
        }
      }
    } else {
      // reset pins
      this.resetPins();
    }
  }

  trackById(frame: Frame): number {
    return frame.id;
  }

  switchFrame(index: number): void {
    const lastCurrent: number = this.currentFrame || 0;
    this.currentFrame = index;
    const currRoll = this.rolls[this.currentFrame - 1];
    // block moves when previous frame is empty
    if (currRoll?.length <= 1 && !currRoll.includes(10)) {
      alert('Finish scoring current frame before selecting new frame');
      this.currentFrame = lastCurrent;
    }
    console.log('index is', this.currentFrame);
    this.activateFrame();
  }

  private incrementFrame() {
    this.currentFrame += 1;
  }

  /*
      Fill all pins form 1 to 10
   */
  private fillPins(): number[] {
    return Array.from(Array(11).keys());
  }

  private deactivateFrame(): void {
    this.frames.map(frame => frame.active = false);
  }

  private activateFrame(): void {
    this.deactivateFrame();
    this.selectedFrame.active = true;
  }

  private resetActiveFrame(): void {
    // reset frame with index < 9
    if (this.currentRoll.length === 2 && !this.isLastFrame
      || this.currentRoll.includes(10) && !this.isLastFrame) {
      this.rolls[this.currentFrame] = [];
      this.frames[this.currentFrame].frame = [null, null];
    }
    // reset last frame
    if (this.currentRoll.length === 3 && this.isLastFrame) {
      this.rolls[this.currentFrame] = [];
      this.frames[this.currentFrame].frame = [null, null, null];
    }
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
      showScore: true
    });
  }

  private calculateScore(): void {
    let sumOfScore = 0;
    let hasBonus = false;

    this.rolls.forEach((roll, index) => {
      // throw index
      const currThrow: number = roll[0];
      const nextThrow: number = roll[1];
      const bonusThrow: number = roll[2];

      // frame index
      const currFrame: Frame = this.frames[index];

      // roll index
      const nextRoll: number[] = this.rolls[index + 1];
      const nextTowRoll: number[] = this.rolls[index + 2];

      // add bonus score
      const isSpare = currThrow + nextThrow === 10;
      const isStrike = currThrow === 10 && index < 9;

      if (index === 9) {
        hasBonus = isSpare || currThrow === 10 || nextThrow === 10;
        if (hasBonus) {
          sumOfScore += currThrow + nextThrow + bonusThrow;
          currFrame.score = sumOfScore;
          currFrame.showScore = true;
        } else {
          sumOfScore += currThrow + nextThrow;
          currFrame.score = sumOfScore;
          currFrame.showScore = true;
        }
      } else if (isStrike) { // strike
        if (nextRoll[0] === 10 && index !== 8) {
          sumOfScore += 10 + 10 + nextTowRoll[0];
          currFrame.score = sumOfScore;
          currFrame.showScore = true;
        } else {
          sumOfScore += 10 + nextRoll[0] + nextRoll[1];
          currFrame.score = sumOfScore;
          currFrame.showScore = true;
        }

      } else if (isSpare) { // spare
        sumOfScore += 10 + nextRoll[0];
        currFrame.score = sumOfScore;
        currFrame.showScore = true;
      } else {
        sumOfScore += currThrow + nextThrow;
        currFrame.score = sumOfScore;
        currFrame.showScore = true;
      }
    });
  }

  // reset pin after selecting tow frame
  private resetPins(): void {
    this.pins = this.fillPins();
  }
}
