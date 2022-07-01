import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { Router } from '@angular/router';
import { Campaign } from '../../interfaces/datamodel/campaign'
import { CommonService } from 'src/app/services/common/common.service';
import { ID_rCampaign } from 'src/app/interfaces/datamodel/response/campaigns';
import { ID_xCampaign } from 'src/app/interfaces/datamodel/excel/campaigns';
import * as moment from 'moment';
import { ID_Menu } from 'src/app/interfaces/datamodel/menu';
import { Frequency } from 'src/app/interfaces/datamodel/frequency';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  title: string = "Campañas";
  description: string = "";
  token: string = ''
  campaigns: Campaign[] = [];
  modeOpen: boolean = false;
  modeEdit: boolean = false;
  campaignOpen = <Campaign>{};
  dateCreadtedOpen: string = "";
  dateUpdatedOpen: string = "";
  campaignEdit = <Campaign>{};
  dateCreadtedEdit: string = "";
  dateUpdatedEdit: string = "";
  elems: any = {};
  spinner!: boolean;
  feedback = {
    show: false,
    code: "",
    error: false,
    warning: false,
    success: false,
  };
  dialog!: boolean;
  feedbackCode!: string;
  dialogStates = {
    error: false,
    warning: false,
    success: false,
  }
  showFeedbackDialog!: boolean;
  idCampaignDelete!: any;
  messageDialog!: string;
  deleteAll!: boolean;
  deleteSingle!: boolean;
  deleteSingleCard!: boolean;
  deleteSelected!: boolean;
  campaignsToDelete!: Campaign[];
  lists!: ID_Menu[];
  actualPage: any = 1;
  size = 100;
  pagination: boolean = true;
  lasted: boolean = false;
  showFrequency!: boolean;
  frequencies!: Frequency[];
  formatDate: string = "DD/MM/YYYY HH:mm:ss";

  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService,
    private commonService: CommonService,
  ) {
    this.lists = this.commonService.getDataLocal("menu");
    this.token = this.SessionService.getToken();
    if (!this.token) {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
    this.getAll(this.actualPage, this.size);
    for (let a = 0; a < this.lists.length; a++) {
      const itemList: ID_Menu = this.lists[a];
      itemList.selected = false;
    }
    for (let b = 0; b < this.lists.length; b++) {
      const itemList: ID_Menu = this.lists[b];
      itemList.selected = itemList.id === '01' ? true : false;
    }
  }

  getAll(page: any, size: any): void {
    this.HttpService.getAll('campaigns', this.token, page, size)
      .subscribe(response => {
        let formatCampaigns: Campaign[] = [];
        let campaignsResponse: ID_rCampaign = response;
        if (campaignsResponse) {
          if (campaignsResponse.Records.length > 0) {
            let campaigns = campaignsResponse.Records;
            this.pagination = campaigns.length < this.size && this.actualPage == 1 ? false : true;
            this.lasted = campaigns.length < this.size && this.actualPage != 1 ? true : false;
            for (let a = 0; a < campaigns.length; a++) {
              const campaign = campaigns[a];
              let created = campaign.createdAt ? moment(campaign.createdAt).format(this.formatDate) : "";
              let updated = campaign.updatedAt ? moment(campaign.updatedAt).format(this.formatDate) : "";
              let item: Campaign = {
                createdAt: {
                  value: campaign.createdAt ? campaign.createdAt : "",
                  formated: created,
                },
                externalId: campaign.ExternalId ? campaign.ExternalId : "",
                id: campaign.Id ? campaign.Id : "",
                nameCampaign: campaign.Nombre ? campaign.Nombre : "",
                numberSendsCustomersDays: campaign.numeroVecesClientesDia ? campaign.numeroVecesClientesDia : "",
                show: true,
                selected: false,
                updatedAt: {
                  value: campaign.updatedAt ? campaign.updatedAt : "",
                  formated: updated,
                },
              };
              formatCampaigns.push(item);
            }
            formatCampaigns = this.commonService.orderDecent(formatCampaigns, "id");
            this.campaigns = formatCampaigns;
          } else {
            this.commonService.goTo("/login", null);
          }
        } else {
          this.commonService.goTo("/login", null);
        }
      });
  }

  back() {
    setTimeout(() => {
      window.history.back();
    }, 400);
  }

  exportCsv() {
    setTimeout(() => {
      let campaignsCSV: ID_xCampaign[] = [];
      for (let a = 0; a < this.campaigns.length; a++) {
        const campaign: Campaign = this.campaigns[a];
        let item: ID_xCampaign = {
          "Id": campaign.id,
          "Nombre de la campaña": campaign.nameCampaign,
          "Número de envios por días": campaign.numberSendsCustomersDays,
          "External ID": campaign.externalId,
          "Fecha de creación": campaign.createdAt.formated,
          "Fecha de modificación": campaign.updatedAt.formated,
        }
        campaignsCSV.push(item);
      };
      this.commonService.exportAsExcelFile(campaignsCSV, "Campañas");
    }, 400);
  }

  openDialogDelete(data: any) {
    setTimeout(() => {
      this.dialog = true;
      if (data.deleteAll) {
        this.messageDialog = "¿está seguro de eliminar todos los elementos de esta lista?";
        this.deleteAll = true;
        this.deleteSelected = false;
        this.deleteSingle = false;
        this.deleteSingleCard = false;
        this.campaignsToDelete = data.campaigns;
      } else if (data.deleteSelected) {
        this.messageDialog = "¿está seguro de eliminar el o los elemento(s) seleccionado(s)?";
        this.deleteAll = false;
        this.deleteSelected = true;
        this.deleteSingle = false;
        this.deleteSingleCard = false;
        this.campaignsToDelete = data.campaigns;
      } else if (data.deleteSingle) {
        this.messageDialog = "¿está seguro de eliminar este elemento?";
        this.deleteAll = false;
        this.deleteSelected = false;
        this.deleteSingle = true;
        this.deleteSingleCard = false;
        this.idCampaignDelete = data.campaign.id;
      }
    }, 400);
  }

  cancelDelete(data: any) {
    this.dialog = data.close ? false : true;
    this.close();
    this.commonService.shareData({ unSelected: true });
  }

  open(data: any) {
    this.modeOpen = true;
    this.modeEdit = false;
    this.campaignOpen = data.campaign;
    this.dateCreadtedOpen = this.campaignOpen.createdAt.formated;
    this.dateUpdatedOpen = this.campaignOpen.updatedAt.formated;
    this.HttpService.getAllFrecuencies(this.token, 1, 100, "campanaId", this.campaignOpen.id).subscribe((response) => {
      if (response) {
        if (response.Records.length > 0) {
          let frequencies = response.Records;
          let frequenciesFormat: Frequency[] = [];
          for (let a = 0; a < frequencies.length; a++) {
            const frequency: any | Frequency = frequencies[a];
            let created = frequency.createdAt ? moment(frequency.createdAt).format(this.formatDate) : "";
            let updated = frequency.updatedAt ? moment(frequency.updatedAt).format(this.formatDate) : "";
            let item: Frequency = {
              createdAt: created,
              CampanaId: frequency.CampanaId ? frequency.CampanaId : "",
              Campanas_Nombre: frequency.Campanas_Nombre ? frequency.Campanas_Nombre : "",
              ClienteId: frequency.ClienteId ? frequency.ClienteId : "",
              Clientes_Apellidos: frequency.Clientes_Apellidos ? frequency.Clientes_Apellidos : "",
              Clientes_Nombres: frequency.Clientes_Nombres ? frequency.Clientes_Nombres : "",
              Id: frequency.Id ? frequency.Id : "",
              selected: false,
              show: true,
              ToquesDia: frequency.ToquesDia ? frequency.ToquesDia : "",
              updatedAt: updated,
            }
            frequenciesFormat.push(item);
          }
          frequenciesFormat = this.commonService.orderDecent(frequenciesFormat, "Id");
          this.frequencies = frequenciesFormat;
          this.showFrequency = true;
        } else {
          this.showFrequency = false;
        }
      } else {
        this.showFrequency = false;
      }
    });
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    setTimeout(() => {
      if (this.elems.table) {
        if (this.elems.table) {
          this.elems.table.scrollLeft = 1264;
        }
      }
    }, 400);
  }

  editFromOpen(campaign: Campaign) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.campaignEdit = campaign;
      this.modeOpen = false;
      this.modeEdit = true;
      this.showFrequency = false;
      this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
      setTimeout(() => {
        if (this.elems.table) {
          this.elems.table.scrollLeft = 1264;
        }
      }, 400);
    }, 400);
  }

  close() {
    setTimeout(() => {
      this.modeOpen = false;
      this.modeEdit = false;
      this.showFrequency = false;
      this.commonService.shareData({ unSelected: true });
    }, 400);
  }

  edit(data: any) {
    this.modeOpen = false;
    this.modeEdit = true;
    this.campaignEdit = data.campaign;
    this.showFrequency = false;
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    setTimeout(() => {
      if (this.elems.table) {
        this.elems.table.scrollLeft = 1264;
      }
    }, 400);
  }

  cancel() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.modeOpen = false;
      this.modeEdit = false;
      this.showFrequency = false;
      this.commonService.shareData({ unSelected: true });
    }, 400);
  }

  update() {
    this.spinner = true;
    this.elems.id = document.getElementById("idEditVal") ? document.getElementById("idEditVal") : null;
    this.elems.externalId = document.getElementById("externalIdEdit") ? document.getElementById("externalIdEdit") : null;
    this.elems.nameCampaign = document.getElementById("nameCampaignEdit") ? document.getElementById("nameCampaignEdit") : null;
    this.elems.sendsByDays = document.getElementById("sendsByDaysEdit") ? document.getElementById("sendsByDaysEdit") : null;
    setTimeout(() => {
      let item: any = {
        ExternalId: this.elems.externalId ? this.elems.externalId.value : this.campaignEdit.externalId,
        Id: this.campaignEdit.id,
        Nombre: this.elems.nameCampaign ? this.elems.nameCampaign.value : this.campaignEdit.nameCampaign,
        numeroVecesClientesDia: this.elems.sendsByDays ? this.elems.sendsByDays.value : this.campaignEdit.numberSendsCustomersDays,
      }
      let request = [];
      request.push(item);
      this.HttpService.updateCampaign(request, this.token).subscribe((response) => {
        if (response) {
          this.getAll(this.actualPage, this.size);
          this.spinner = false;
          this.feedback.code = "s0000";
          this.feedback.error = false;
          this.feedback.warning = false;
          this.feedback.success = true;
          this.feedback.show = true;
          setTimeout(() => {
            this.feedback.code = "";
            this.feedback.error = false;
            this.feedback.warning = false;
            this.feedback.success = false;
            this.feedback.show = false;
            this.close();
          }, 4000);
        } else {
          this.spinner = false;
          this.feedback.code = "e0004";
          this.feedback.error = true;
          this.feedback.warning = false;
          this.feedback.success = false;
          this.feedback.show = true;
          setTimeout(() => {
            this.feedback.code = "";
            this.feedback.error = false;
            this.feedback.warning = false;
            this.feedback.success = false;
            this.feedback.show = false;
            this.close();
          }, 4000);
        }
      }, (error) => {
        this.spinner = false;
        this.feedback.code = "e0004";
        this.feedback.error = true;
        this.feedback.warning = false;
        this.feedback.success = false;
        this.feedback.show = true;
        setTimeout(() => {
          this.feedback.code = "";
          this.feedback.error = false;
          this.feedback.warning = false;
          this.feedback.success = false;
          this.feedback.show = false;
          this.close();
        }, 4000);
      });
    }, 400);
  }

  openDialogDeleteCard(campaign: Campaign) {
    setTimeout(() => {
      this.messageDialog = "¿está seguro de eliminar este elemento?"
      this.dialog = true;
      this.deleteAll = false;
      this.deleteSelected = false;
      this.deleteSingle = false;
      this.deleteSingleCard = true;
      this.idCampaignDelete = campaign.id;
    }, 400);
  }

  deleteCampaign(data: any) {
    if (data.action) {
      if (this.deleteAll) {
        let allDelete = 0;
        for (let a = 0; a < this.campaignsToDelete.length; a++) {
          const campaign: Campaign = this.campaignsToDelete[a];
          this.HttpService.deleteCampaign(campaign.id, this.token).subscribe((response) => {
            if (response) {
              allDelete = allDelete + 1;
            } else {
              allDelete = 0;
            }
          }, (error) => {
            allDelete = 0;
          });
        }
        if (allDelete > 0) {
          this.feedbackCode = "s0002";
          this.dialogStates.error = false;
          this.dialogStates.warning = false;
          this.dialogStates.success = true;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        } else {
          this.feedbackCode = "e0003";
          this.dialogStates.error = true;
          this.dialogStates.warning = false;
          this.dialogStates.success = false;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        }
      } else if (this.deleteSelected) {
        let deletes = 0;
        for (let b = 0; b < this.campaignsToDelete.length; b++) {
          const campaign: Campaign = this.campaignsToDelete[b];
          this.HttpService.deleteCampaign(campaign.id, this.token).subscribe((response) => {
            if (response) {
              deletes = deletes + 1;
            } else {
              deletes = 0;
            }
          }, (error) => {
            deletes = 0;
          });
        }
        if (deletes > 0) {
          this.feedbackCode = "s0003";
          this.dialogStates.error = false;
          this.dialogStates.warning = false;
          this.dialogStates.success = true;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        } else {
          this.feedbackCode = "e0003";
          this.dialogStates.error = true;
          this.dialogStates.warning = false;
          this.dialogStates.success = false;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        }
      } else if (this.deleteSingle) {
        this.HttpService.deleteCampaign(this.idCampaignDelete, this.token).subscribe((response) => {
          if (response) {
            this.feedbackCode = "s0001";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.showFeedbackDialog = true;
            setTimeout(() => {
              this.feedbackCode = "";
              this.dialogStates.error = false;
              this.dialogStates.warning = false;
              this.dialogStates.success = false;
              this.showFeedbackDialog = false;
              this.dialog = false;
              this.close();
            }, 4000);
          } else {
            this.feedbackCode = "e0003";
            this.dialogStates.error = true;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = true;
            setTimeout(() => {
              this.feedbackCode = "";
              this.dialogStates.error = false;
              this.dialogStates.warning = false;
              this.dialogStates.success = false;
              this.showFeedbackDialog = false;
              this.dialog = false;
              this.close();
            }, 4000);
          }
        }, (error) => {
          this.feedbackCode = "e0003";
          this.dialogStates.error = true;
          this.dialogStates.warning = false;
          this.dialogStates.success = false;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        });
      } else if (this.deleteSingleCard) {
        this.HttpService.deleteCampaign(this.idCampaignDelete, this.token).subscribe((response) => {
          if (response) {
            this.feedbackCode = "s0001";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.showFeedbackDialog = true;
            setTimeout(() => {
              this.feedbackCode = "";
              this.dialogStates.error = false;
              this.dialogStates.warning = false;
              this.dialogStates.success = false;
              this.showFeedbackDialog = false;
              this.dialog = false;
              this.close();
            }, 4000);
          } else {
            this.feedbackCode = "e0003";
            this.dialogStates.error = true;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = true;
            setTimeout(() => {
              this.feedbackCode = "";
              this.dialogStates.error = false;
              this.dialogStates.warning = false;
              this.dialogStates.success = false;
              this.showFeedbackDialog = false;
              this.dialog = false;
              this.close();
            }, 4000);
          }
        }, (error) => {
          this.feedbackCode = "e0003";
          this.dialogStates.error = true;
          this.dialogStates.warning = false;
          this.dialogStates.success = false;
          this.showFeedbackDialog = true;
          setTimeout(() => {
            this.feedbackCode = "";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = false;
            this.showFeedbackDialog = false;
            this.dialog = false;
            this.close();
          }, 4000);
        });
      }
    }
  }

  downloadCampaign(campaign: Campaign) {
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
      this.close();
    }, 400);
  }

  backPage() {
    setTimeout(() => {
      this.actualPage = this.actualPage <= 1 ? 1 : this.actualPage - 1;
      this.getAll(this.actualPage, this.size);
      this.close();
      this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
      this.elems.table.scrollTop = 0;
      this.elems.table.scrollLeft = 0;
    }, 400);
  }

  nextPage() {
    setTimeout(() => {
      this.actualPage = this.actualPage + 1;
      this.getAll(this.actualPage, this.size);
      this.close();
      this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
      this.elems.table.scrollTop = 0;
      this.elems.table.scrollLeft = 0;
    }, 400);
  }
}
