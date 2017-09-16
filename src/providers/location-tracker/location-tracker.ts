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
          frequency: 10000,
          enableHighAccuracy: true
      };

      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

          //Run update inside of Angular's zone
          this.zone.run(() => {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;

              for(let i=0; i < this.mapMarkers.length; i++) {
                  if(this.distance(this.mapMarkers[i].lat(), this.mapMarkers[i].lng(), position.coords.latitude, position.coords.longitude) < 20000) {
                    console.log("aloha aloha");
                  }
              }
          });

      });
  }



  distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p)/2 +
              c(lat1 * p) * c(lat2 * p) *
              (1 - c((lon2 - lon1) * p))/2;

      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  stopTracking() {
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
  }

}
