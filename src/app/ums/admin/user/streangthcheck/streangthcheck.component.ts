import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-streangthcheck',
  templateUrl: './streangthcheck.component.html',
  styleUrls: ['./streangthcheck.component.css']
})
export class StreangthcheckComponent implements OnInit {
  ngOnInit(): void {
   this.visible=false;
  }
  @Input() public passwordToVerify: any;
  @Input() public barLabel: any;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  visible:boolean = false;

  msg = '';
  bar: string[] = ['', '', '', ''];

  private colors = ['darkred', 'orangered', 'orange', 'darkgreen'];

  private static checkStrength(p: any) {
    let force = 0;
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    const flags = [lowerLetters, upperLetters, numbers, symbols];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    force += 2 * p.length + (p.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // short password
    force = p.length < 1 ? Math.min(force, 10) : force;

    // poor variety of characters
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    this.visible=true;
    const password = changes['passwordToVerify'].currentValue;
    if(password==""){
      this.visible=false;
    }
    this.setBarColors(4, '#DDD');
    if (password) {
      const c = this.getColor(StreangthcheckComponent.checkStrength(password));
      this.setBarColors(c.idx, c.col);

      const pwdStrength = StreangthcheckComponent.checkStrength(password);
      pwdStrength >=40
        ? this.passwordStrength.emit(true)
        : this.passwordStrength.emit(false);

      switch (c.idx) {
        case 1:
          this.msg = 'Poor';
          break;
        case 2:
          this.msg = 'Not Good';
          break;
        case 3:
          this.msg = 'Average';
          break;
        case 4:
          this.msg = 'Good';
          break;
      }
    } else {
      this.msg = '';
    }
  }

  private getColor(s: number) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count: any, col: any) {
    for (let n = 0; n < count; n++) {
      this.bar[n] = col;
      this.bar = this.bar;
         }
  }
}
