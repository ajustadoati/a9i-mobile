import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Provider } from 'src/app/models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiUrl = 'https://ajustadoati.com:9000/ajustadoati/proveedor/categoria/'; 

  constructor(private http: HttpClient) { }

  getProvidersByCategory(category: string): Observable<Provider[]> {
    const trimmedCategory = category.trim(); 
    return this.http.get<any[]>(this.apiUrl+trimmedCategory).pipe(
      map((data: any[]) => {
        console.log('API Response:', data); 
        return data.map(item => Provider.fromJson(item.usuario));
      })
    );
  }
}
