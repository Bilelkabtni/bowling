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
    this.currentFrame = index;
    // block the move in case that the last frame is empty
    if (this.lastFilledFrame === 2 && index !== 0) {
      this.activateFrame();
    } else {
      // in case the user click to the first case
      if (this.currentFrame !== 0) {
        alert('please fill the last frame');
        this.currentFrame = index - 1;
        this.activateFrame();
      } else {
        this.currentFrame = 0;
        this.activateFrame();
      }
    }
  }

  calculateScore(): void {
    this.frames.map(item => item.frame.forEach(f =>  this.addFrames(f)));
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

  private sumOneFrames(): number {
    return this.activeFrame.frame.reduce((item, acc) => acc + item, 0);
  }

  private fillLastFrame(pin: number): void {
    console.log('fillLastFrame');
    switch (this.filledFrame) {
      case 0:
        this.activeFrame.frame[0] = pin;
        this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
        break;
      case 1:
        this.activeFrame.frame[1] = pin;
        this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
        break;
      case 2:
        const isSPare: boolean = (this.sumOneFrames() + pin) === 10;
        if (isSPare || pin === 10) {
          this.activeFrame.frame[2] = pin;
          this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
        } else {
          this.currentFrame = 0;
          this.activateFrame();
        }
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
      this.totalScore += this.sumOneFrames();
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
    if (!this.lastFrame?.strike) {
      this.addPinToFrame(pin);
    } else {
      this.getStrike(pin);
    }
  }

  private addFrames(pin: number) {
    // make the frame sum
    this.frameIsFilled(pin);

    // last frame check
    if (this.activeFrame.id === 10) {
      this.fillLastFrame(pin);
      // this.calculateScore();
    } else {
      this.calculateBonusScore(pin);
    }
    // this.frames.map(item => item.frame.forEach(f => console.log(f)));
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

  get hdcp(): number {
    return this.lastFrame?.score;
  }

  private addSpare(): void {
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
      this.addStrike(pin);
      if (this.lastFrame.spare) {
        this.showSpare(pin);
      }
    } else {
      // show spare when sum is 10
      const sum: number = this.sumOneFrames() + pin;
      if (sum === 10) {
        console.log('show addSpare');
        this.addSpare();
      }
    }
  }

  // reset pin after selecting tow frame
  private resetPins(): void {
    this.pins = this.fillPins();
  }

}
