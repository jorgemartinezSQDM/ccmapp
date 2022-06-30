import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() id!: string;
  @Input() icon!: string;
  @Input() label: string = "Botón";
  @Input() primary!: boolean;
  @Input() secondary!: boolean;
  @Input() tertiary!: boolean;
  @Input() modeSwitch!: boolean;
  @Input() iconSwitch!: string;
  @Input() labelSwitch!: string;
  @Input() onlyIcon!: boolean;
  @Input() block: boolean = false;
  @Input() right!: boolean;
  @Input() full!: boolean;
  @Input() selected!: boolean;
  @Output() on: EventEmitter<any> = new EventEmitter<any>();
  hover!: boolean;
  click!: boolean;
  switch!: boolean;

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.labelSwitch = !this.labelSwitch ? this.label : this.labelSwitch;
    this.iconSwitch = !this.iconSwitch ? this.icon : this.iconSwitch;
    this.commonService.share.subscribe((response) => {
      if (response) {
        if (response.resetSwitch &&  response.id == this.id) {
          this.switch = false;
        }
      }
    })
  }

  modeClick(event: Event): void {
    if (!this.block) {
      setTimeout(() => {
        this.switch = this.modeSwitch && event.type === 'click' && !this.switch ? true : false;
        this.click = true;
        if (this.switch) {
          this.on.emit(true);
        } else {
          this.on.emit(false);
        }
        setTimeout(() => {
          this.click = false;
        }, 100);
      }, 400);
    }
  }

}
