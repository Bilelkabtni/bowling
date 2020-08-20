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
  hdcpScore = 0;
  totalScore = 300;

  constructor() {
  }

  /* *
      Helpers
   */

  get activeFrame(): Bowling {
    return this.frames[this.currentFrame];
  }

  get lastFrame(): Bowling {
    return this.frames[this.currentFrame - 1];
  }

  get frameSize(): number {
    return this.activeFrame?.frame?.length || 0;
  }

  get filledFrame(): number {
    return this.activeFrame?.frame?.filter(item => item !== null).length;
  }

  get lastFilledFrame(): number {
    return this.lastFrame?.frame?.filter(item => item !== null).length;
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
    this.addFrames(pin);
  }

  trackById(frame: Bowling): number {
    return frame.id;
  }

  selectFrame(index: number): void {
    if (this.lastFilledFrame === 2) {
      this.currentFrame = index;
      this.activateFrame();
    } else {
      alert('please fill the previous frame')
    }

    // if (this.frameSize > 0) {
    //   this.resetFrame();
    // }
  }

  incrementFrame() {
    this.currentFrame = this.currentFrame + 1;
  }

  decrementFrame() {
    this.currentFrame = this.currentFrame - 1;
  }

  setTotalScore(): void {
    this.totalScore -= 20 - this.sumOneFrames();
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

  /*
      Reset Frame
   */
  protected resetFrame(): void {
    this.activeFrame.frame = [null, null];
    this.activeFrame.score = 0;
    this.activeFrame.active = false;
    this.activeFrame.showScore = true;
    this.activeFrame.strike = false;
    this.activeFrame.spare = false;
    this.resetPins();
  }

  private sumOneFrames(): number {
    return this.activeFrame.frame[0] + this.activeFrame.frame[1];
  }

  private fillLastFrame(pin: number): void {
    console.log('fillLastFrame');
    switch (this.filledFrame) {
      case 0:
        this.activeFrame.frame[0] = pin;
        break;
      case 1:
        this.activeFrame.frame[1] = pin;
        break;
      case 2:
        this.activeFrame.frame[2] = pin;
        this.resetPins(); // reset when the last 2 throw are filled
        break;
    }
  }

  private getStrike(pin: number): void {
    if (this.filledFrame === 0) {
      this.activeFrame.frame[0] = pin;
      this.totalScore -= 10;
    } else {
      console.log('getStrike aaa');
      this.activeFrame.frame[1] = pin;
      this.setTotalScore();
      this.lastFrame.showScore = false;

      this.lastFrame.score = this.lastFrame.score + this.sumOneFrames();
      this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
      this.totalScore +=  this.sumOneFrames();
      this.lastFrame.showScore = true;
      this.resetPins();
      this.incrementFrame();
    }
  }

  private addPinToFrame(pin: number): void {
    if (this.filledFrame === 2) {
      this.activeFrame.frame[0] = pin;
      this.activeFrame.frame[1] = null;
      this.totalScore += 20 - this.sumOneFrames();
    } else {
      if (this.filledFrame === 1) {
        this.activeFrame.frame[1] = pin;
        this.setTotalScore();
        this.sumOfFrames();
        console.log('increment');
        this.incrementFrame();
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

  private calculateBonusScore(pin: number): void {
    // if (this.lastFilledFrame === 2 && this.currentFrame >= 0) {
      if (!this.lastFrame?.strike) {
        this.addPinToFrame(pin);
      } else {
        this.getStrike(pin);
      }
    }
    // else {
    //   alert('please fill previous frame')
    // }
  // }

  private addFrames(pin: number) {
    // make the frame sum
    this.frameIsFilled(pin);

    // last frame check
    if (this.activeFrame.id === 10) {
      this.fillLastFrame(pin);
    } else {
      this.calculateBonusScore(pin);
    }

    console.log('frames', this.frames);
  }

  private sumOfFrames() {
    // need only the sum if one index
    if (this.currentFrame === 0) {
      this.activeFrame.score = this.sumOneFrames();
    } else {
      this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
    }
  }

  private addSpare(pin: number): void {
    console.log('addSpare');
    this.activeFrame.score = 10 + this.lastFrame.score;
    this.activeFrame.spare = true;
    this.activeFrame.showScore = false;
  }

  private showSpare(pin: number): void {
    console.log('showSpare');
    this.lastFrame.score = this.lastFrame.score + pin;
    this.lastFrame.showScore = true;
    this.lastFrame.spare = false;
  }

  private addStrike(pin: number): void {
    // console.log('addStrike');
    this.activeFrame.strike = true;
    this.activeFrame.frame[1] = 10;
    this.setTotalScore();
    this.activeFrame.showScore = false;
    // this.incrementFrame();
  }

  private frameIsFilled(pin: number): void {
    // activate frame
    this.activateFrame();

    // show strike
    if (pin === 10 || this.activeFrame?.strike) {
      this.addStrike(pin);
    } else {
      // show spare when sum is 10
      const sum: number = this.sumOneFrames() + pin;
      if (sum === 10 && this.lastFrame) {
        console.log('show addSpare');
        this.addSpare(pin);
      }
    }
  }

  private resetPins(): void {
    this.pins = this.fillPins();
  }

}
