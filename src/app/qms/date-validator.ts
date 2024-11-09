import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class DateValidatorService {

    private today: Date = new Date();



    public static dateRangeValidator(fromDateKey: string, toDateKey: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formGroup = control as FormGroup;
            const fromDate = formGroup.get(fromDateKey)?.value;
            const toDate = formGroup.get(toDateKey)?.value;
    
            if (fromDate && toDate) {
                const from = new Date(fromDate).setHours(0, 0, 0, 0);
                const to = new Date(toDate).setHours(0, 0, 0, 0);
    
                if (to < from) {
                    formGroup.get(toDateKey)?.setErrors({ dateRange: true });
                    return { dateRange: true };
                }
            }
            
            // If no validation errors, clear any previously set errors
            if (formGroup.get(toDateKey)?.hasError('dateRange')) {
                formGroup.get(toDateKey)?.setErrors(null);
            }
            return null;
        };
    }
    

    public static validFromDateValidator(fromDateKey: string, baseDateKey: string): ValidatorFn {
        debugger
        return (control: AbstractControl): ValidationErrors | null => {
            const formGroup = control as FormGroup;
            const fromDate = formGroup.get(fromDateKey)?.value;
            const baseDate = formGroup.get(baseDateKey)?.value;

            if (fromDate && baseDate) {
                const from = new Date(fromDate).setHours(0, 0, 0, 0); // Normalize to midnight
                const base = new Date(baseDate).setHours(0, 0, 0, 0); // Normalize to midnight

                if (from < base) {
                    formGroup.get(fromDateKey)?.setErrors({ fromDateRange: true });
                    return { fromDateRange: true };
                } else {
                    formGroup.get(fromDateKey)?.setErrors(null);
                }
            }
            return null;
        };
    }




    // Function to disable future dates and allow current and past dates
    dateFilter = (d: Date | null): boolean => {
        if (!d) {
            return false;
        }
        const date = new Date(d);

        // Set the time to midnight for both dates to ensure proper comparison
        date.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Allow current and past dates only
        return date <= today;
    }


    futuredateFilter = (d: Date | null): boolean => {
        if (!d) {
            return false;
        }
        const date = new Date(d);
        const today = new Date();
        // Allow future dates only
        return date > today;
    }

}


export function decimalValidator(maxDigitsBeforeDecimal: number, maxDigitsAfterDecimal: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value === null || value === '') {
            return null; // Don't validate empty values
        }

        const regex = new RegExp(`^\\d{1,${maxDigitsBeforeDecimal}}(\\.\\d{1,${maxDigitsAfterDecimal}})?$`);
        const isValidFormat = regex.test(value);
        const isValidValue = parseFloat(value) > 0;

        if (isValidFormat && isValidValue) {
            return null;
        }

        return { decimal: { valid: false, maxDigitsBeforeDecimal, maxDigitsAfterDecimal, greaterThanZero: true } };
    };
}


export function trimLeadingZeros(value: string): string {
    return value.replace(/^0+(?!$)/, '');
}


