import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login-user/login.service'; // Ajusta la ruta según sea necesario

import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  constructor(private formBuilder: FormBuilder, private loginService: LoginService,private navCtrl: NavController) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  irAOtraPagina() {
    console.log("Navengando a la aplicacion ")
    this.navCtrl.navigateForward('/home');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const isAuthenticated = this.loginService.login(email, password);

      if (isAuthenticated) {
        console.log('Inicio de sesión exitoso');
        this.irAOtraPagina();
        this.errorMessage = ''; 
      } else {
        this.errorMessage = 'Credenciales incorrectas';
        console.log(this.errorMessage);
      }
    }
  }

}

