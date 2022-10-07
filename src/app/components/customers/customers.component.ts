import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { Customer } from '../../interfaces/datamodel/customer'
import { Router } from '@angular/router';
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { ID_Menu } from 'src/app/interfaces/datamodel/menu';
import { CommonService } from 'src/app/services/common/common.service';
import { ID_rCustomers } from 'src/app/interfaces/datamodel/response/customers';
import { ID_xCustomers } from 'src/app/interfaces/datamodel/excel/customers';
import * as moment from 'moment';
import { Frequency } from 'src/app/interfaces/datamodel/frequency';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  title: string = "Clientes";
  description: string = "";
  modeOpen: boolean = false;
  modeEdit: boolean = false;
  customerOpen = <Customer>{};
  customerEdit = <Customer>{};
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
  idCustomerDelete!: any;
  messageDialog!: string;
  deleteAll!: boolean;
  deleteSingle!: boolean;
  deleteSingleCard!: boolean;
  deleteSelected!: boolean;
  customersToDelete!: Customer[];
  lists!: ID_Menu[];

  customerResponse: any
  customers: Customer[] = []
  token: string = ''
  actualPage: any = 1;
  size = 10000; //Limite de registros a mostrar por pagina
  pagination: boolean = true;
  lasted: boolean = false;
  showFrequency!: boolean;
  frequencies!: Frequency[];
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
      itemList.selected = itemList.id === '02' ? true : false;
    }
  }

  getAll(page: any, size: any): void {
    this.HttpService.getAll('customers', this.token, page, size)
      .subscribe(response => {
        let formatCustomers: Customer[] = [];
        let customersResponse: ID_rCustomers = response;
        if (customersResponse) {
          if (customersResponse.Records.length > 0) {
            let customers = customersResponse.Records;
            this.pagination = customers.length < this.size && this.actualPage == 1 ? false : true;
            this.lasted = customers.length < this.size && this.actualPage != 1 ? true : false;
            for (let a = 0; a < customers.length; a++) {
              const customer = customers[a];
              let onlyDateCreated = this.commonService.formatedDate(customer.createdAt);
              let onlyDateUpdated = this.commonService.formatedDate(customer.updatedAt);
              let created = customer.createdAt ? onlyDateCreated + " " + customer.createdAt.split("T")[1].split(".")[0] : "";
              let updated = customer.updatedAt ? onlyDateUpdated + " " + customer.updatedAt.split("T")[1].split(".")[0] : "";
              let item: Customer = {
                Apellidos: customer.Apellidos ? customer.Apellidos : "",
                createdAt: {
                  value: customer.createdAt ? customer.createdAt : "",
                  formated: created,
                },
                Id: customer.Id ? customer.Id : "",
                ListaNegra: customer.ListaNegra ? customer.ListaNegra : false,
                llaveUnicaCliente: customer.llaveUnicaCliente ? customer.llaveUnicaCliente : "",
                Nombres: customer.Nombres ? customer.Nombres : "",
                Numero_Documento: customer.Numero_Documento ? customer.Numero_Documento : "",
                Tipo_Documento: customer.Tipo_Documento ? customer.Tipo_Documento : "",
                selected: false,
                show: true,
                updatedAt: {
                  value: customer.updatedAt ? customer.updatedAt : "",
                  formated: updated,
                },
              };
              formatCustomers.push(item);
            }
            formatCustomers = this.commonService.orderDecent(formatCustomers, "Id");
            this.customers = formatCustomers;
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
      let customersCSV: ID_xCustomers[] = [];
      for (let a = 0; a < this.customers.length; a++) {
        const customer: Customer = this.customers[a];
        let item: ID_xCustomers = {
          "Id": customer.Id,
          "Llave única del cliente": customer.llaveUnicaCliente,
          "Nombres": customer.Nombres,
          "Apellidos": customer.Apellidos,
          "Tipo de documento de identidad": customer.Tipo_Documento,
          "Numero del documento de identidad": customer.Numero_Documento,
          "¿En lista negra?": customer.ListaNegra ? "Si" : "No",
          "Fecha de creación": customer.createdAt.formated,
          "Fecha de modificación": customer.updatedAt.formated,
        }
        customersCSV.push(item);
      };
      this.commonService.exportAsExcelFile(customersCSV, "Clientes");
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
        this.customersToDelete = data.customers;
      } else if (data.deleteSelected) {
        this.messageDialog = "¿está seguro de eliminar el o los elemento(s) seleccionado(s)?";
        this.deleteAll = false;
        this.deleteSelected = true;
        this.deleteSingle = false;
        this.deleteSingleCard = false;
        this.customersToDelete = data.customers;
      } else if (data.deleteSingle) {
        this.messageDialog = "¿está seguro de eliminar este elemento?";
        this.deleteAll = false;
        this.deleteSelected = false;
        this.deleteSingle = true;
        this.deleteSingleCard = false;
        this.idCustomerDelete = data.customer.Id;
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
    this.customerOpen = data.customer;
    this.dateCreadtedOpen = this.customerOpen.createdAt.formated;
    this.dateUpdatedOpen = this.customerOpen.updatedAt.formated;
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    this.HttpService.getAllFrecuencies(this.token, 1, 100, "clienteId", this.customerOpen.Id).subscribe((response) => {
      if (response) {
        if (response.Records.length > 0) {
          let frequencies = response.Records;
          let frequenciesFormat: Frequency[] = [];
          for (let a = 0; a < frequencies.length; a++) {
            const frequency: any | Frequency = frequencies[a];
            let onlyDateCreated = this.commonService.formatedDate(frequency.createdAt);
            let onlyDateUpdated = this.commonService.formatedDate(frequency.updatedAt);
            let created = frequency.createdAt ? onlyDateCreated + " " + frequency.createdAt.split("T")[1].split(".")[0] : "";
            let updated = frequency.updatedAt ? onlyDateUpdated + " " + frequency.updatedAt.split("T")[1].split(".")[0] : "";
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
    setTimeout(() => {
      if (this.elems.table) {
        this.elems.table.scrollLeft = 1264;
      }
    }, 400);
  }

  editFromOpen(customer: Customer) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.customerEdit = customer;
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
    this.customerEdit = data.customer;
    this.showFrequency = false;
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    setTimeout(() => {
      if (this.elems.table) {
        this.elems.table.scrollLeft = 1264;
      }
    }, 400);
  }

  onOffSelected(data: any) {
    this.customerEdit.ListaNegra = data.checked;
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
    this.elems.typeDoc = document.getElementById("typeDoc") ? document.getElementById("typeDoc") : null;
    this.elems.numberDoc = document.getElementById("numberDoc") ? document.getElementById("numberDoc") : null;
    setTimeout(() => {
      let item: any = {
        Id: this.customerEdit.Id,
        Nombres: this.elems.name ? this.elems.name.value : this.customerEdit.Nombres,
        Apellidos: this.elems.lastname ? this.elems.lastname.value : this.customerEdit.Apellidos,
        Tipo_Documento: this.elems.typeDoc ? this.elems.typeDoc.value : this.customerEdit.Tipo_Documento,
        Numero_Documento: this.elems.numberDoc ? this.elems.numberDoc.value : this.customerEdit.Numero_Documento,
        ListaNegra: this.customerEdit.ListaNegra,
      }
      let request = [];
      request.push(item);
      this.HttpService.updateCustomer(request, this.token).subscribe((response) => {
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

  openDialogDeleteCard(customer: any) {
    setTimeout(() => {
      this.messageDialog = "¿está seguro de eliminar este elemento?"
      this.dialog = true;
      this.deleteAll = false;
      this.deleteSelected = false;
      this.deleteSingle = false;
      this.deleteSingleCard = true;
      this.idCustomerDelete = customer.Id;
    }, 400);
  }

  deleteCustomers(data: any) {
    if (data.action) {
      if (this.deleteAll) {
        let allDelete = [];
        for (let a = 0; a < this.customersToDelete.length; a++) {
          const customer: Customer = this.customersToDelete[a];
          allDelete.push(customer.Id);
        }
        this.HttpService.deleteCustomer(allDelete, this.token).subscribe((response) => {
          if (response) {
            this.getAll(this.actualPage, this.size);
            this.feedbackCode = "s0002";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.commonService.shareData({ showFeedbackDialog: true });
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
      } else if (this.deleteSelected) {
        let deletes = [];
        for (let b = 0; b < this.customersToDelete.length; b++) {
          const customer: Customer = this.customersToDelete[b];
          deletes.push(customer.Id);
        }
        this.HttpService.deleteCustomer(deletes, this.token).subscribe((response) => {
          if (response) {
            this.getAll(this.actualPage, this.size);
            this.feedbackCode = "s0003";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.commonService.shareData({ showFeedbackDialog: true });
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
            this.getAll(this.actualPage, this.size);
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
        }, (error) => { });
      } else if (this.deleteSingle) {
        this.HttpService.deleteCustomer(this.idCustomerDelete, this.token).subscribe((response) => {
          if (response) {
            this.getAll(this.actualPage, this.size);
            this.feedbackCode = "s0001";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.commonService.shareData({ showFeedbackDialog: true });
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
        this.HttpService.deleteCustomer(this.idCustomerDelete, this.token).subscribe((response) => {
          if (response) {
            this.getAll(this.actualPage, this.size);
            this.feedbackCode = "s0001";
            this.dialogStates.error = false;
            this.dialogStates.warning = false;
            this.dialogStates.success = true;
            this.commonService.shareData({ showFeedbackDialog: true });
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

  downloadCustomer(customer: Customer) {
    setTimeout(() => {
      let customersCSV: ID_xCustomers[] = [];
      let item: ID_xCustomers = {
        "Id": customer.Id,
        "Llave única del cliente": customer.llaveUnicaCliente,
        "Nombres": customer.Nombres,
        "Apellidos": customer.Apellidos,
        "Tipo de documento de identidad": customer.Tipo_Documento,
        "Numero del documento de identidad": customer.Numero_Documento,
        "¿En lista negra?": customer.ListaNegra ? "Si" : "No",
        "Fecha de creación": customer.createdAt.formated,
        "Fecha de modificación": customer.updatedAt.formated,
      }
      customersCSV.push(item);
      this.commonService.exportAsExcelFile(customersCSV, 'Cliente');
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
