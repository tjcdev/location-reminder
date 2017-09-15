import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapMarkers: any[] = [];

  constructor(public navCtrl: NavController, public locationTracker: LocationTrackerProvider) {
  }

  ionViewDidLoad() {
      this.locationTracker.startTracking();
      this.loadMap();
  }

  loadMap() {
    let latLng = new google.maps.LatLng(37.3302, -122.0277);

    let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }



    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker() {
    this.stop();

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
    });

    //Add marker to the array of markers
    this.mapMarkers.push(marker.position);
    this.locationTracker.setMapMarkers(this.mapMarkers);

    let content = "<h4>Information</h4>";

    this.addInfoWindow(marker, content);

    this.start();
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}
