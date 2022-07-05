import { EventEmitter, Injectable, Output } from '@angular/core';
import * as dMenu from "../../../assets/data/lists.json";
import * as dActionsProfile from "../../../assets/data/actionsProfile.json";
import * as dFeedback from "../../../assets/data/feedback.json";
import * as dOptDateFilter from "../../../assets/data/optsFiltersDate.json";
import * as dParameters from "../../../assets/data/parameters.json";
import * as dFilters from "../../../assets/data/filters.json";
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @Output() share: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: Router,
  ) { }

  shareData(data: any) {
    this.share.emit(data);
  }

  getDataLocal(nameData: string) {
    let data: any;
    switch (nameData) {
      case "menu":
        data = (dMenu as any).default[nameData];
        break;
      case "actionsProfile":
        data = (dActionsProfile as any).default[nameData];
        break;
      case "feedback":
        data = (dFeedback as any).default[nameData];
        break;
      case "optFiltersDate":
        data = (dOptDateFilter as any).default[nameData];
        break;
      case "pCampaigns":
        data = (dParameters as any).default[nameData];
        break;
      case "fCampaigns":
        data = (dFilters as any).default[nameData];
        break;
      case "pCustomers":
        data = (dParameters as any).default[nameData];
        break;
      case "fCustomers":
        data = (dFilters as any).default[nameData];
        break;
      case "pUsers":
        data = (dParameters as any).default[nameData];
        break;
      case "fUsers":
        data = (dFilters as any).default[nameData];
        break;
      case "pFrequencies":
        data = (dParameters as any).default[nameData];
        break;
      case "fFrequencies":
        data = (dFilters as any).default[nameData];
        break;
      default:
        break;
    }
    return data;
  }

  goTo(slug: string, data: any) {
    if (data) {
      this.route.navigate([slug], { queryParams: data });
    } else {
      this.route.navigate([slug]);
    }
  }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, CommonService.toExportFileName(excelFileName));
  }

  cleanElementClasses(elems: any[], className: string) {
    for (let index = 0; index < elems.length; index++) {
      const elem = elems[index];
      elem.classList.remove(className);
    }
  }

  searchInArray(searchValue: any, by: string, arr: any) {
    let array = arr;
    let searh = array.filter((elem: any) => elem[by] ? elem[by].indexOf(searchValue) >= 0 : false);
    return searh ? searh : null;
  }

  removerDuplicadosInArray(array: any[], by: string) {
    let hash: any = {}
    let formated = array.filter((current: any) => {
      let exists: any = !hash[current[by]];
      hash[current[by]] = true;
      return exists;
    });
    return formated ? formated : null;
  }

  removeInArray(array: any[], by: any, parameter: string) {
    let formated: any[] = [];
    formated = array.filter((item: any) => item[parameter] !== by);
    return formated;
  }

  orderDecent(obj: any, by: any) {
    let response;
    response = obj.sort(function (a: any, b: any) {
      if (a[by] < b[by]) {
        return -1;
      } else if (a[by] > b[by]) {
        return 1;
      } else {
        return 0;
      }
    });
    return response;
  }

  orderDecent2D(obj: any, by: any, sub: any) {
    let response;
    response = obj.sort(function (a: any, b: any) {
      if (a[by][sub] < b[by][sub]) {
        return -1;
      } else if (a[by][sub] > b[by][sub]) {
        return 1;
      } else {
        return 0;
      }
    });
    return response;
  }

  orderAscent(obj: any, by: any) {
    let response;
    response = obj.reverse(function (a: any, b: any) {
      if (a[by] < b[by]) {
        return -1;
      } else if (a[by] > b[by]) {
        return 1;
      } else {
        return 0;
      }
    });
    return response;
  }

  orderAscent2D(obj: any, by: any, sub: any) {
    let response;
    response = obj.reverse(function (a: any, b: any) {
      if (a[by][sub] < b[by][sub]) {
        return -1;
      } else if (a[by][sub] > b[by][sub]) {
        return 1;
      } else {
        return 0;
      }
    });
    return response;
  }

  toCapitalize(text: string) {
    let textArray = text.split(" ");
    let capitalize = "";
    let response;
    if (textArray.length > 0) {
      for (let a = 0; a < textArray.length; a++) {
        let lower = textArray[a].toLowerCase();
        let out = textArray[a].charAt(0).toUpperCase() + lower.slice(1);
        if (a == textArray.length - 1) {
          capitalize = capitalize + out;
        } else {
          capitalize = capitalize + out + " ";
        }
      }
      response = capitalize;
    }
    return response;
  }

  toCapitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  formatedDateForInput(date: any) {
    let offset = new Date().getTimezoneOffset() * 1000 * 60
    let getLocalDate = (date: any) => {
      let offsetDate = new Date(date).valueOf() - offset
      let result = new Date(offsetDate).toISOString()
      return result.substring(0, 16)
    }
  }

  formatedDate(date: any) {
    let arrDate = date.split("T");
    let dateSeparated = arrDate[0].split("-");
    let result = dateSeparated[2] + "/" + dateSeparated[1] + "/" + dateSeparated[0];
    return result;
  }
}
