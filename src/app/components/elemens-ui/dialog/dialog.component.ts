import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() feedbackcCode!: string;
  @Input() error!: boolean;
  @Input() warning!: boolean;
  @Input() success!: boolean;
  @Input() actions!: boolean;
  @Input() nameAction!: string;
  @Input() radius!: boolean;
  spinner!: boolean;
  @Input() feedback!: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    if (this.feedback) {
      this.spinner = false;
    }
    this.commonService.shareData({ modeDialog: true });
    this.commonService.share.subscribe((response)=> {
      if (response) {
        if (response.showFeedbackDialog) {
          this.spinner = false;
          this.feedback = true;
          setTimeout(() => {
            this.feedback = false;
          }, 2000);
        } else {
          this.feedback = false;
        }
      }
    })
  }

  cancel() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.close.emit({ close: true });
    }, 400);
  }

  accepted() {
    this.spinner = true;
    setTimeout(() => {
      this.action.emit({ action: true });
    }, 400);
  }
}
