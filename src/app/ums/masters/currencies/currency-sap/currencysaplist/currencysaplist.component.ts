import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-currencysaplist',
  templateUrl: './currencysaplist.component.html',
  styleUrls: ['./currencysaplist.component.css']
})
export class CurrencysaplistComponent implements OnInit {
  currencies: any[] = []; // To hold the currencies list

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const url = environment.apiUrl +'Currency/loginsap';
    const loginData = {
      "CompanyDB": "AAAMROLOGIXTEST",
      "Password": "Angler@123",
      "UserName": "Dev01"
    };

    this.http.post(url, loginData).subscribe(
      response => {
        console.log('Login successful', response);
        this.GetCurrencies();
      },
      error => {
        console.error('Error during login', error);
      }
    );
    
  }


  GetCurrencies(){
    const url = environment.apiUrl +'Currency/Getcurrencysap'; // Your API URL

    // Making GET request to fetch the currencies list
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.currencies = response; // Assuming response is an array of currencies
        console.log('Currencies:', this.currencies); // Logging the response
      },
      (error) => {
        console.error('Error fetching currencies', error); // Handling errors
      }
    );
  }
}
