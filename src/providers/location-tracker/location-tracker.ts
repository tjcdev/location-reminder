import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public mapMarkers: any[] = [];

  constructor(public zone: NgZone, private backgroundGeolocation : BackgroundGeolocation, private geolocation: Geolocation) {

  }

  setMapMarkers(input) {
      this.mapMarkers = input;
  }

  startTracking() {
      //Background Tracking
      let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 10,
        debug: true,
        interval: 2000
      };

      this.backgroundGeolocation.configure(config).subscribe((location) => {

          //Run update inside of Angular's zone
          this.zone.run(() => {
              this.lat = location.latitude;
              this.lng = location.longitude;
          });
      }, (err) => {
            console.log(err);
      });

      //Turn ON the background-geolocation system.
      this.backgroundGeolocation.start();

      //Foreground Tracking
      let options = {
          frequency: 3000,
          enableHighAccuracy: true
      };

      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

          for(let i=0; i < this.mapMarkers.length; i++) {
              if(this.getDistanceFromLatLonInKm(this.mapMarkers[i].lat(), this.mapMarkers[i].lng(), position.coords.latitude, position.coords.longitude)) {
                console.log("aloha aloha");
              }
          }

          //Run update inside of Angular's zone
          this.zone.run(() => {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
          });

      });
  }


  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  stopTracking() {
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
  }

}
