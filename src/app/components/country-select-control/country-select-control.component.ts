import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, switchMap, filter, debounceTime, catchError, } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import apiKey from '../../config/apiKeys.js'
import { Observable, of as ObservableOf } from 'rxjs';

declare let google: any


@Component({
  selector: 'country-select-control',
  templateUrl: './country-select-control.component.html',
  styleUrls: ['./country-select-control.component.scss']
})
export class CountrySelectControlComponent {
  public cityInput: FormControl = new FormControl();
  public options: string[] = [];
  public isGettingCities: Boolean = false;

  constructor() { }

  ngOnInit() {

    this.cityInput.valueChanges.pipe(

      tap(() => console.log('here')),
      debounceTime(300),
      filter(input => input.length >= 3),
      tap(() => this.isGettingCities = true),
      switchMap(input =>{
        let autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']})
        console.log('autocomplete', autocomplete)
        
        return ObservableOf([])
      }).pipe(catchError(error => {
          console.log('error', error);
          return ObservableOf([])
        }),
          tap(results => {
            console.log('results', results);
          })
        )
      )
    ).subscribe(values => {
      console.log('values ', values)
    })
  }
}
// https://maps.googleapis.com/maps/api/place/autocomplete/json?
// key=AIzaSyAZQIarWMHjxknSQLuddmeNJHnRdXRyFac
// &input=Sofia
// &types=(cities)


// https://maps.googleapis.com/maps/api/timezone/json?
// location=39.6034810,-119.6822510
// &timestamp=1551088663
// &key=AIzaSyAZQIarWMHjxknSQLuddmeNJHnRdXRyFac

