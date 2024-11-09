import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private http: HttpClient) { }


  FileUpload(File:any):Observable<any>{
    return this.http.post<any>(`${environment.Fileupload}FileUpload/UploadFile`,File)
  }
  DownloadFile(fileName: string): Observable<Blob> {
    const url = `${environment.FileDownload}FileUpload/DownloadFile/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
