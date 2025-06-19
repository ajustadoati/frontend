import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.baseUrl+'/api/users';

  constructor(private http: HttpClient) {}

  getUsersByCategory(categoryId:number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/'+categoryId+'/category');
  }
}
