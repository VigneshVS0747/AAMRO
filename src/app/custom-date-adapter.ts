import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { format, parse } from 'date-fns';

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      return format(date, 'dd/MM/yyyy');
    }
    return date.toDateString();
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
      if (parsedDate.toString() !== 'Invalid Date') {
        return parsedDate;
      }
    }
    return super.parse(value);
  }
}

export const CUSTOME_DATE_FORMATS = {
    parse: {
      dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' },
    },
    display: {
      dateInput: 'input',
      monthYearLabel: 'mm yyyy',
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: 'mm yyyy',
    },
  };
  