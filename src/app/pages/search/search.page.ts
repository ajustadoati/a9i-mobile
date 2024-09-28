import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { OrderSearch } from 'src/app/models/orderSearch.model';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  categories: Category[] = [];
  product: any;
  selectedCategory: string | undefined;
  order: any = {}
  
  constructor(private categoryService: CategoryService, private providerService: ProviderService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  onSearch() {
    console.log('Término de búsqueda:', this.order.category);
    console.log('Categoría seleccionada:', this.order.product);
    this.providerService.getProvidersByCategory(this.order.category).subscribe(
      (providers) => {
        console.log('Proveedores encontrados:', providers);
      },
      (error) => {
        console.error('Error fetching providers:', error);
      }
    );
  }

}
