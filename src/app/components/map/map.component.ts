import { Component, ElementRef, OnInit, AfterViewInit, Renderer2, ViewChild, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', { static: true })
  mapElementRef!: ElementRef;
  googleMaps: any;
  map: any;
  marker: any;
  @Input() update = false;
  @Input() center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  @Output() location: EventEmitter<any> = new EventEmitter();
  mapListener: any;
  mapChange!: Subscription;

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
    ) { }

  ngOnInit() {
    console.log("Map component.")
  }

  async ngAfterViewInit() {
    await this.initMap();
    this.mapChange = this.maps.markerChange.subscribe(async(loc) => {
      if(loc?.lat) {
        console.log('loc: ', loc);
        console.log('maps: ', this.googleMaps);
        const googleMaps = this.googleMaps;
        const location = new googleMaps.LatLng(loc.lat, loc.lng);
        this.map.panTo(location);
        this.marker.setMap(null);
        await this.addMarker(location);
      }
    });    
  }

  async initMap() {
    try {
      if (!this.update) {
        const position = await this.locationService.getCurrentLocation();
  
        // Verificar que 'position' y 'coords' no sean nulos
        if (position && position.coords) {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } else {
          // Proporcionar valores por defecto si 'position' o 'coords' son nulos
          this.center = { lat: 28.649944693035188, lng: 77.23961776224988 };
        }
  
        await this.loadMap();
        this.getAddress(this.center.lat, this.center.lng);
      } else {
        await this.loadMap();
      }
    } catch (e) {
      console.log(e);
      // Proporcionar valores por defecto en caso de error
      this.center = { lat: 28.649944693035188, lng: 77.23961776224988 };
      console.log(this.center);
      await this.loadMap();
      this.getAddress(this.center.lat, this.center.lng);
    }
  }
  

  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 }
          ]
        }
      ];
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, 'SwiggyClone']
        },
        mapId: "DEMO_MAP_ID"
      });
      var mapType = new googleMaps.StyledMapType(style, { name: 'Grayscale' });
      this.map.mapTypes.set('SwiggyClone', mapType);
      this.map.setMapTypeId('SwiggyClone');
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch(e) {
      console.log(e);
    }
  }

  addMarker(location: any) {
    let googleMaps: any = this.googleMaps;
    const markerContent = document.createElement('div');
    markerContent.style.width = '50px';
    markerContent.style.height = '50px';

    const imageElement = document.createElement('img');
    imageElement.src = 'assets/icons/location-pin.png';
    imageElement.style.width = '100%';
    imageElement.style.height = '100%';

    markerContent.appendChild(imageElement);
    markerContent.classList.add('marker-content');

    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50), 
    };
    this.marker = new googleMaps.marker.AdvancedMarkerElement({
      position: location,
      map: this.map,
      content: markerContent,
      draggable: true
    });
    
    this.mapListener = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
      console.log('markerchange');
      this.getAddress(this.marker.position.lat(), this.marker.position.lng());
    });
  }

  async getAddress(lat: number, lng: number) {
    try {
      const result = await this.maps.getAddress(lat, lng);
      console.log(result);
      const loc = {
        title: result.address_components[0].short_name,
        address: result.formatted_address,
        lat,
        lng
      };
      console.log(loc);
      this.location.emit(loc);
    } catch(e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    if(this.mapListener) this.googleMaps.event.removeListener(this.mapListener);
    if(this.mapChange) this.mapChange.unsubscribe();
  }

}
