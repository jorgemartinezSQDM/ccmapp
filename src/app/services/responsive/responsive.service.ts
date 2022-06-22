import { EventEmitter, Injectable, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ID_Responsive } from 'src/app/interfaces/datamodel/responsive';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  @Output() responsive: EventEmitter<any> = new EventEmitter<any>();
  public deviceInfo: any;

  constructor(
    private deviceService: DeviceDetectorService,
  ) {
    //console.log(this.device);
  }

  getResponsive(width: number) {
    let device = this.device;
    let responsive = <ID_Responsive>{};
    if (width < 768) {
      responsive.desktop = false;
      responsive.device = device;
      responsive.phone = true;
      responsive.tablet = false;
    } else if (width >= 768 && width < 990) {
      if (device.os.toLowerCase() == "android" && device.orientation.toLowerCase() == "portrait") {
        responsive.desktop = false;
        responsive.device = device;
        responsive.phone = false;
        responsive.tablet = true;
      } else if (device.os.toLowerCase() == "mac") {
        if (device.deviceType.toLowerCase() == "desktop" && device.orientation.toLowerCase() == "portrait") {
          responsive.desktop = false;
          responsive.device = device;
          responsive.phone = false;
          responsive.tablet = true;
        } else {
          responsive.desktop = true;
          responsive.device = device;
          responsive.phone = false;
          responsive.tablet = false;
        }
      } else if (device.os.toLowerCase() == "ios" && device.orientation.toLowerCase() == "portrait") {
        responsive.desktop = false;
        responsive.device = device;
        responsive.phone = false;
        responsive.tablet = true;
      } else {
        responsive.desktop = true;
        responsive.device = device;
        responsive.phone = false;
        responsive.tablet = false;
      }
    } else {
      responsive.desktop = true;
      responsive.device = device;
      responsive.phone = false;
      responsive.tablet = false;
    }
    this.deviceInfo = responsive;
    return responsive;
  }

  get device(): any {
    return this.deviceService.getDeviceInfo();
  }
}
