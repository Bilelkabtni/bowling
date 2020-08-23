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

  constructor() {
    // init frame
    for (let i = 1; i <= 10; i++) {
      // last frame should be filled with [null, null, null]
      i !== 10 ? this.initFrame(i, [null, null]) : this.initFrame(i, [null, null, null]);
    }
  }

  // the hdcp is the maximum score
  get hdcp(): number {
    return Math.max(...this.frames.map(o => o.score), 0);
  }

  get isLastFrame(): boolean {
    return this.activeFrame?.id === 10;
  }

  /* *
      Helpers
   */

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
    // console.log(this.rolls);
    if (pin !== 10) {
      this.pins = [];
      for (let i = 0; i <= (10 - pin); i++) {
        this.pins.push(i);
      }
    }

    this.addFrame(pin);
    this.calculateAllScore();
    console.log('frame', this.frames)
  }

  addFrame(pin: number): void {
    if (this.rolls[this.currentFrame].length <= 2) {
      this.rolls[this.currentFrame].push(pin);
      if (pin === 10) {
        this.frames[this.currentFrame].frame[1] = pin;
        if (this.currentFrame !== 9) {
          this.incrementFrame();
          this.activateFrame();
        }
      } else {
        this.frames[this.currentFrame].frame[0] = pin;
        if (this.rolls[this.currentFrame].length === 2) {
          this.frames[this.currentFrame].frame = this.rolls[this.currentFrame];
          this.resetPins();
          if (this.currentFrame !== 9) {
            this.incrementFrame();
            this.activateFrame();
          }
        }
      }
    } else {
      this.resetPins();
    }
  }

  trackById(frame: Bowling): number {
    return frame.id;
  }

  selectFrame(index: number): void {
    this.currentFrame = index;
    // block the move when the last frame is empty
    // if (this.lastFilledFrame === 2 && index !== 0 || this.lastFrame?.strike) {
    //   this.activateFrame();
    // } else {
    //   // Case: user click on the first frame
    //   if (this.currentFrame !== 0) {
    //     alert('please fill the last frame');
    //     this.currentFrame = this.latestUnFiledFrame;
    //     this.activateFrame();
    //   } else {
    //     this.currentFrame = 0;
    //     this.activateFrame();
    //   }
    // }
  }

  protected incrementFrame() {
    this.currentFrame += 1;
  }

  protected decrementFrame() {
    this.currentFrame -= 1;
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
    this.activeFrame.active = true;
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

  private calculateAllScore(): void {
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
