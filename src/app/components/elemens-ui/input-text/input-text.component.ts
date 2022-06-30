import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements OnInit {
  focus!: boolean;
  hover!: boolean;
  @Input() value!: any;
  password!: boolean;
  showPass!: boolean;
  input!: any;
  @Input() icon!: string;
  @Input() placeholder!: string;
  @Input() class!: string;
  @Input() id!: string;
  @Input() block: boolean = false;
  @Input() type!: string;
  @Input() required!: boolean;
  @Input() error!: boolean;
  @Input() warning!: boolean;
  @Input() success!: boolean;
  @Input() responsive!: boolean;
  @Input() center!: boolean;
  @Input() left!: boolean;
  @Input() right!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.password = this.type.toLowerCase() == "password" ? true : false;
  }

  passOn() {
    this.input = document.getElementById(this.id) ? document.getElementById(this.id) : null;
    setTimeout(() => {
      if (this.input) {
        if (!this.showPass) {
          this.input.type = "text";
          this.showPass = true;
        } else {
          this.input.type = "password";
          this.showPass = false;
        }
      }
    }, 400);
  }

}
