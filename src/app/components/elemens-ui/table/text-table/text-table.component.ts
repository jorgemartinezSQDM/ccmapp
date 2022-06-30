import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-table',
  templateUrl: './text-table.component.html',
  styleUrls: ['./text-table.component.css']
})
export class TextTableComponent implements OnInit {
  @Input() id!: string;
  @Input() class!: string;
  @Input() order!: boolean;
  @Input() value!: string;
  @Input() table!: string;
  @Input() iconDecendent: string = "022";
  @Input() iconAscendent: string = "023";
  @Input() block!: boolean;
  @Output() sortDecendent: EventEmitter<any> = new EventEmitter<any>();
  hover!: boolean;
  click!: boolean;
  decendent: boolean = true;

  constructor() {
    this.sortDecendent.emit({ sortDecendent: this.decendent });
  }

  ngOnInit(): void {
  }

  changeSort() {
    if (this.order && !this.block) {
      setTimeout(() => {
        this.click = true;
        this.decendent = this.decendent ? false : true;
        this.sortDecendent.emit({ sortDecendent: this.decendent });
        setTimeout(() => {
          this.click = false;
        }, 100);
      }, 400);
    }
  }

}
