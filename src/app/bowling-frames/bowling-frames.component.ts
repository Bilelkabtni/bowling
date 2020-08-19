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

  get nextFilledFrame(): number {
    return this.frames[this.currentFrame + 1]?.frame?.filter(item => item !== null).length;
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

  trackById(frame: any): number {
    return frame.id;
  }

  selectFrame(index: number): void {
    this.currentFrame = index;
    this.activateFrame();
    // if (this.frameSize > 0) {
    //   this.resetFrame();
    // }
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
    return this.activeFrame.frame.reduce((item, acc) => item + acc, 0);
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
        this.sumOfFrames();
        this.resetPins();
        break;
    }
  }

  private calculateBonusScore(pin: number): void {
    if (!this.activeFrame?.strike && !this.lastFrame?.strike) {
      if (this.filledFrame === 1) {
        this.activeFrame.frame[1] = pin;
        this.sumOfFrames();
        this.incrementFrame();
        this.resetPins();
      } else {
        this.activeFrame.frame[0] = pin;
      }
    } else {

      if (this.filledFrame === 0) {
        this.activeFrame.frame[0] = pin;
        // this.lastFrame.strike = false;
        // this.sumOfFrames();
        // this.activeFrame.strike = false;
      } else {
        this.activeFrame.frame[1] = pin;
        // this.decrementFrame()
        // this.lastFrame.score = this.lastFrame.score + this.sumOneFrames();
        this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
        // console.log('this.activeFrame.score', this.activeFrame.score)
        console.log('this.activeFrame.id', this.activeFrame.id)
        console.log('this.lastFrame.id', this.lastFrame.id)
        // this.activeFrame.score +=  this.activeFrame.frame[0] +  this.activeFrame.frame[1];
      }

      if (!this.lastFrame?.strike) {
        this.incrementFrame();
      }

      // console.log('activeFrame', this.activeFrame)
      // console.log('filledFrame', this.filledFrame)

      // this.lastFrame.strike = false;
      // console.log('activeFrame', this.activeFrame);
    }
  }

  incrementFrame() {
    this.currentFrame = this.currentFrame + 1;
  }

  decrementFrame() {
    this.currentFrame = this.currentFrame - 1;
  }

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
  }

  private frameIsFilled(pin: number): void {
    // activate frame
    this.activateFrame();

    // show spare when sum is 10
    const sum: number = this.sumOneFrames() + pin;
    if (sum === 10 && this.lastFrame) {
      this.addSpare(pin);
    }

    // show spare
    if (this.lastFrame?.spare && !this.lastFrame?.strike) {
      this.showSpare(pin);
    }

    // show strike
    if (pin === 10 && this.lastFrame) {
      this.addStrike(pin);
    }
  }

  private resetPins(): void {
    this.pins = this.fillPins();
  }

}
