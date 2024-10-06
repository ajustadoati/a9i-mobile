import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Lista de usuarios simulados
  private users = [
    { email: 'test@example.com', password: 'password123' }, // Usuario de ejemplo
    { email: 'user@example.com', password: 'mypassword' },   // Otro usuario de ejemplo
    { email: 'eduardobarrio27@gmail.com', password: 'Hello-world' }
  ];

  constructor() {}

  // Método para verificar el usuario y la contraseña
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    return user !== undefined; // Retorna true si el usuario es encontrado
  }
}


