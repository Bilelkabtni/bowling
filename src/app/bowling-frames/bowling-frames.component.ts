import {Component} from '@angular/core';
import {bowling} from 'src/app/bowling-frames/bowling.data';
import {Bowling} from 'src/app/bowling-frames/bowling.interface';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss']
})
export class BowlingFramesComponent {
  pins = this.fillPins();

  frames: Bowling[] = bowling;

  currentFrame = 0;
  totalScore = 300;

  constructor() {
  }

  /* *
      Helpers
   */

  // the hdcp is the maximum score
  get hdcp(): number {
    return Math.max(...this.frames.map(o => o.score), 0);
  }

  protected get activeFrame(): Bowling {
    return this.frames[this.currentFrame];
  }

  protected get lastFrame(): Bowling {
    return this.frames[this.currentFrame - 1];
  }

  protected get frameSize(): number {
    return this.activeFrame?.frame?.length || 0;
  }

  protected get filledFrame(): number {
    return this.activeFrame?.frame?.filter(item => item !== null).length;
  }

  protected get lastFilledFrame(): number {
    return this.lastFrame?.frame?.filter(item => item !== null).length;
  }

  protected get latestFiledFrame(): number {
    let index = 0;
    for (let i = 0; i <= this.frames.length; i++) {
      if (this.frames[i]?.frame.filter(item => item !== null).length === 2) {
        index = i;
      }
    }
    return index;
  }

  protected get latestUnFiledFrame(): number {
    let index = 0;
    for (let i = 0; i <= this.frames.length; i++) {
      if (this.frames[i]?.frame.filter(item => item === null).length === 0) {
        index = i;
      }
    }
    return index + 1;
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

    // decrement while ids are from 1 to 10
    if (this.currentFrame === 10) {
      this.decrementFrame();
    }
    // add bonus
    if (this.activeFrame?.id === 10) {
      this.addBonus(pin);
    }
    // add frame independently from bonus logic
    if (this.filledFrame !== 3) {
      this.addFrames(pin);
    }
    this.calculateAllScore();
  }

  trackById(frame: Bowling): number {
    return frame.id;
  }

  selectFrame(index: number): void {
    this.currentFrame = index;
    // block the move in case that the last frame is empty
    if (this.lastFilledFrame === 2 && index !== 0) {
      this.activateFrame();
    } else {
      // in case the user click to the first case
      if (this.currentFrame !== 0) {
        alert('please fill the last frame');
        this.currentFrame = this.latestUnFiledFrame;
        this.activateFrame();
      } else {
        this.currentFrame = 0;
        this.activateFrame();
      }
    }
  }

  protected incrementFrame() {
    this.currentFrame = this.currentFrame + 1;
  }

  protected decrementFrame() {
    this.currentFrame = this.currentFrame - 1;
  }

  protected setTotalScore(): void {
    this.totalScore -= 20 - this.sumOneFrames();
  }

  protected addScore(): void {
    this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
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

  private calculateAllScore(): void {
    for (let i = 1; i <= this.latestFiledFrame; i++) {
      const item = this.frames[i];
      const isSpare = (item.frame[0] + item.frame[1]) === 10;

      if (item.id >= this.activeFrame.id && this.lastFrame) {
        if (!item.strike) {
          item.score = this.frames[i - 1].score + item.frame[0] + item.frame[1];
        } else if (isSpare) {
          console.log('this.frames[i + 1]', this.frames[i + 1])
          console.log('this.frames[i - 1]', this.frames[i - 1])
          item.score = 10 + this.frames[i - 1].score + this.frames[i + 1].frame[0] + this.frames[i + 1].frame[1];
        } else {
          item.score = this.frames[i - 1].score + 10 + this.frames[i + 1].frame[0] + this.frames[i + 1].frame[1];
        }
        // this.totalScore += this.sumOneFrames();
      }
    }
  }

  private sumOneFrames(): number {
    return this.activeFrame.frame.reduce((item, acc) => acc + item, 0);
  }

  private getStrike(pin: number): void {
    if (this.filledFrame === 0) {
      this.activeFrame.frame[0] = pin;
      this.totalScore -= 10;
    } else {
      this.activeFrame.frame[1] = pin;
      this.setTotalScore();
      this.lastFrame.showScore = false;
      this.lastFrame.score = this.lastFrame.score + this.sumOneFrames();
      this.addScore();
      this.totalScore += this.sumOneFrames();
      this.lastFrame.showScore = true;
      this.resetPins();
      this.incrementFrame();
    }
  }

  private addPinToFrame(pin: number): void {
    if (this.filledFrame === 2 && this.activeFrame.id !== 10) {
      this.activeFrame.frame[0] = pin;
      this.activeFrame.frame[1] = null;
      this.totalScore += 20 - this.sumOneFrames();
    } else {
      if (this.filledFrame === 1) {
        if (this.activeFrame.frame[1] === null) {
          this.activeFrame.frame[1] = pin;
        }
        this.setTotalScore();
        this.sumOfFrames();
        if (this.activeFrame.id !== 10) {
          this.incrementFrame();
        }
        this.resetPins();
      } else {
        // add pin to last element and show spare
        if (this.lastFrame?.spare) {
          this.activeFrame.frame[0] = pin;
          this.showSpare(pin);
          this.totalScore -= 10 - this.sumOneFrames();
        } else {
          this.activeFrame.frame[0] = pin;
          this.totalScore -= 10;
        }
      }
    }
  }

  private addBonus(pin: number): void {
    if (this.activeFrame?.id === 10 && this.filledFrame === 2) {
      const isSPare: boolean = this.sumOneFrames() === 10;
      if (isSPare || pin === 10) {
        this.activeFrame.frame[2] = pin;
        this.addScore();
        this.totalScore = this.activeFrame.score;
        this.activeFrame.showScore = true;
        this.lastFrame.showScore = true;
      } else {
        this.currentFrame = 0;
        this.activateFrame();
      }
    }
    this.resetPins();
  }

  private calculateScore(pin: number): void {
    if (!this.lastFrame?.strike) {
      this.addPinToFrame(pin);
    } else {
      this.getStrike(pin);
    }
  }

  private addFrames(pin: number) {
    // make the frame sum
    this.frameIsFilled(pin);
    this.calculateScore(pin);
    console.log('frames', this.frames);
  }

  private sumOfFrames() {
    // need only the sum if one index
    if (this.currentFrame === 0) {
      this.activeFrame.score = this.sumOneFrames();
    } else {
      this.addScore();
    }
  }

  private addSpare(): void {
    this.activeFrame.score = 10 + this.lastFrame.score;
    this.activeFrame.spare = true;
    this.activeFrame.showScore = false;
  }

  private showSpare(pin: number): void {
    this.lastFrame.score = this.lastFrame.score + pin;
    this.lastFrame.showScore = true;
    this.lastFrame.spare = false;
  }

  private addStrike(): void {
    this.activeFrame.strike = true;
    this.activeFrame.frame[1] = 10;
    this.setTotalScore();
    this.activeFrame.showScore = false;
  }

  private frameIsFilled(pin: number): void {
    // activate frame
    this.activateFrame();

    // show strike
    if (pin === 10) {
      this.addStrike();
      if (this.lastFrame?.spare) {
        this.showSpare(pin);
      }
    } else {
      // show spare when sum is 10
      const sum: number = this.sumOneFrames() + pin;
      if (sum === 10) {
        this.addSpare();
      }
    }
  }

  // reset pin after selecting tow frame
  private resetPins(): void {
    this.pins = this.fillPins();
  }
}
