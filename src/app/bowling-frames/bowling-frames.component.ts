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
    this.pins = [];
    for (let i = 0; i <= (10 - pin); i++) {
      this.pins.push(i);
    }
    this.addFrames(pin);
  }

  private addFrames(pin: number) {
    this.activeFrame.active = false;
    if (this.activeFrame?.frame?.length !== 2) {
      // make the frame sum
      this.frameIsFilled(pin);
    }
    console.log('frames', this.frames);
  }

  private sumOneFrames(): number {
    return this.activeFrame.frame.reduce((item, acc) => item + acc, 0);
  }

  private sumTowFrames() {
    // need only the sum if one index
    if (this.currentFrame === 0) {
      this.activeFrame.score = this.sumOneFrames();
    } else {
      this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
    }
  }

  private frameIsFilled(pin: number): void {
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
        this.activeFrame.frame.push(pin);
        // this.lastFrame.spare = false;
        // this.currentFrame = this.currentFrame + 1;
      } else {
        this.activeFrame.frame.push(pin);
        // this.currentFrame = this.currentFrame + 1;
      }
    }

    if (this.activeFrame?.frame?.length === 2 && !this.activeFrame?.spare) {
      console.log('pin', pin);
      this.sumTowFrames();
      this.currentFrame = this.currentFrame + 1;
      this.resetPins();
    }
  }

  private resetPins(): void {
    this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

}
