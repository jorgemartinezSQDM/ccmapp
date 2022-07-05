import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ID_xFrequencies } from 'src/app/interfaces/datamodel/excel/frequencies';
import { Frequency } from 'src/app/interfaces/datamodel/frequency';
import { ID_Menu } from 'src/app/interfaces/datamodel/menu';
import { ID_rFrequencies } from 'src/app/interfaces/datamodel/response/frequencies';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpServiceService } from 'src/app/services/httpService/http-service.service';
import { SessionServiceService } from 'src/app/services/sessionService/session-service.service';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {
  title: string = "Frecuencias";
  description: string = "";
  modeOpen: boolean = false;
  modeEdit: boolean = false;
  frequencyOpen = <Frequency>{};
  frequencyEdit = <Frequency>{};
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
  idFrequencyDelete!: any;
  messageDialog!: string;
  deleteAll!: boolean;
  deleteSingle!: boolean;
  deleteSingleCard!: boolean;
  deleteSelected!: boolean;
  frequenciesToDelete!: Frequency[];
  lists!: ID_Menu[];

  frequencyResponse: any
  frequencies: Frequency[] = []
  token: string = ''
  actualPage: any = 1;
  size = 100;
  pagination: boolean = true;
  lasted: boolean = false;
  showFrequency!: boolean;
  formatDate: string = "DD/MM/YYYY";
  dateCreadtedOpen: string = "";
  dateUpdatedOpen: string = "";
  dateCreadtedEdit: string = "";
  dateUpdatedEdit: string = "";

  constructor(
    private HttpService: HttpServiceService,
    private router: Router,
    private SessionService: SessionServiceService,
    private commonService: CommonService,
  ) {
    this.lists = this.commonService.getDataLocal("menu");
    this.token = this.SessionService.getToken();
    if (!this.token) { this.router.navigateByUrl('/login') }
  }

  ngOnInit(): void {
    this.getAll(this.actualPage, this.size);
    for (let a = 0; a < this.lists.length; a++) {
      const itemList: ID_Menu = this.lists[a];
      itemList.selected = false;
    }
    for (let b = 0; b < this.lists.length; b++) {
      const itemList: ID_Menu = this.lists[b];
      itemList.selected = itemList.id === '04' ? true : false;
    }
  }

  getAll(page: any, size: any): void {
    this.HttpService.getAll('frecuencies', this.token, page, size)
      .subscribe(response => {
        let formatfrequencies: Frequency[] = [];
        let frequenciesResponse: ID_rFrequencies = response;
        if (frequenciesResponse) {
          if (frequenciesResponse.Records.length > 0) {
            let frequencies = frequenciesResponse.Records;
            this.pagination = frequencies.length < this.size && this.actualPage == 1 ? false : true;
            this.lasted = frequencies.length < this.size && this.actualPage != 1 ? true : false;
            for (let a = 0; a < frequencies.length; a++) {
              const frequency = frequencies[a];
              let onlyDateCreated = this.commonService.formatedDate(frequency.createdAt);
              let onlyDateUpdated = this.commonService.formatedDate(frequency.updatedAt);
              let created = frequency.createdAt ? onlyDateCreated + " " + frequency.createdAt.split("T")[1].split(".")[0] : "";
              let updated = frequency.updatedAt ? onlyDateUpdated + " " + frequency.updatedAt.split("T")[1].split(".")[0] : "";
              let item: Frequency = {
                createdAt: {
                  value: frequency.createdAt ? frequency.createdAt : "",
                  formated: created
                },
                CampanaId: frequency.CampanaId ? frequency.CampanaId : "",
                Campanas_Nombre: frequency.Campanas_Nombre ? frequency.Campanas_Nombre : "",
                ClienteId: frequency.ClienteId ? frequency.ClienteId : "",
                Clientes_Apellidos: frequency.Clientes_Apellidos ? frequency.Clientes_Apellidos : "",
                Clientes_Nombres: frequency.Clientes_Nombres ? frequency.Clientes_Nombres : "",
                Id: frequency.Id ? frequency.Id : "",
                selected: false,
                show: true,
                ToquesDia: frequency.ToquesDia ? frequency.ToquesDia : "",
                updatedAt: {
                  value: frequency.updatedAt ? frequency.updatedAt : "",
                  formated: updated
                },
              };
              formatfrequencies.push(item);
            }
            formatfrequencies = this.commonService.orderDecent(formatfrequencies, "Id");
            this.frequencies = formatfrequencies;
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
      let frequenciesCSV: ID_xFrequencies[] = [];
      for (let a = 0; a < this.frequencies.length; a++) {
        const frequency: Frequency = this.frequencies[a];
        let item: ID_xFrequencies = {
          "Id": frequency ? frequency.Id : "",
          "Id del cliente": frequency ? frequency.ClienteId : "",
          "Nombre del cliente": frequency ? frequency.Clientes_Nombres : "",
          "Apellidos del cliente": frequency ? frequency.Clientes_Apellidos : "",
          "Id de la campaña": frequency ? frequency.CampanaId : "",
          "Nombre de la campaña": frequency ? frequency.Campanas_Nombre : "",
          "Toques del día": frequency ? frequency.ToquesDia : "",
          "Fecha de creación": frequency ? frequency.createdAt.formated : "",
          "Fecha de modificación": frequency ? frequency.updatedAt.formated : "",
        }
        frequenciesCSV.push(item);
      };
      this.commonService.exportAsExcelFile(frequenciesCSV, "Frecuencias");
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
        this.frequenciesToDelete = data.frequencies;
      } else if (data.deleteSelected) {
        this.messageDialog = "¿está seguro de eliminar el o los elemento(s) seleccionado(s)?";
        this.deleteAll = false;
        this.deleteSelected = true;
        this.deleteSingle = false;
        this.deleteSingleCard = false;
        this.frequenciesToDelete = data.frequencies;
      } else if (data.deleteSingle) {
        this.messageDialog = "¿está seguro de eliminar este elemento?";
        this.deleteAll = false;
        this.deleteSelected = false;
        this.deleteSingle = true;
        this.deleteSingleCard = false;
        this.idFrequencyDelete = data.frequency.id;
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
    this.frequencyOpen = data.frequency;
    this.dateCreadtedOpen = this.frequencyOpen.createdAt.formated;
    this.dateUpdatedOpen = this.frequencyOpen.updatedAt.formated;
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    setTimeout(() => {
      if (this.elems.table) {
        this.elems.table.scrollLeft = 1264;
      }
    }, 400);
  }

  editFromOpen(frequency: Frequency) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.frequencyEdit = frequency;
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
    this.frequencyEdit = data.cusotmer;
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
    this.elems.name = document.getElementById("name") ? document.getElementById("name") : null;
    this.elems.lastname = document.getElementById("lastname") ? document.getElementById("lastname") : null;
    setTimeout(() => {
      let item: any = {}
      let request = [];
      request.push(item);
      this.HttpService.updateFrequency(request, this.token).subscribe((response) => {
        if (response) {
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

  openDialogDeleteCard(frequency: Frequency) {
    setTimeout(() => {
      this.messageDialog = "¿está seguro de eliminar este elemento?"
      this.dialog = true;
      this.deleteAll = false;
      this.deleteSelected = false;
      this.deleteSingle = false;
      this.deleteSingleCard = true;
      this.idFrequencyDelete = frequency.Id;
    }, 400);
  }

  deleteFrequencies(data: any) {
    if (data.action) {
      if (this.deleteAll) {
        let allDelete = 0;
        for (let a = 0; a < this.frequenciesToDelete.length; a++) {
          const frequency: Frequency = this.frequenciesToDelete[a];
          this.HttpService.deleteFrequency(frequency.Id, this.token).subscribe((response) => {
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
        for (let b = 0; b < this.frequenciesToDelete.length; b++) {
          const frequency: Frequency = this.frequenciesToDelete[b];
          this.HttpService.deleteFrequency(frequency.Id, this.token).subscribe((response) => {
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
        this.HttpService.deleteFrequency(this.idFrequencyDelete, this.token).subscribe((response) => {
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
        this.HttpService.deleteFrequency(this.idFrequencyDelete, this.token).subscribe((response) => {
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

  downloadfrequency(frequency: Frequency) {
    setTimeout(() => {
      let frequenciesCSV: ID_xFrequencies[] = [];
      let item: ID_xFrequencies = {
        "Id": frequency ? frequency.Id : "",
        "Id del cliente": frequency ? frequency.ClienteId : "",
        "Nombre del cliente": frequency ? frequency.Clientes_Nombres : "",
        "Apellidos del cliente": frequency ? frequency.Clientes_Apellidos : "",
        "Id de la campaña": frequency ? frequency.CampanaId : "",
        "Nombre de la campaña": frequency ? frequency.Campanas_Nombre : "",
        "Toques del día": frequency ? frequency.ToquesDia : "",
        "Fecha de creación": frequency ? frequency.createdAt.formated : "",
        "Fecha de modificación": frequency ? frequency.updatedAt.formated : "",
      }
      frequenciesCSV.push(item);
      this.commonService.exportAsExcelFile(frequenciesCSV, 'Cliente');
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
