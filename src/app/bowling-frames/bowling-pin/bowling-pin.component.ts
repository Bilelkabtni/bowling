import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-bowling-pin',
  templateUrl: './bowling-pin.component.html',
  styleUrls: ['./bowling-pin.component.scss']
})
export class BowlingPinComponent {
  @Input() pins: number[] = [];

}
