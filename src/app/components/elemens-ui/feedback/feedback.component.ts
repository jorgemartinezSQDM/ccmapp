import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @Input() error!: boolean;
  @Input() warning!: boolean;
  @Input() success!: boolean;
  @Input() responsive!: boolean;
  @Input() center!: boolean;
  @Input() left!: boolean;
  @Input() right!: boolean;
  @Input() code!: string;
  listFeedbacks!: any;
  message!: string;

  constructor(
    private commonService: CommonService,
  ) {
    this.listFeedbacks = this.commonService.getDataLocal("feedback");
  }

  ngOnInit(): void {
    this.message = this.code ? this.listFeedbacks[this.code] : "";
  }

}
