import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ID_xUsers } from 'src/app/interfaces/datamodel/excel/users';
import { ID_Option } from 'src/app/interfaces/datamodel/options';
import { ID_pUsers } from 'src/app/interfaces/datamodel/parametrosTablas/users';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';
import { User } from 'src/app/interfaces/datamodel/user';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  filterName: string = 'nombre del usuario';
  parameterFilter: any = 'NombreUsuario';
  showFilters!: boolean;
  optDateFilter!: ID_Option[];
  modeFilterDate!: boolean;
  modeFilterColumns!: boolean;
  selectedAll!: boolean;
  listTitles!: ID_pUsers[];
  @Input() users!: User[];
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
  userSelected!: boolean;
  usersSelected: User[] = [];
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
  ) {
    this.optDateFilter = this.commonService.getDataLocal("optFiltersDate");
    this.listTitles = this.commonService.getDataLocal("pUsers");
    this.filters = this.commonService.getDataLocal("fUsers");
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
            if (this.users.length > 0) {
              for (let b = 0; b < this.users.length; b++) {
                const user = this.users[b];
                user.selected = this.selectedAll;
              }
              this.usersSelected = [];
              this.userSelected = false;
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
        for (let a = 0; a < this.users.length; a++) {
          const user: any = this.users[a];
          let filter = user.createdAt.formated.toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            user.show = false;
          } else {
            user.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.users.length; b++) {
          const user: any = this.users[b];
          user.show = true;
        }
      }
    } else if (parameter == "updatedAt") {
      if (valueIn) {
        for (let a = 0; a < this.users.length; a++) {
          const user: any = this.users[a];
          let filter = user.updatedAt.formated.toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            user.show = false;
          } else {
            user.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.users.length; b++) {
          const user: any = this.users[b];
          user.show = true;
        }
      }
    } else {
      if (valueIn) {
        valueIn = valueIn.toLowerCase();
        for (let a = 0; a < this.users.length; a++) {
          const user: any = this.users[a];
          let filter = user[parameter].toString().toLowerCase();
          if (filter.indexOf(valueIn) === -1) {
            user.show = false;
          } else {
            user.show = true;
          }
        }
      } else {
        for (let b = 0; b < this.users.length; b++) {
          const user: any = this.users[b];
          user.show = true;
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
    this.selectedAll = data ? data.checked : false;
    for (let a = 0; a < this.users.length; a++) {
      const user = this.users[a];
      user.selected = this.selectedAll;
    }
  }

  sort(data: any) {
    setTimeout(() => {
      let inital = this.users;
      if (data.order) {
        if (!this.ascendent) {
          this.commonService.orderAscent(this.users, data.id);
        } else {
          this.commonService.orderDecent(this.users, data.id);
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

  onOffSelected(data: any, user: User, index: number) {
    user.selected = data ? data.checked : false;
    this.userSelected = user.selected;
    if (user.selected) {
      this.usersSelected.push(user);
    } else {
      this.usersSelected.slice(index, 1);
    }
  }

  deleteAll() {
    setTimeout(() => {
      if (this.selectedAll) {
        this.delete.emit({ deleteAll: true, users: this.users });
      } else {
        this.delete.emit({ deleteSelected: false, users: this.usersSelected });
      }
    }, 400);
  }

  downloadAll() {
    setTimeout(() => {
      if (this.selectedAll) {
        let usersCSV: ID_xUsers[] = [];
        for (let a = 0; a < this.users.length; a++) {
          const user: User = this.users[a];
          let item: ID_xUsers = {
            "Id": user.Id,
            "Nombre de usuario": user.NombreUsuario,
            "Fecha de creación": user.createdAt.formated,
            "Fecha de modificación": user.updatedAt.formated,
          }
          usersCSV.push(item);
        };
        this.commonService.exportAsExcelFile(usersCSV, "Usuarios");
        this.selectedAll = false;
        this.userSelected = false;
        for (let a = 0; a < this.users.length; a++) {
          const user = this.users[a];
          user.selected = this.selectedAll;
        }
      } else {
        let usersCSV: ID_xUsers[] = [];
        if (this.usersSelected.length > 0) {
          for (let a = 0; a < this.usersSelected.length; a++) {
            const user: User = this.usersSelected[a];
            let item: ID_xUsers = {
              "Id": user.Id,
              "Nombre de usuario": user.NombreUsuario,
              "Fecha de creación": user.createdAt.formated,
              "Fecha de modificación": user.updatedAt.formated,
            }
            usersCSV.push(item);
          };
          this.commonService.exportAsExcelFile(usersCSV, "Usuarios");
          this.selectedAll = false;
          this.userSelected = false;
          for (let a = 0; a < this.users.length; a++) {
            const user = this.users[a];
            user.selected = this.selectedAll;
          }
          this.usersSelected = [];
        }
      }
    }, 400);
  }

  openUser(user: User, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.users.length; a++) {
        const user = this.users[a];
        user.selected = this.selectedAll;
      }
      user.selected = true;
      this.userSelected = user.selected;
      this.usersSelected = [];
      this.usersSelected.push(user);
      this.open.emit({ user: user, index: index });
    }, 400);
  }

  editUser(user: User, index: number) {
    setTimeout(() => {
      for (let a = 0; a < this.users.length; a++) {
        const user = this.users[a];
        user.selected = this.selectedAll;
      }
      user.selected = true;
      this.userSelected = user.selected;
      this.usersSelected = [];
      this.usersSelected.push(user);
      this.edit.emit({ user: user, index: index });
    }, 400);
  }

  deleteUser(user: User, index: number) {
    setTimeout(() => {
      this.delete.emit({ deleteSingle: true, user: user });
    }, 400);
  }

  downloadUser(user: User, index: number) {
    setTimeout(() => {
      let usersCSV: ID_xUsers[] = [];
      let item: ID_xUsers = {
        "Id": user.Id,
        "Nombre de usuario": user.NombreUsuario,
        "Fecha de creación": user.createdAt.formated,
        "Fecha de modificación": user.updatedAt.formated,
      }
      usersCSV.push(item);
      this.commonService.exportAsExcelFile(usersCSV, 'Usuario');
    }, 400);
  }
}
