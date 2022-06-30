import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ID_Option } from 'src/app/interfaces/datamodel/options';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.css']
})
export class SelectOptionComponent implements OnInit {
  @Input() id!: string;
  @Input() class!: string;
  @Input() default!: string;
  @Input() icon!: string;
  @Input() options!: any;
  @Input() separator!: string;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  showOptions!: boolean;
  hover!: boolean;
  hoverOption!: boolean;
  clickOption!: boolean;
  listOptions!: ID_Option[];

  constructor() { }

  ngOnInit(): void {
    this.default = this.default ? this.default.toLowerCase() : this.default;
    if (this.options) {
      let options: ID_Option[] = [];
      let typeOptionData = typeof this.options;
      if (typeOptionData === 'string') {
        let listOptions = this.options ? this.options.split(this.separator) : [];
        for (let a = 0; a < listOptions.length; a++) {
          const option = listOptions[a];
          let item: ID_Option = {
            id: a,
            icon: "",
            value: option
          }
          options.push(item);
        }
        this.listOptions = options;
      } else {
        this.listOptions = this.options ? this.options : [];
      }
    }
  }

  onOffOptions(event: any) {
    setTimeout(() => {
      this.showOptions = this.showOptions ? false : true;
      this.event.emit({ show: this.showOptions, event: event });
    }, 400);
  }

  selected(option: ID_Option, event: any) {
    if (!this.clickOption) {
      this.default = option.value;
      this.select.emit(option);
      this.clickOption = true;
      this.event.emit({ show: false, event: event, option: option });
      setTimeout(() => {
        this.clickOption = false;
        this.onOffOptions(event);
      }, 100);
    } else {
      this.clickOption = false;
      this.event.emit({ show: false, event: event, option: option });
      setTimeout(() => {
        this.clickOption = false;
        this.onOffOptions(event);
      }, 100);
    }
  }
}
