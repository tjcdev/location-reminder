import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { NativeStorage } from '@ionic-native/native-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapMarkers: any[] = [];
  notifications: any[] = [];
  public tracking: boolean = false;

  constructor(public navCtrl: NavController, public locationTracker: LocationTrackerProvider, public nativeStorage: NativeStorage, public localNotifications: LocalNotifications) {

  }

  ionViewDidLoad() {
      //this.locationTracker.startTracking();
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
    //this.stop();

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
    });

    //Add marker to the array of markers
    this.mapMarkers.push(marker.position);
    this.locationTracker.setMapMarkers(this.mapMarkers);

    //Save it to the devices internal storage
    this.nativeStorage.setItem('mapMarkers', JSON.stringify(this.mapMarkers));

    this.nativeStorage.getItem('mapMarkers').then(function (json) {
        console.log("Stored" + json);
    });

    let content = "<h4>Information</h4>";

    this.addInfoWindow(marker, content);

    //this.start();
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  toggleTracking() {
    if (this.tracking) {
      console.log("stop tracking");
      this.stop();
      this.tracking = false;
    } else {
      console.log("start tracking");
      this.start();
      this.tracking = true;
    }
  }

  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}
