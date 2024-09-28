import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'https://ajustadoati.com:9000/ajustadoati/categoria/'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data: any[]) => data.map(item => Category.fromJson(item)))
    );
  }
}
