import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campaign } from 'src/app/interfaces/datamodel/campaign';
import { ID_xCampaign } from 'src/app/interfaces/datamodel/excel/campaigns';
import { ID_Option } from 'src/app/interfaces/datamodel/options';
import { ID_pCampaigns } from 'src/app/interfaces/datamodel/parametrosTablas/campaigns';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { CommonService } from 'src/app/services/common/common.service';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-campaigns-table',
  templateUrl: './campaigns-table.component.html',
  styleUrls: ['./campaigns-table.component.css']
})
export class CampaignsTableComponent implements OnInit {
  filterName: string = 'nombre de la campaña';
  parameterFilter: any = 'nameCampaign';
  showFilters!: boolean;
  optDateFilter!: ID_Option[];
  modeFilterDate!: boolean;
  modeFilterColumns!: boolean;
  selectedAll!: boolean;
  selectedAllFilter!: boolean;
  listTitles!: ID_pCampaigns[];
  @Input() campaigns!: Campaign[];
  @Input() numberColumnsLoader: any = 1;
  @Input() pagination!: boolean;
  numClmns: {
    width: string
  }[] = [];
  lengthLoaders: any;
  itemsLoaders: any = [];
  filters!: ID_Option[];
  noBtnFilters!: boolean;
  ascendent!: boolean;
  campaignSelected!: boolean;
  campaignsSelected: Campaign[] = [];
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService
  ) {
    this.optDateFilter = this.commonService.getDataLocal("optFiltersDate");
    this.listTitles = this.commonService.getDataLocal("pCampaigns");
    this.filters = this.commonService.getDataLocal("fCampaigns");
  }

  ngOnInit(): void {
    for (let a = 0; a < this.numberColumnsLoader; a++) {
      const width = Math.floor(Math.random() * (100 - 60)) + 60;
      this.numClmns.push({
        width: `${width}%`
      });
    }
    setTimeout(() => {
      this.calculateItemsShow();
      this.showFilters = document.body.clientWidth >= 768 ? true : false;
      this.noBtnFilters = document.body.clientWidth >= 768 ? true : false;
      this.commonService.share.subscribe((response) => {
        if (response) {
          if (response.responsive) {
            this.calculateItemsShow();
            let responsive: ID_Responsive = response.responsive;
            if (!responsive.phone) {
              this.showFilters = true;
              this.noBtnFilters = true;
            }
          } else if (response.unSelected) {
            if (this.campaigns.length > 0) {
              for (let b = 0; b < this.campaigns.length; b++) {
                const campaign = this.campaigns[b];
                campaign.selected = this.selectedAll;
              }
              this.campaignsSelected = [];
              this.campaignSelected = false;
              this.selectedAll = false;
            }
          }
        }
      });
    }, 400);

  }

  search(value: any) {
    let event = value ? value.event : null;
    let valueIn = value ? value.value : "";
    let parameter = this.parameterFilter;
    if (parameter == "createdAt") {
      if (valueIn) {
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: any = this.campaigns[a];
          let filter = campaign.createdAt.formated.toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            campaign.show = false;
          } else {
            campaign.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.campaigns.length; b++) {
          const campaign: any = this.campaigns[b];
          campaign.show = true;
        }
      }
    } else if (parameter == "updatedAt") {
      if (valueIn) {
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: any = this.campaigns[a];
          let filter = campaign.updatedAt.formated.toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            campaign.show = false;
          } else {
            campaign.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.campaigns.length; b++) {
          const campaign: any = this.campaigns[b];
          campaign.show = true;
        }
      }
    } else {
      if (valueIn) {
        valueIn = valueIn.toLowerCase();
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: any = this.campaigns[a];
          let filter = campaign[parameter].toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            campaign.show = false;
          } else {
            campaign.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.campaigns.length; b++) {
          const campaign: any = this.campaigns[b];
          campaign.show = true;
        }
      }
    }
  }

  onOffFilters(data: any) {
    setTimeout(() => {
      this.showFilters = data;
    }, 400);
  }

  getSelect(option: ID_Option) {
    if (option) {
      this.filterName = option.value;
      this.parameterFilter = option.id;
    }
  }

  onOffModeFilterDate(data: any) {
    this.modeFilterDate = data ? data.show ? true : false : false;
  }

  onOffModeFilterColumns(data: any) {
    this.modeFilterColumns = data ? data.show ? true : false : false;
  }

  onOffSelectedAll(data: any) {
    let noShow = 0;
    this.selectedAll = data ? data.checked : false;
    for (let a = 0; a < this.campaigns.length; a++) {
      const campaign = this.campaigns[a];
      campaign.selected = this.selectedAll;
      noShow = !campaign.show ? noShow + 1 : noShow;
    }
    this.selectedAllFilter = noShow > 0 ? true : false;
  }

  sort(data: any) {
    setTimeout(() => {
      let inital = this.campaigns;
      if (data.order) {
        if (!this.ascendent) {
          this.commonService.orderAscent(this.campaigns, data.id);
        } else {
          this.commonService.orderDecent(this.campaigns, data.id);
        }
      }
    }, 400);
  }

  calculateItemsShow() {
    let contain = document.getElementsByClassName("values") ? document.getElementsByClassName("values")[0] : null;
    let height = contain ? contain?.clientHeight : 0;
    let length = height / 56;
    this.lengthLoaders = length.toFixed();
    this.lengthLoaders = parseInt(this.lengthLoaders);
    let loader = [];
    for (let a = 0; a < this.lengthLoaders; a++) {
      loader.push(a + 1);
    }
    this.itemsLoaders = loader;
  }

  onOffSelected(data: any, campaign: Campaign, index: number) {
    campaign.selected = data ? data.checked : false;
    this.campaignSelected = campaign.selected;
    if (campaign.selected) {
      this.campaignsSelected.push(campaign);
    } else {
      this.campaignsSelected.slice(index, 1);
    }
  }

  deleteAll() {
    setTimeout(() => {
      if (this.selectedAll && !this.selectedAllFilter) {
        this.delete.emit({ deleteAll: true, campaigns: this.campaigns });
      } else if (this.selectedAll && this.selectedAllFilter) {
        let campaigns: Campaign[] = []
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: Campaign = this.campaigns[a];
          if (campaign.show) {
            campaigns.push(campaign);
          }
        }
        this.delete.emit({ deleteSelected: false, campaigns: campaigns });
      } else {
        this.delete.emit({ deleteSelected: false, campaigns: this.campaignsSelected });
      }
    }, 400);
  }

  downloadAll() {
    setTimeout(() => {
      if (this.selectedAll && !this.selectedAllFilter) {
        let campaignsCSV: ID_xCampaign[] = [];
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: Campaign = this.campaigns[a];
          let item: ID_xCampaign = {
            "External ID": campaign.externalId,
            "Fecha de creación": campaign.createdAt.formated,
            "Fecha de modificación": campaign.updatedAt.formated,
            "Id": campaign.id,
            "Nombre de la campaña": campaign.nameCampaign,
            "Número de envios por días": campaign.numberSendsCustomersDays
          }
          campaignsCSV.push(item);
        };
        this.commonService.exportAsExcelFile(campaignsCSV, "Campañas");
        this.selectedAll = false;
        this.campaignSelected = false;
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign = this.campaigns[a];
          campaign.selected = this.selectedAll;
        }
      } else if (this.selectedAll && this.selectedAllFilter) {
        let campaignsCSV: ID_xCampaign[] = [];
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign: Campaign = this.campaigns[a];
          if (campaign.show) {
            let item: ID_xCampaign = {
              "External ID": campaign.externalId,
              "Fecha de creación": campaign.createdAt.formated,
              "Fecha de modificación": campaign.updatedAt.formated,
              "Id": campaign.id,
              "Nombre de la campaña": campaign.nameCampaign,
              "Número de envios por días": campaign.numberSendsCustomersDays
            }
            campaignsCSV.push(item);
          }
        };
        this.commonService.exportAsExcelFile(campaignsCSV, "Campañas");
        this.selectedAll = false;
        this.campaignSelected = false;
        for (let a = 0; a < this.campaigns.length; a++) {
          const campaign = this.campaigns[a];
          campaign.selected = this.selectedAll;
        }
      } else {
        let campaignsCSV: ID_xCampaign[] = [];
        if (this.campaignsSelected.length > 0) {
          for (let a = 0; a < this.campaignsSelected.length; a++) {
            const campaign: Campaign = this.campaignsSelected[a];
            let item: ID_xCampaign = {
              "External ID": campaign.externalId,
              "Fecha de creación": campaign.createdAt.formated,
              "Fecha de modificación": campaign.updatedAt.formated,
              "Id": campaign.id,
              "Nombre de la campaña": campaign.nameCampaign,
              "Número de envios por días": campaign.numberSendsCustomersDays
            }
            campaignsCSV.push(item);
          };
          this.commonService.exportAsExcelFile(campaignsCSV, "Campañas");
          this.selectedAll = false;
          this.campaignSelected = false;
          for (let a = 0; a < this.campaigns.length; a++) {
            const campaign = this.campaigns[a];
            campaign.selected = this.selectedAll;
          }
          this.campaignsSelected = [];
        }
      }
    }, 400);
  }

  openCampaign(campaign: Campaign, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.campaigns.length; a++) {
        const camp = this.campaigns[a];
        camp.selected = this.selectedAll;
      }
      campaign.selected = true;
      this.campaignSelected = campaign.selected;
      this.campaignsSelected = [];
      this.campaignsSelected.push(campaign);
      this.open.emit({ campaign: campaign, index: index });
    }, 400);
  }

  editCampaign(campaign: Campaign, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.campaigns.length; a++) {
        const camp = this.campaigns[a];
        camp.selected = this.selectedAll;
      }
      campaign.selected = true;
      this.campaignSelected = campaign.selected;
      this.campaignsSelected = [];
      this.campaignsSelected.push(campaign);
      this.edit.emit({ campaign: campaign, index: index });
    }, 400);
  }

  deleteCampaign(campaign: Campaign, index: number) {
    setTimeout(() => {
      this.delete.emit({ deleteSingle: true, campaign: campaign });
    }, 400);
  }

  downloadCampaign(campaign: Campaign, index: number) {
    setTimeout(() => {
      let campaignsCSV: ID_xCampaign[] = [];
      let item: ID_xCampaign = {
        "External ID": campaign.externalId,
        "Fecha de creación": campaign.createdAt.formated,
        "Fecha de modificación": campaign.updatedAt.formated,
        "Id": campaign.id,
        "Nombre de la campaña": campaign.nameCampaign,
        "Número de envios por días": campaign.numberSendsCustomersDays
      }
      campaignsCSV.push(item);
      this.commonService.exportAsExcelFile(campaignsCSV, campaign.nameCampaign);
    }, 400);
  }
}
