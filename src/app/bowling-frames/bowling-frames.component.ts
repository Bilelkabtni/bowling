import {Bowling} from 'src/app/bowling-frames/bowling.interface';
import {Component} from '@angular/core';

@Component({
  selector: 'app-bowling-frames',
  templateUrl: './bowling-frames.component.html',
  styleUrls: ['./bowling-frames.component.scss']
})
export class BowlingFramesComponent {
  pins = this.fillPins();
  rolls = [[], [], [], [], [],[],[],[],[],[]];


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

  protected get latestUnFiledFrame(): number {
    let index = 0;
    for (let i = 0; i <= this.frames.length; i++) {
      const filled: number = this.frames[i]?.frame.filter(item => item === null).length;
      if (filled === 0) {
        index = i;
      }
    }
    return index + 1;
  }

  /*
     Display Pins Value
   */
  displayPins(pin: number): void {
    this.rolls[this.currentFrame].push(pin);
    console.log(this.rolls);
    if (pin !== 10) {
      this.pins = [];
      for (let i = 0; i <= (10 - pin); i++) {
        this.pins.push(i);
      }
    }

    this.addFrames(pin);
    this.calculateAllScore();
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

  protected setTotalScore(): void {
    this.totalScore -= 20 - this.sumOneFrames();
  }

  protected addScore(): void {
    // this.activeFrame.score = this.lastFrame.score + this.sumOneFrames();
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

  private addStrikeToLasFrame(pin: number) {
    if (pin === 10) {
      switch (this.filledFrame) {
        case 2:
          if (this.activeFrame.strike || this.activeFrame.spare) {
            this.activeFrame.frame[2] = pin;
            // this.activeFrame.score += 10;
            this.activeFrame.strike = true;
          } else {
            this.currentFrame = 0;
            this.activateFrame();
          }
          break;
        case 1:
          this.activeFrame.frame[1] = pin;
          // this.activeFrame.score += 10;
          this.activeFrame.strike = true;
          break;
        case 0:
          this.activeFrame.frame[0] = pin;
          // this.activeFrame.score += 10;
          this.activeFrame.strike = true;
          break;
      }
    }
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
        hasBonus = isSpare ||  roll[0] === 10 || roll[1] === 10;

        if (hasBonus) {
          sumOfScore += roll[0] + roll[1] + roll[2];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        }
      } else
      if (isStrike) { // strike
        if (this.rolls[index + 1][0] === 10 && index !== 8) {
          sumOfScore += 10 + 10 + this.rolls[index + 2][0];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        } else if (index === 8) {
          sumOfScore += 10 + 10 + this.rolls[index + 1][0];
          this.frames[index].score = sumOfScore;
          this.frames[index].showScore = true;
        } else {
          sumOfScore += 10 + this.rolls[index + 1][0] +  this.rolls[index + 1][1];
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

  private sumOneFrames(): number {
    return 0;
  }

  private getStrike(pin: number): void {
    if (this.filledFrame === 0) {
      this.activeFrame.frame[0] = pin;
    } else {
      this.activeFrame.frame[1] = pin;
      this.resetPins();
      if (!this.isLastFrame) {
        this.incrementFrame();
      }
    }
  }

  private addPinToFrame(pin: number): void {
    // first case is when the frames are filled
    if (this.filledFrame === 2 && !this.isLastFrame) {
      this.activeFrame.frame[0] = pin;
      this.activeFrame.frame[1] = null;
      this.totalScore += 20 - this.sumOneFrames();
    } else {
      // case one frame is filled
      if (this.filledFrame === 1) {
        if (this.activeFrame.frame[1] === null) {
          this.activeFrame.frame[1] = pin;
        }
        this.setTotalScore();
        this.sumOfFrames();
        // case this case handled by the addBonus
        if (!this.isLastFrame) {
          this.incrementFrame();
        }
        // reset Pin
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
    console.log('addBonus');
    if (this.isLastFrame && this.filledFrame === 2) {
      // add bonus in case of strike or spare
      if (this.activeFrame?.strike || this.activeFrame?.spare) {
        console.log('i add a bonus');
        this.activeFrame.frame[2] = pin;
        this.addScore();
        this.totalScore = this.activeFrame.score;
        this.activeFrame.showScore = true;
        this.lastFrame.showScore = true;
      } else {
        // move to next frame
        console.log('this.isLastFrame', this.currentFrame);
        // Todo fix bug in the 9 case
        this.currentFrame = 0;
        this.activateFrame();
      }
    }
    // reset pin
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
      //  this.activeFrame.score = this.sumOneFrames();
    } else {
      // this.addScore();
    }
  }

  private addSpare(): void {
    // this.activeFrame.score = 10 + this.lastFrame?.score;
    this.activeFrame.spare = true;
    this.activeFrame.showScore = false;
  }

  private showSpare(pin: number): void {
    //  this.lastFrame.score = this.lastFrame.score + pin;
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
