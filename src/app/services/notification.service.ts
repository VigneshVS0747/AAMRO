import { Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private toastrOptions: Partial<GlobalConfig> = {
    positionClass: 'toast-center-center', // Custom class for centering
  };

  constructor(private toastr:ToastrService) { }

  ShowSuccess(message: string,title: string)
  {
    this.toastr.success(message,title, this.toastrOptions);
  }

  ShowError(message: string,title: string)
  {
    this.toastr.error(message,title, this.toastrOptions);
  }

  ShowInfo(message: string,title: string)
  {
    this.toastr.info(message,title, this.toastrOptions);
  }

  ShowWarning(message: string,title: string)
  {
    this.toastr.warning(message,title, this.toastrOptions);
  }
}
