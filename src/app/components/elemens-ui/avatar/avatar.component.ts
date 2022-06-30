import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @Input() status!: string;
  @Input() img: any = environment.avatarDefault;
  @Input() online!: boolean;
  @Input() offline!: boolean;
  @Input() absent!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.status = this.status ? this.status.toLowerCase() : this.status;
    switch (this.status) {
      case "online":
        this.online = true;
        this.offline = false;
        this.absent = false;
        break;
      case "offline":
        this.online = false;
        this.offline = true;
        this.absent = false;
        break;
      case "absent":
        this.online = false;
        this.offline = false;
        this.absent = true;
        break;
      default:
        break;
    }
  }

}
