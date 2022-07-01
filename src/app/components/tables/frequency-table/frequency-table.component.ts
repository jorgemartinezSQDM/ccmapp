import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ID_xFrequencies } from 'src/app/interfaces/datamodel/excel/frequencies';
import { Frequency } from 'src/app/interfaces/datamodel/frequency';
import { ID_Option } from 'src/app/interfaces/datamodel/options';
import { ID_pFrequencies } from 'src/app/interfaces/datamodel/parametrosTablas/frequencies';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-frequency-table',
  templateUrl: './frequency-table.component.html',
  styleUrls: ['./frequency-table.component.css']
})
export class FrequencyTableComponent implements OnInit {
  filterName: string = 'nombre de la campaña';
  parameterFilter: any = 'Campanas_Nombre';
  showFilters!: boolean;
  optDateFilter!: ID_Option[];
  modeFilterDate!: boolean;
  modeFilterColumns!: boolean;
  selectedAll!: boolean;
  listTitles!: ID_pFrequencies[];
  @Input() frequencies!: Frequency[];
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
  frequencySelected!: boolean;
  frequenciesSelected: Frequency[] = [];
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
  ) {
    this.optDateFilter = this.commonService.getDataLocal("optFiltersDate");
    this.listTitles = this.commonService.getDataLocal("pFrequencies");
    this.filters = this.commonService.getDataLocal("fFrequencies");
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
            if (this.frequencies.length > 0) {
              for (let b = 0; b < this.frequencies.length; b++) {
                const frequency = this.frequencies[b];
                frequency.selected = this.selectedAll;
              }
              this.frequenciesSelected = [];
              this.frequencySelected = false;
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
      for (let a = 0; a < this.frequencies.length; a++) {
        const frequency: any = this.frequencies[a];
        let filter = frequency[parameter].toString().toLowerCase();
        if (filter.indexOf(valueIn) === -1) {
          frequency.show = false;
        } else {
          frequency.show = true;
        }
      }
    } else {
      for (let b = 0; b < this.frequencies.length; b++) {
        const frequency: any = this.frequencies[b];
        frequency.show = true;
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
    for (let a = 0; a < this.frequencies.length; a++) {
      const frequency = this.frequencies[a];
      frequency.selected = this.selectedAll;
    }
  }

  sort(data: any) {
    setTimeout(() => {
      let inital = this.frequencies;
      if (!this.ascendent) {
        this.commonService.orderAscent(this.frequencies, data.id);
      } else {
        this.commonService.orderDecent(this.frequencies, data.id);
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

  onOffSelected(data: any, frequency: Frequency, index: number) {
    frequency.selected = data ? data.checked : false;
    this.frequencySelected = frequency.selected;
    if (frequency.selected) {
      this.frequenciesSelected.push(frequency);
    } else {
      this.frequenciesSelected.slice(index, 1);
    }
  }

  deleteAll() {
    setTimeout(() => {
      if (this.selectedAll) {
        this.delete.emit({ deleteAll: true, frequencies: this.frequencies });
      } else {
        this.delete.emit({ deleteSelected: false, frequencies: this.frequenciesSelected });
      }
    }, 400);
  }

  downloadAll() {
    setTimeout(() => {
      if (this.selectedAll) {
        let frequenciesCSV: ID_xFrequencies[] = [];
        for (let a = 0; a < this.frequencies.length; a++) {
          const frequency: Frequency = this.frequencies[a];
          let item: ID_xFrequencies = {
            "Id": frequency ? frequency.Id : "",
            "Id del cliente": frequency ? frequency.ClienteId : "",
            "Nombre del cliente": frequency ? frequency.Clientes_Nombres : "",
            "Apellidos del cliente": frequency ? frequency.Clientes_Apellidos : "",
            "Id de la camapaña": frequency ? frequency.CampanaId : "",
            "Nombre de la camapaña": frequency ? frequency.Campanas_Nombre : "",
            "Toques del día": frequency ? frequency.ToquesDia : "",
            "Fecha de creación": frequency ? frequency.createdAt.formated : "",
            "Fecha de modificación": frequency ? frequency.updatedAt.formated : "",
          }
          frequenciesCSV.push(item);
        };
        this.commonService.exportAsExcelFile(frequenciesCSV, "Frecuencias");
        this.selectedAll = false;
        this.frequencySelected = false;
        for (let a = 0; a < this.frequencies.length; a++) {
          const frequency = this.frequencies[a];
          frequency.selected = this.selectedAll;
        }
      } else {
        let frequenciesCSV: ID_xFrequencies[] = [];
        if (this.frequenciesSelected.length > 0) {
          for (let a = 0; a < this.frequenciesSelected.length; a++) {
            const frequency: Frequency = this.frequenciesSelected[a];
            let item: ID_xFrequencies = {
              "Id": frequency ? frequency.Id : "",
              "Id del cliente": frequency ? frequency.ClienteId : "",
              "Nombre del cliente": frequency ? frequency.Clientes_Nombres : "",
              "Apellidos del cliente": frequency ? frequency.Clientes_Apellidos : "",
              "Id de la camapaña": frequency ? frequency.CampanaId : "",
              "Nombre de la camapaña": frequency ? frequency.Campanas_Nombre : "",
              "Toques del día": frequency ? frequency.ToquesDia : "",
              "Fecha de creación": frequency ? frequency.createdAt.formated : "",
              "Fecha de modificación": frequency ? frequency.updatedAt.formated : "",
            }
            frequenciesCSV.push(item);
          };
          this.commonService.exportAsExcelFile(frequenciesCSV, "Frecuencias");
          this.selectedAll = false;
          this.frequencySelected = false;
          for (let a = 0; a < this.frequencies.length; a++) {
            const frequency = this.frequencies[a];
            frequency.selected = this.selectedAll;
          }
          this.frequenciesSelected = [];
        }
      }
    }, 400);
  }

  openfrequency(frequency: Frequency, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.frequencies.length; a++) {
        const cust = this.frequencies[a];
        cust.selected = this.selectedAll;
      }
      frequency.selected = true;
      this.frequencySelected = frequency.selected;
      this.frequenciesSelected = [];
      this.frequenciesSelected.push(frequency);
      this.open.emit({ frequency: frequency, index: index });
    }, 400);
  }

  editfrequency(frequency: Frequency, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.frequencies.length; a++) {
        const cust = this.frequencies[a];
        cust.selected = this.selectedAll;
      }
      frequency.selected = true;
      this.frequencySelected = frequency.selected;
      this.frequenciesSelected = [];
      this.frequenciesSelected.push(frequency);
      this.edit.emit({ frequency: frequency, index: index });
    }, 400);
  }

  deletefrequency(frequency: Frequency, index: number) {
    setTimeout(() => {
      this.delete.emit({ deleteSingle: true, frequency: frequency });
    }, 400);
  }

  downloadfrequency(frequency: Frequency, index: number) {
    setTimeout(() => {
      let frequenciesCSV: ID_xFrequencies[] = [];
      let item: ID_xFrequencies = {
        "Id": frequency ? frequency.Id : "",
        "Id del cliente": frequency ? frequency.ClienteId : "",
        "Nombre del cliente": frequency ? frequency.Clientes_Nombres : "",
        "Apellidos del cliente": frequency ? frequency.Clientes_Apellidos : "",
        "Id de la camapaña": frequency ? frequency.CampanaId : "",
        "Nombre de la camapaña": frequency ? frequency.Campanas_Nombre : "",
        "Toques del día": frequency ? frequency.ToquesDia : "",
        "Fecha de creación": frequency ? frequency.createdAt.formated : "",
        "Fecha de modificación": frequency ? frequency.updatedAt.formated : "",
      }
      frequenciesCSV.push(item);
      this.commonService.exportAsExcelFile(frequenciesCSV, 'Frecuencia');
    }, 400);
  }
}
