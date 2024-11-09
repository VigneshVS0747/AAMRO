import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';
import { catchError, switchMap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {
  constructor(private Service:LoginService, private router: Router) { }
  intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{

    let JwtToken = req.clone({
      setHeaders:{
        Authorization: 'Bearer '+this.Service.GetToken()
      }
    });
    return next.handle(JwtToken).pipe(
      catchError((error)=>{
        console.log("error1st---->",error)
        if(error.status === 0){
             return this.handleRefreshToken(req,next)
        }
        return throwError(error);
      })
    );

  }

  handleRefreshToken(req:HttpRequest<any>,next:HttpHandler){
   return this.Service.GenerateRefreshToken().pipe(
    switchMap((data:any)=>{
      this.Service.SaveToken(data);
      return next.handle(this.AddTokenheader(req,data.jwtToken));
    }),
    catchError((error)=>{
      console.log("errorsssss---->",error)
      if(error.status === 401){
        Swal.fire({
          title: "Your session has been expired ",
          text: "Please login...!",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
              this.Service.logout();
              this.router.navigate(["/login"]);
          }
        });
        this.Service.logout();
      }
      return throwError(error);
    })
   );
  }

  AddTokenheader(req:HttpRequest<any>,token:any){
    return req.clone({headers:req.headers.set('Authorization','Bearer '+token)});
  }

}
