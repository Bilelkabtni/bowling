import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-bowling-pins',
  templateUrl: './bowling-pins.component.html',
  styleUrls: ['./bowling-pins.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BowlingPinsComponent {
  @Input() pins: number [] = [];
  @Output() selectedPin: EventEmitter<number> = new EventEmitter<number>();

  addPin(pin: number): void {
    if (pin !== 10) {
      this.pins = [];
      for (let i = 0; i <= (10 - pin); i++) {
        this.pins.push(i);
      }
    }
    this.selectedPin.emit(pin);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
