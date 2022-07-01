import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from 'src/app/interfaces/datamodel/customer';
import { ID_xCustomers } from 'src/app/interfaces/datamodel/excel/customers';
import { ID_Option } from 'src/app/interfaces/datamodel/options';
import { ID_pCustomers } from 'src/app/interfaces/datamodel/parametrosTablas/customer';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css']
})
export class CustomersTableComponent implements OnInit {
  filterName: string = 'nombres';
  parameterFilter: any = 'Nombres';
  showFilters!: boolean;
  optDateFilter!: ID_Option[];
  modeFilterDate!: boolean;
  modeFilterColumns!: boolean;
  selectedAll!: boolean;
  listTitles!: ID_pCustomers[];
  @Input() customers!: Customer[];
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
  customerSelected!: boolean;
  customersSelected: Customer[] = [];
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
  ) {
    this.optDateFilter = this.commonService.getDataLocal("optFiltersDate");
    this.listTitles = this.commonService.getDataLocal("pCustomers");
    this.filters = this.commonService.getDataLocal("fCustomers");
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
            if (this.customers.length > 0) {
              for (let b = 0; b < this.customers.length; b++) {
                const customer = this.customers[b];
                customer.selected = this.selectedAll;
              }
              this.customersSelected = [];
              this.customerSelected = false;
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
    if (valueIn) {
      for (let a = 0; a < this.customers.length; a++) {
        const customer: any = this.customers[a];
        let filter = customer[parameter].toString().toLowerCase();
        if (filter.indexOf(valueIn) === -1) {
          customer.show = false;
        } else {
          customer.show = true;
        }
      }
    } else {
      for (let b = 0; b < this.customers.length; b++) {
        const customer: any = this.customers[b];
        customer.show = true;
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
    this.selectedAll = data ? data.checked : false;
    for (let a = 0; a < this.customers.length; a++) {
      const customer = this.customers[a];
      customer.selected = this.selectedAll;
    }
  }

  sort(data: any) {
    setTimeout(() => {
      let inital = this.customers;
      if (!this.ascendent) {
        this.commonService.orderAscent(this.customers, data.id);
      } else {
        this.commonService.orderDecent(this.customers, data.id);
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

  onOffSelected(data: any, customer: Customer, index: number) {
    customer.selected = data ? data.checked : false;
    this.customerSelected = customer.selected;
    if (customer.selected) {
      this.customersSelected.push(customer);
    } else {
      this.customersSelected.slice(index, 1);
    }
  }

  deleteAll() {
    setTimeout(() => {
      if (this.selectedAll) {
        this.delete.emit({ deleteAll: true, customers: this.customers });
      } else {
        this.delete.emit({ deleteSelected: false, customers: this.customersSelected });
      }
    }, 400);
  }

  downloadAll() {
    setTimeout(() => {
      if (this.selectedAll) {
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
        this.selectedAll = false;
        this.customerSelected = false;
        for (let a = 0; a < this.customers.length; a++) {
          const customer = this.customers[a];
          customer.selected = this.selectedAll;
        }
      } else {
        let customersCSV: ID_xCustomers[] = [];
        if (this.customersSelected.length > 0) {
          for (let a = 0; a < this.customersSelected.length; a++) {
            const customer: Customer = this.customersSelected[a];
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
          this.selectedAll = false;
          this.customerSelected = false;
          for (let a = 0; a < this.customers.length; a++) {
            const customer = this.customers[a];
            customer.selected = this.selectedAll;
          }
          this.customersSelected = [];
        }
      }
    }, 400);
  }

  openCustomer(customer: Customer, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.customers.length; a++) {
        const cust = this.customers[a];
        cust.selected = this.selectedAll;
      }
      customer.selected = true;
      this.customerSelected = customer.selected;
      this.customersSelected = [];
      this.customersSelected.push(customer);
      this.open.emit({ customer: customer, index: index });
    }, 400);
  }

  editCustomer(customer: Customer, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.customers.length; a++) {
        const cust = this.customers[a];
        cust.selected = this.selectedAll;
      }
      customer.selected = true;
      this.customerSelected = customer.selected;
      this.customersSelected = [];
      this.customersSelected.push(customer);
      this.edit.emit({ customer: customer, index: index });
    }, 400);
  }

  deleteCustomer(customer: Customer, index: number) {
    setTimeout(() => {
      this.delete.emit({ deleteSingle: true, customer: customer });
    }, 400);
  }

  downloadCustomer(customer: Customer, index: number) {
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
    }, 400);
  }
}
