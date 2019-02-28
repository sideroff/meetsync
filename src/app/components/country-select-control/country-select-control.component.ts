import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, switchMap, filter, debounceTime, } from 'rxjs/operators';
import { Observable, of as ObservableOf, from as ObservableFromPromise } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';

declare let google: any

let mockGoogleResult: any = [{ "description": "Sofia, Bulgaria", "id": "5d0dbdd070b1f02d2ae827e80b1644a3ff914d14", "matched_substrings": [{ "length": 3, "offset": 0 }], "place_id": "ChIJ9Xsxy4KGqkARYF6_aRKgAAQ", "reference": "ChIJ9Xsxy4KGqkARYF6_aRKgAAQ", "structured_formatting": { "main_text": "Sofia", "main_text_matched_substrings": [{ "length": 3, "offset": 0 }], "secondary_text": "Bulgaria" }, "terms": [{ "offset": 0, "value": "Sofia" }, { "offset": 7, "value": "Bulgaria" }], "types": ["locality", "political", "geocode"] }, { "description": "Sofiivska Borshchahivka, Kyiv Oblast, Ukraine", "id": "20a0d1a936b2a5eefb98c8ab9d8fabbfc908b4e9", "matched_substrings": [{ "length": 3, "offset": 0 }], "place_id": "ChIJ6ZuohbvL1EARBi69rgUtfCE", "reference": "ChIJ6ZuohbvL1EARBi69rgUtfCE", "structured_formatting": { "main_text": "Sofiivska Borshchahivka", "main_text_matched_substrings": [{ "length": 3, "offset": 0 }], "secondary_text": "Kyiv Oblast, Ukraine" }, "terms": [{ "offset": 0, "value": "Sofiivska Borshchahivka" }, { "offset": 25, "value": "Kyiv Oblast" }, { "offset": 38, "value": "Ukraine" }], "types": ["locality", "political", "geocode"] }, { "description": "Sofiemyr, Norway", "id": "f2f8b4a7cabe2a30384274cf487de0f73f2c93fa", "matched_substrings": [{ "length": 3, "offset": 0 }], "place_id": "ChIJnVWL8XZoQUYRAzOF5GwDsZQ", "reference": "ChIJnVWL8XZoQUYRAzOF5GwDsZQ", "structured_formatting": { "main_text": "Sofiemyr", "main_text_matched_substrings": [{ "length": 3, "offset": 0 }], "secondary_text": "Norway" }, "terms": [{ "offset": 0, "value": "Sofiemyr" }, { "offset": 10, "value": "Norway" }], "types": ["locality", "political", "geocode"] }, { "description": "Sofala NSW, Australia", "id": "a4876664da5350d3cbd8df702e2decc8b92e3947", "matched_substrings": [{ "length": 3, "offset": 0 }], "place_id": "ChIJgx3N0lcMDmsRcGtDkLQJBgQ", "reference": "ChIJgx3N0lcMDmsRcGtDkLQJBgQ", "structured_formatting": { "main_text": "Sofala", "main_text_matched_substrings": [{ "length": 3, "offset": 0 }], "secondary_text": "NSW, Australia" }, "terms": [{ "offset": 0, "value": "Sofala" }, { "offset": 7, "value": "NSW" }, { "offset": 12, "value": "Australia" }], "types": ["locality", "political", "geocode"] }, { "description": "Softa, Haryana, India", "id": "9a309d1247721deb5ef98c15882082adc688693d", "matched_substrings": [{ "length": 3, "offset": 0 }], "place_id": "ChIJpytDo1TXDDkR_fwRj4FEGjQ", "reference": "ChIJpytDo1TXDDkR_fwRj4FEGjQ", "structured_formatting": { "main_text": "Softa", "main_text_matched_substrings": [{ "length": 3, "offset": 0 }], "secondary_text": "Haryana, India" }, "terms": [{ "offset": 0, "value": "Softa" }, { "offset": 7, "value": "Haryana" }, { "offset": 16, "value": "India" }], "types": ["locality", "political", "geocode"] }]


@Component({
  selector: 'country-select-control',
  templateUrl: './country-select-control.component.html',
  styleUrls: ['./country-select-control.component.scss']
})
export class CountrySelectControlComponent {
  public cityInput: FormControl = new FormControl();
  public options: any;
  public isGettingCities: Boolean = false;

  public googlePlacesApiSessionToken: any;
  public googlePlacesAutocompleteService: any;
  public googlePlacesService: any;

  constructor() {
    this.resetGooglePlacesApiSessionToken();
    this.googlePlacesAutocompleteService = new google.maps.places.AutocompleteService();
    this.googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  ngOnInit() {

    this.cityInput.valueChanges.pipe(

      tap(),
      debounceTime(300),
      filter(input => input.length >= 3),
      tap(() => {
        this.isGettingCities = true;
        this.options = [];
      }),
      switchMap(input => {
        // mock response so as to not get billed by dev requests to google
        return ObservableFromPromise(
          new Promise((resolve, reject) => {
            setTimeout(function () { resolve(mockGoogleResult) }, 150)
          }));

        return ObservableFromPromise(this.getPredictions(input))
      })).subscribe(results => {
        this.options = results;
        this.isGettingCities = false;
      })
  }

  getPredictions(input, sessionToken = this.googlePlacesApiSessionToken, types = ['(cities)']) {
    return new Promise((resolve, reject) => {
      this.googlePlacesAutocompleteService.getPlacePredictions({
        input,
        types,
        sessionToken,
      }, (result, statusCode) => {
        this.resetGooglePlacesApiSessionToken()
        if (result instanceof Error || statusCode !== google.maps.places.PlacesServiceStatus.OK) return reject(result);
        resolve(result)
      })
    })
  }

  resetGooglePlacesApiSessionToken() {
    // only 1 getDetails request is allowed per session ( = autocomplete keystrokes + getDetails search for a specific place )
    // so we need to reset it on every getDetails call
    this.googlePlacesApiSessionToken = new google.maps.places.AutocompleteSessionToken();
  }

  getPlaceDetails(placeId, sessionToken = this.googlePlacesApiSessionToken, fields = ['utc_offset']) {
    const request = {
      placeId,
      fields,
      sessionToken,
    };
    console.log('request ', request)

    return new Promise((resolve, reject) => {
      this.googlePlacesService.getDetails(request, (result, statusCode) => {
        if (result instanceof Error || statusCode !== google.maps.places.PlacesServiceStatus.OK) return reject(result);
        resolve(result)
      })
    })
  }

  parseAutocompleteObject(option) {
    return option && option.description;
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    const option = event.option.value;

    console.log(option);

    this.getPlaceDetails(option.place_id)
      .then(result => {
        console.log('place details result ', result)
      }).catch(error => {
        console.log('get details error ', error)
      })
      //added: date-fns for date manipulations

    // https://developers.google.com/maps/documentation/javascript/places

    // var request = {
    //   placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    //   fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
    // };

    // service = new google.maps.places.PlacesService(map);
    // service.getDetails(request, callback);

    // function callback(place, status) {
    //   if (status == google.maps.places.PlacesServiceStatus.OK) {
    //     createMarker(place);
    //   }
    // }

  }
}