import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/httpService/http-service.service'
import { User } from '../../interfaces/datamodel/user'
import { Router } from '@angular/router';
import { SessionServiceService } from '../../services/sessionService/session-service.service'
import { ID_Menu } from 'src/app/interfaces/datamodel/menu';
import { CommonService } from 'src/app/services/common/common.service';
import { ID_rUsers } from 'src/app/interfaces/datamodel/response/users';
import { ID_xUsers } from 'src/app/interfaces/datamodel/excel/users';
import * as moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title: string = "Usuarios";
  description: string = "";
  modeOpen: boolean = false;
  modeEdit: boolean = false;
  userOpen = <User>{};
  userEdit = <User>{};
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
  idUserDelete!: any;
  messageDialog!: string;
  deleteAll!: boolean;
  deleteSingle!: boolean;
  deleteSingleCard!: boolean;
  deleteSelected!: boolean;
  usersToDelete!: User[];
  lists!: ID_Menu[];

  usersResponse: any
  token: string = ''
  users: User[] = []
  actualPage: any = 1;
  size = 100;
  pagination: boolean = true;
  lasted: boolean = false;
  formatDate: string = "DD/MM/YYYY hh:mm A";
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
      itemList.selected = itemList.id === '03' ? true : false;
    }
  }

  getAll(page: any, size: any): void {
    this.HttpService.getAll('users', this.token, page, size)
      .subscribe(response => {
        let formatUsers: User[] = [];
        let UsersResponse: ID_rUsers = response;
        if (UsersResponse) {
          if (UsersResponse.Records.length > 0) {
            let users = UsersResponse.Records;
            this.pagination = users.length < this.size && this.actualPage == 1 ? false : true;
            this.lasted = users.length < this.size && this.actualPage != 1 ? true : false;
            for (let a = 0; a < users.length; a++) {
              const user = users[a];
              let created = user.createdAt ? moment(user.createdAt).local(true).format(this.formatDate) : "";
              let updated = user.updatedAt ? moment(user.updatedAt).local(true).format(this.formatDate) : "";
              let item: User = {
                createdAt: {
                  value: user.createdAt ? user.createdAt : "",
                  formated: created,
                },
                Id: user.Id ? user.Id : "",
                NombreUsuario: user.NombreUsuario ? user.NombreUsuario : "",
                selected: false,
                show: true,
                updatedAt: {
                  value: user.updatedAt ? user.updatedAt : "",
                  formated: updated,
                },
              };
              formatUsers.push(item);
            }
            this.users = formatUsers;
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
        this.usersToDelete = data.users;
      } else if (data.deleteSelected) {
        this.messageDialog = "¿está seguro de eliminar el o los elemento(s) seleccionado(s)?";
        this.deleteAll = false;
        this.deleteSelected = true;
        this.deleteSingle = false;
        this.deleteSingleCard = false;
        this.usersToDelete = data.users;
      } else if (data.deleteSingle) {
        this.messageDialog = "¿está seguro de eliminar este elemento?";
        this.deleteAll = false;
        this.deleteSelected = false;
        this.deleteSingle = true;
        this.deleteSingleCard = false;
        this.idUserDelete = data.user.id;
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
    this.userOpen = data.user;
    this.dateCreadtedOpen = this.userOpen.createdAt.formated;
    this.dateUpdatedOpen = this.userOpen.updatedAt.formated;
    this.elems.table = document.getElementById("listContent") ? document.getElementById("listContent") : null;
    setTimeout(() => {
      if (this.elems.table) {
        this.elems.table.scrollLeft = 1264;
      }
    }, 400);
  }

  editFromOpen(user: User) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.userEdit = user;
      this.modeOpen = false;
      this.modeEdit = true;
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
      this.commonService.shareData({ unSelected: true });
    }, 400);
  }

  edit(data: any) {
    this.modeOpen = false;
    this.modeEdit = true;
    this.userEdit = data.user;
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
      this.commonService.shareData({ unSelected: true });
    }, 400);
  }

  update() {
    this.spinner = true;
    this.elems.name = document.getElementById("name") ? document.getElementById("name") : null;
    setTimeout(() => {
      let item: any = {
        "NombreUsuario": this.elems.name ? this.elems.name.value : this.userEdit.NombreUsuario,
      }
      let request = [];
      request.push(item);
      this.HttpService.updateUser(request, this.token).subscribe((response) => {
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

  openDialogDeleteCard(user: User) {
    setTimeout(() => {
      this.messageDialog = "¿está seguro de eliminar este elemento?"
      this.dialog = true;
      this.deleteAll = false;
      this.deleteSelected = false;
      this.deleteSingle = false;
      this.deleteSingleCard = true;
      this.idUserDelete = user.Id;
    }, 400);
  }

  deleteUsers(data: any) {
    if (data.action) {
      if (this.deleteAll) {
        let allDelete = 0;
        for (let a = 0; a < this.usersToDelete.length; a++) {
          const user: User = this.usersToDelete[a];
          this.HttpService.deleteUser(user.Id, this.token).subscribe((response) => {
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
        for (let b = 0; b < this.usersToDelete.length; b++) {
          const user: User = this.usersToDelete[b];
          this.HttpService.deleteUser(user.Id, this.token).subscribe((response) => {
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
        this.HttpService.deleteUser(this.idUserDelete, this.token).subscribe((response) => {
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
        this.HttpService.deleteUser(this.idUserDelete, this.token).subscribe((response) => {
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

  downloadUser(user: User) {
    setTimeout(() => {
      let usersCSV: ID_xUsers[] = [];
      let item: ID_xUsers = {
        "Id": user.Id,
        "Nombre de usuario": user.NombreUsuario,
        "Fecha de creación": user.createdAt.formated,
        "Fecha de modificación": user.updatedAt.formated,
      }
      usersCSV.push(item);
      this.commonService.exportAsExcelFile(usersCSV, 'Cliente');
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
