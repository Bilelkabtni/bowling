import {Component, OnInit} from '@angular/core';
import {bowling} from 'src/app/bowling-frames/bowling.data';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss']
})
export class BowlingFramesComponent implements OnInit {
  pins = this.fillPins();

  frames: any[] = bowling;

  currentFrame = 0;
  hdcpScore = 0;

  constructor() {
  }

  get activeFrame(): any {
    return this.frames[this.currentFrame];
  }

  get lastFrame(): any {
    return this.frames[this.currentFrame - 1];
  }

  get frameSize(): number {
    return this.activeFrame?.frame?.length || 0;
  }

  get filledFrame(): number {
    return this.activeFrame?.frame?.filter(item => item !== null).length;
  }

  fillPins(): number[] {
    return Array.from(Array(11).keys());
  }

  ngOnInit(): void {
  }

  displayPins(pin: number): void {
    if (pin !== 10) {
      this.pins = [];
      for (let i = 0; i <= (10 - pin); i++) {
        this.pins.push(i);
      }
    }
    this.addFrames(pin);
  }

  deactivateFrame(): void {
    this.frames.map(frame => frame.active = false);
  }

  activateFrame(): void {
    this.deactivateFrame();
    this.activeFrame.active = true;
  }

  selectFrame(index: number): void {
    console.log('ccc', index);
    this.currentFrame = index;
    this.activateFrame();
    if (this.activeFrame.frames?.frame.length > 0) {
      console.log('pi');
      this.resetFrame();
    }
  }

  trackById(frame: any): number {
    return frame.id;
  }

  resetFrame(): void {
    this.activeFrame.frame = [];
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

  private addFrames(pin: number) {
    // make the frame sum
    this.frameIsFilled(pin);

    if (this.activeFrame.id === 10) {
      this.fillLastFrame(pin);
    } else {
      if (this.filledFrame === 1) {
        this.activeFrame.frame[1] = pin;
        this.sumOfFrames();
        this.resetPins();
        this.currentFrame = this.currentFrame + 1;
      } else {
        this.activeFrame.frame[0] = pin;
      }
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
    console.log('addSpare', pin);
    this.activeFrame.score = 10 + this.lastFrame.score;
    this.activeFrame.spare = true;
    this.activeFrame.showScore = false;
  }

  private showSpare(pin: number): void {
    this.lastFrame.score = this.lastFrame.score + pin;
    this.lastFrame.showScore = true;
    this.lastFrame.spare = false;
  }

  private addStrike(pin: number): void {
    console.log('add strike');
    // this.activeFrame.score = 10 + this.lastFrame.score;
    this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
    this.activeFrame.strike = true;
    this.activeFrame.showScore = false;
    this.activeFrame.frame[1] = null;
    this.activeFrame.frame[1] = 10;
    // this.currentFrame = this.currentFrame + 1;
  }

  // private showStrike(pin: number): void {
  //   this.lastFrame.score = 10 + this.lastFrame.score + this.sumOneFrames();
  //   this.lastFrame.showScore = true;
  //   this.lastFrame.strike = false;
  // }


  private frameIsFilled(pin: number): void {
    // activate frame
    this.activateFrame();

    const sum: number = this.sumOneFrames() + pin;
    if (sum === 10 && this.lastFrame) {
      this.addSpare(pin);
    }

    if (pin === 10 && this.lastFrame) {
      this.addStrike(pin);
    }

    if (this.lastFrame?.spare) {
      this.showSpare(pin);
    }
  }

  private resetPins(): void {
    this.pins = this.fillPins();
  }

}
