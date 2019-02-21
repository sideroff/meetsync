import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, startWith } from 'rxjs/operators';

let countriesJSON = {}

@Component({
  selector: 'country-select-control',
  templateUrl: './country-select-control.component.html',
  styleUrls: ['./country-select-control.component.scss']
})
export class CountrySelectControlComponent {
  public countries: any = countriesJSON;
  public filteredCountries: Observable<any>;
  public myControl: FormControl = new FormControl();

  ngOnInit() {
    this.filteredCountries = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    console.log(window)
  }

  public getCountryViewValue(country: any) {
    return country
      ? country.value
      : '';
  }

  private _filter(value: string): any {
    if (typeof value !== 'string') return;


    const filterValue = value.toLowerCase();
    let filteredEntries = Object.entries(this.countries).filter((entry: any) => {
      return entry[1].toLowerCase().includes(filterValue);
    })

    let filteredEntriesObject = filteredEntries.reduce((accumulator, current) => {
      return Object.assign(accumulator, { [current[0]]: current[1] })
    }, {})

    return filteredEntriesObject
  }
}
