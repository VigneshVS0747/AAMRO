import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EncdrcService {

  constructor(private http: HttpClient) { }

  Encrypt(Enc:string) {
    return this.http
      .post<any>(environment.apiUrl + "Enc_Dry/Encrypt/"+ Enc,null)
  }


  Decrypt(Dry:string):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Enc_Dry/Decrypt/"+  Dry ,null);
  }
}
