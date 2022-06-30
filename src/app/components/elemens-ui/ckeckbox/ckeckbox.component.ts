import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './ckeckbox.component.html',
  styleUrls: ['./ckeckbox.component.css']
})
export class CkeckboxComponent implements OnInit {
  @Input() id!: string;
  @Input() class!: string;
  @Input() placeholder!: string;
  @Input() selected!: boolean;
  @Output() checked: EventEmitter<any> = new EventEmitter<any>();
  hover!: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  onOffChecked(event: any) {
    setTimeout(() => {
      this.selected = this.selected ? true : false;
      this.checked.emit({ event: event, checked: this.selected });
    }, 400);
  }

}
