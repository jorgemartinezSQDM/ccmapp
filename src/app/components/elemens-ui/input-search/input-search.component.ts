import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css']
})
export class InputSearchComponent implements OnInit {
  focus!: boolean;
  hover!: boolean;
  value!: any;
  @Input() icon: string = "007";
  @Input() placeholder: string = "Buscar";
  @Input() class!: string;
  @Input() id!: string;
  @Input() block: boolean = false;
  @Input() expandable!: boolean;
  @Output() collapse: EventEmitter<any> = new EventEmitter<any>();
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.commonService.share.subscribe((response) => {
      if (response) {
        if (response.forceCollapse) {
          this.expandable = response.forceCollapse ? true : false;
        } else if (response.forceExpand) {
          this.expandable = response.forceExpand ? false : true;
        }
      }
    });
  }

  expand(): void {
    setTimeout(() => {
      this.expandable = this.expandable ? false : true;
      this.collapse.emit({ collapse: this.expandable });
    }, 400);
  }

  keyValue(data: any) {
    let value = data ? data.target ? data.target.value : "" : "";
    this.search.emit({ value: value, event: data });
  }

}
