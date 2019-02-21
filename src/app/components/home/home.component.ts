import { Component, OnInit } from '@angular/core';

// publically accessible variable from google places api

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public countries = {
    'au': {
      center: { lat: -25.3, lng: 133.8 },
      zoom: 4
    },
    'br': {
      center: { lat: -14.2, lng: -51.9 },
      zoom: 3
    },
    'ca': {
      center: { lat: 62, lng: -110.0 },
      zoom: 3
    },
    'fr': {
      center: { lat: 46.2, lng: 2.2 },
      zoom: 5
    },
    'de': {
      center: { lat: 51.2, lng: 10.4 },
      zoom: 5
    },
    'mx': {
      center: { lat: 23.6, lng: -102.5 },
      zoom: 4
    },
    'nz': {
      center: { lat: -40.9, lng: 174.9 },
      zoom: 5
    },
    'it': {
      center: { lat: 41.9, lng: 12.6 },
      zoom: 5
    },
    'za': {
      center: { lat: -30.6, lng: 22.9 },
      zoom: 5
    },
    'es': {
      center: { lat: 40.5, lng: -3.7 },
      zoom: 5
    },
    'pt': {
      center: { lat: 39.4, lng: -8.2 },
      zoom: 6
    },
    'us': {
      center: { lat: 37.1, lng: -95.7 },
      zoom: 3
    },
    'uk': {
      center: { lat: 54.8, lng: -4.6 },
      zoom: 5
    }
  };

  public map: any;
  public places: any;
  public infoWindow: any;
  public autocomplete: any;
  public markers = [];
  public countryRestrict: any = { 'country': 'us' };
  public MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
  public hostnameRegexp = new RegExp('^https?://.+?/');

  constructor() {

  }

  ngOnInit() {
    debugger;
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.countries['us'].zoom,
      center: this.countries['us'].center,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      streetViewControl: false
    });

    this.infoWindow = new google.maps.infoWindow({
      content: document.getElementById('info-content')
    })

    this.autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(
        document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: this.countryRestrict
      });

    this.places = new google.maps.places.PlacesService(this.map);


    this.autocomplete.addListener('place_changed', this.onPlaceChanged);

    document.getElementById('country').addEventListener(
      'change', this.setAutocompleteCountry);
  }


  onPlaceChanged() {
    var place = this.autocomplete.getPlace();
    if (place.geometry) {
      this.map.panTo(place.geometry.location);
      this.map.setZoom(15);
      this.search();
    }
  }

  search() {
    var search = {
      bounds: this.map.getBounds(),
      types: ['lodging']
    };

    this.places.nearbySearch(search, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.clearResults();
        this.clearMarkers();
        // Create a marker for each hotel found, and
        // assign a letter of the alphabetic to each marker icon.
        for (var i = 0; i < results.length; i++) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
          var markerIcon = this.MARKER_PATH + markerLetter + '.png';
          // Use marker animation to drop the icons incrementally on the map.
          this.markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          this.markers[i].placeResult = results[i];
          google.maps.event.addListener(this.markers[i], 'click', () => this.showInfoWindow(this.markers[i]));
          setTimeout(this.dropMarker(i), i * 100);
          this.addResult(results[i], i);
        }
      }
    });
  }

  setAutocompleteCountry() {
    var country = (<HTMLInputElement>document.getElementById('country')).value
    if (country == 'all') {
      this.autocomplete.setComponentRestrictions({ 'country': [] });
      this.map.setCenter({ lat: 15, lng: 0 });
      this.map.setZoom(2);
    } else {
      this.autocomplete.setComponentRestrictions({ 'country': country });
      this.map.setCenter(this.countries[country].center);
      this.map.setZoom(this.countries[country].zoom);
    }
    this.clearResults();
    this.clearMarkers();
  }

  dropMarker(i) {
    return function () {
      this.markers[i].setMap(this.map);
    };
  }

  addResult(result, i) {
    let markers = this.markers;
    var results = document.getElementById('results');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    var markerIcon = this.MARKER_PATH + markerLetter + '.png';

    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function () {
      google.maps.event.trigger(markers[i], 'click');
    };

    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  }


  clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  showInfoWindow(marker) {
    this.places.getDetails({ placeId: marker.placeResult.place_id },
      function (place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        this.infoWindow.open(this.map, marker);
        this.buildIWContent(place);
      });
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i]) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }
}