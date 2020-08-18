import {Component, OnInit} from '@angular/core';
import {bowling} from 'src/app/bowling-frames/bowling.data';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss']
})
export class BowlingFramesComponent implements OnInit {
  pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  frames: any[] = bowling;

  currentFrame = 0;

  constructor() {
  }

  get activeFrame(): any {
    return this.frames[this.currentFrame];
  }

  get lastFrame(): any {
    return this.frames[this.currentFrame - 1];
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

  private sumOneFrames(): number {
    return this.activeFrame.frame.reduce((item, acc) => item + acc, 0);
  }

  private addFrames(pin: number) {
    // this.activeFrame.active = false;
    if (this.activeFrame?.frame?.length !== 2) {
      // make the frame sum
      this.frameIsFilled(pin);
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

  private addSpare(pin: number) {
    const sum: number = this.sumOneFrames() + pin;
    if (sum === 10) {
      this.activeFrame.frame.push('/');
      this.activeFrame.score = 10 + this.lastFrame.score;
      this.activeFrame.spare = true;
      this.activeFrame.showScore = false;
      this.currentFrame = this.currentFrame + 1; // next frame
    } else {
      if (this.lastFrame && this.lastFrame.spare) {
        this.lastFrame.score = this.lastFrame.score + pin;
        this.lastFrame.showScore = true;
        this.lastFrame.spare = false;
        this.activeFrame.frame.push(pin);
      } else {
        this.activeFrame.frame.push(pin);
      }
    }
  }


  private addStrike(pin: number) {
    if (pin === 10 && this.lastFrame) {
      console.log('strick')
      this.activeFrame.frame.push(10);
      this.activeFrame.strike = true;
      this.activeFrame.showScore = false;
      this.activeFrame.score = (10 + this.lastFrame.score);
      this.currentFrame = this.currentFrame + 1;
    } else {
      if (this.lastFrame && this.lastFrame.strike) {
        this.lastFrame.showScore = true;
        this.lastFrame.score = (10 + this.lastFrame.score);
      }
    }
  }

  private frameIsFilled(pin: number): void {
    // this.lastFrame.active = false;
    if (pin === 10) {
      this.addStrike(pin);
    } else {
      // spare logic
      this.addSpare(pin);
    }

    if (this.activeFrame?.frame?.length === 2) {
      this.activeFrame.active = true;
      this.sumOfFrames();
      this.currentFrame = this.currentFrame + 1;
      this.resetPins();
    }
  }

  trackById(frame: any): number {
    return frame.id;
  }

  private resetPins(): void {
    this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

}
