import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor() { }

  handleError(error: any): void {
    let errorMessage = 'Something went wrong';

    if (error instanceof HttpErrorResponse) {
      if (error.error?.ErrorDetails) {
        const detailedError = error.error.ErrorDetails;
        const columnName = this.extractColumnName(detailedError);
        errorMessage = columnName ? `${columnName}` : errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      } 
    }

    this.showErrorAlert(errorMessage);
  }

  private extractColumnName(errorDetails: string): string | null {
    //Foreign Key
    const foreignKeyPattern = /column '(\w+)'/i;
    const foreignKeyMatch = errorDetails.match(foreignKeyPattern);
    if (foreignKeyMatch) {
      let columnName = foreignKeyMatch[1];
      if (columnName.endsWith('Id')) {
        columnName = columnName.slice(0, -2);
      }
      return `Data Error: ${columnName}`;
    }


    //Unique Key
    const uniqueKeyPattern = /UNIQUE KEY constraint '([^']*)'.*duplicate key value is.*\(([^)]+)\)/i;
    const uniqueKeyMatch = errorDetails.match(uniqueKeyPattern);
  
    if (uniqueKeyMatch) {
      const constraintName = uniqueKeyMatch[1];
      
      const tableNamePattern = /^.+?_([^_]+_.*)$/;
      const columnNamesMatch = constraintName.match(tableNamePattern);

      if (columnNamesMatch) {
        const columnNames = columnNamesMatch[1];

        const cleanedColumnNames = columnNames
        .split(',')
        .map(name => {
          const parts = name.split('_');
          // Filter parts that end with "Id" or keep the last part if none end with "Id"
          const idParts = parts?.filter(part => part.endsWith('Id'));
          return idParts.length ? idParts?.map(part => part.replace(/Id$/, '')).join(', ') : parts[parts.length - 1];
        })
        .join(', ');

        return cleanedColumnNames ? `Duplicate data: ${cleanedColumnNames}` : 'Duplicate found';
      }
      
      
      // if (columnNamesMatch) {
      //   const columnNames = columnNamesMatch[1];
        
      //   const cleanedColumnNames = columnNames
      //     .split('_')
      //     .filter(name => name.endsWith('Id'))
      //     .map(name => name.replace(/Id$/, ''))
      //     .join(', ');
  
      //   return cleanedColumnNames ? `Duplicate data: ${cleanedColumnNames}` : 'Duplicate found';
      // }
      
    }
  
    return errorDetails;
  }
  


  FourHundredErrorHandler(error: HttpErrorResponse): void{
    if (error.status === 400 && error.error?.errors) {
      const errorMessage = this.formatValidationErrors(error.error.errors);
      this.showErrorAlert(errorMessage);
    } else {
      this.showErrorAlert('One more validation is occured');
    }
  }

  // private formatValidationErrors(errors: { [key: string]: string[] }): string {
  //   let messages: string[] = [];
  //   let firstFieldProcessed = false;

  //   for (const [field, fieldErrors] of Object.entries(errors)) {
  //     if (fieldErrors.length > 0) {
  //       if (!firstFieldProcessed) {
  //         let formattedField = field.startsWith('$.') ? field.slice(2) : field;
          
  //         messages.push(` ${fieldErrors[0]}`);
  //         firstFieldProcessed = true;  
  //       }
  //     }
  //   }
  
  //   return messages.join('\n');
  // }

  private formatValidationErrors(errors: { [key: string]: string[] }): string {
    let messages: string[] = [];
    let processedFields: Set<string> = new Set();  
  
    for (const [field, fieldErrors] of Object.entries(errors)) {
      if (fieldErrors.length > 0) {
        let formattedField = field.startsWith('$.') ? field.slice(2) : field;  
  
        if (formattedField.endsWith('Dto')) {
          continue; 
        }
  
        const parts = formattedField.split('.'); 
        let columnName = parts[parts.length - 1]; 
  
        if (columnName.endsWith('Id')) {
          columnName = columnName.slice(0, -2);  
        }
  
        columnName = columnName.charAt(0).toUpperCase() + columnName.slice(1);
  
        if (!processedFields.has(columnName)) {
          messages.push(`The ${columnName} field is required.`);
          processedFields.add(columnName); 
        }
      }
    }
  
    const lastMessage:any = messages[messages?.length - 1];
    return lastMessage;
  }
  
  
  

  commonMsg(){
    this.showErrorAlert('Check the required field');
  }

  //Common Error msg 
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
      timer: 10000
    });
  }
}
