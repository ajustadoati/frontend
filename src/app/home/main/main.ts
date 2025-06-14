import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-main',
  imports: [CommonModule, GoogleMapsModule ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export default class Main implements OnInit {
  
  categorias = ['Electricista', 'Plomero', 'Técnico de PC', 'Otro'];

  mostrarModal = false;
  center: google.maps.LatLngLiteral = { lat: 10.4806, lng: -66.9036 }; // Ej: Caracas
  
  zoom = 12;
  markers: google.maps.LatLngLiteral[] = [];

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
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
  }

  abrirModal() {
    this.mostrarModal = true;
    this.markers = [
      { lat: 10.4806, lng: -66.9036 },
      { lat: 10.495, lng: -66.880 },
    ];
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
