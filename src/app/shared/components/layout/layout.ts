import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  imports: [Header,  Footer, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {

}
