import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [CommonModule, GoogleMapsModule, FormsModule,  MapAdvancedMarker, MapInfoWindow],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export default class Main implements OnInit {

  constructor(private categoryService: CategoryService, private userService: UserService) { }

  categories: Category[] = [];
  users: any[] = [];
  selectedCategoryId: number = 0;
  selectedMarker?: { lat: number; lng: number; user?: any, content: any };
  mostrarModal = false;
  center: google.maps.LatLngLiteral = { lat: 10.4806, lng: -66.9036 }; // Ej: Caracas
  selectedUser: any = null;
  zoom = 12;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  
  //markers: google.maps.LatLngLiteral[] = [];
  markers: { lat: number, lng: number, user?: any, content:any }[] = [];
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };

  ngOnInit(): void {
    const parser = new DOMParser();
    const svgString = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF5733" stroke="#FFFFFF" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                    </svg>`;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
      
          this.markers.push({
            lat: this.center.lat,
            lng: this.center.lng,
            user: { name: 'Mi ubicación', phone: '1234', address: '1234' },
            content: parser.parseFromString(svgString, "image/svg+xml").documentElement
          });
          this.generateLocations(this.center.lat, this.center.lng, 5, 3).forEach(loc => {
            this.markers.push(loc);
          });
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
          // Puedes colocar una ubicación por defecto
          this.center = { lat: 10.4806, lng: -66.9036 }; // Ej: Caracas
        }
      );
    } else {
      console.warn('Geolocalización no soportada por el navegador');
      this.center = { lat: 10.4806, lng: -66.9036 };
    }
    this.loadCategories();
  }

  onMarkerClick(markerAdvance: MapAdvancedMarker, marker: any) {
    console.log("Agregando infoview", markerAdvance.advancedMarker);

      this.selectedMarker = marker;
      setTimeout(() => {
        this.infoWindow.open(markerAdvance); // Referencia directa al marcador
      });
    
    //this.infoWindow.open(marker, undefined,markerAdvance.advancedMarker.title);
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Login failed')
    }
    )
  }

  onCategorySelected(categoryId: number) {
    this.userService.getUsersByCategory(categoryId).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Usuarios por categoría:', this.users);

      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  abrirModal() {
    this.mostrarModal = true;
   
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  generateLocations(
    latBase: number,
    lngBase: number,
    cantidad: number,
    radioKm: number
    ): { lat: number; lng: number; user: any, content: any }[] {
  const ubicaciones: any[] = [];
    const parser = new DOMParser();
    const svgString = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF5733" stroke="#FFFFFF" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                    </svg>`;
  for (let i = 0; i < cantidad; i++) {
    const r = Math.random() * radioKm / 111; // 1 grado latitud ≈ 111 km
    const theta = Math.random() * 2 * Math.PI;

    const deltaLat = r * Math.cos(theta);
    const deltaLng = r * Math.sin(theta) / Math.cos((latBase * Math.PI) / 180);

    const nuevaLat = latBase + deltaLat;
    const nuevaLng = lngBase + deltaLng;

    ubicaciones.push({
      lat: nuevaLat,
      lng: nuevaLng,
      user: {
        name: `Usuario ${i + 1}`,
        phone: `0414-00000${i}`,
        email: `usuario${i + 1}@prueba.com`,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // rating entre 3 y 5
      },
      content: parser.parseFromString(svgString, "image/svg+xml").documentElement
      
    });
  }

  return ubicaciones;
}

}
