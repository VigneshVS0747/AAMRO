import { Component, OnInit } from '@angular/core';
import { EncdrcService } from './encdrc.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-encrypt-decrypt',
  templateUrl: './encrypt-decrypt.component.html',
  styleUrls: ['./encrypt-decrypt.component.css', "../../../ums/ums.styles.css"]
})
export class EncryptDecryptComponent implements OnInit {
  titile:string;
  Encryption:string;
  Decryption:string;
  Output:string;
  submitted: boolean = false;
  submittedDecrypt: boolean = false;

  constructor(private service:EncdrcService,private commonService :CommonService){

  }

  ngOnInit(): void {
   this.titile="Encrypt & Decrypt"
  }

  Encrypt(){
    this.submitted = true;
    if(this.Encryption!=null){
      this.service.Encrypt(this.Encryption).subscribe((res) => {
        this.Output = res.encryptedText;
      });
    }else{
    }
  }
  

  Decrypt(){
    this.submittedDecrypt = true;
    if(this.Decryption!=null){

      this.service.Decrypt(this.Decryption).subscribe({
        next: (res) => {
          this.Output = res.decryptedText;
        },
        error: (error) => {
 
            this.commonService.displayToaster(
              "error",
              "Error",
              error.error.ErrorDetails
            )
        },
      });
    }
  }

  reset(){
    this.Encryption="";
    this.Decryption="";
    this.submitted = false;
  }
}
