import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorhandlingService {

  constructor(private http: HttpClient) { }


  handleApiError(error: HttpErrorResponse):string {
    if (error.error.StatusCode === 500) {
      const errorMessage = error.error.ErrorDetails;
      if (errorMessage.includes('FOREGIN KEY')) {
        return 'Foreign key violation';
      } else if (errorMessage.includes('UNIQUE KEY')) {
        return 'The data you entered already exist';
      } else {
        return 'Bad Request';
      }
    } else {
      return 'Server error';
    }
  }
}
