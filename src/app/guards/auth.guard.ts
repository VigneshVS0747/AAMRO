import { inject } from "@angular/core";
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { LoginService } from "../services/ums/login.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const loginCheck: boolean = inject(LoginService).IsLoggedIn();
  if (loginCheck) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};

export const LoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log("login guard");
    localStorage.clear();

  const router = inject(Router);
  const loginCheck: boolean = inject(LoginService).IsLoggedIn();
  if (loginCheck) {    
    router.navigate(["/ums"]);
    return false;
  } else {
    return true;
  }
};

export const DynamicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log("inside");
  
  console.log("rote===>", route);
  const router = inject(Router);
  const store = inject(Store<{ guardPrivileges: { guardPrivileges: any } }>);
  return new Observable<boolean>((observe) => {
    store.select("guardPrivileges").subscribe({
      next: (res) => {
        let parentRouteArray = state.url.split("/");
        let parentRoute: string;
        if (parentRouteArray.length > 3) {
          parentRoute = parentRouteArray.slice(1, 4).join("/");
        } else {
          parentRoute = state.url;
        }
        if (res.guardPrivileges.includes(parentRoute)) {
          observe.next(true);
        } else {
          console.log("not an available route");
          router.navigate(["/ums"]);
          observe.next(false);
        }
      },
    });
  });
};
