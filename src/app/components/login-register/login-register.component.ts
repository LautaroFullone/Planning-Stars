import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginUser } from 'src/app/models/login-user';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  userToLogIn = new LoginUser(); //usuario que intenta loguearsae
  userLogged = new User(); //usuario que se logueo

  loginForm = new FormGroup({
    login_email: new FormControl('', Validators.required),
    login_password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  get login_email() { return this.loginForm.get('login_email').value; }
  get login_password() { return this.loginForm.get('login_password').value; }

  registerForm = new FormGroup({
    register_name: new FormControl('', Validators.required),
    register_email: new FormControl('', Validators.required),
    register_password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  get register_name() { return this.registerForm.get('register_name').value; }
  get register_email() { return this.registerForm.get('register_email').value; }
  get register_password() { return this.registerForm.get('register_password').value; }

  constructor(private authService: AuthService, 
              private router: Router,
              private render: Renderer2,
              private toast: NgToastService) { }

  ngOnInit(): void {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    this.render.listen(signUpButton, "click", () => {
      this.render.addClass(container, "right-panel-active");
    })

    this.render.listen(signInButton, "click", () => {
      this.render.removeClass(container, "right-panel-active");
    })
  }

  loginUser(isOldUser: Boolean = true) {
    
    if(isOldUser){
      this.userToLogIn.email = this.login_email;
      this.userToLogIn.password = this.login_password;
    }else{
      this.userToLogIn.email = this.register_email;
      this.userToLogIn.password = this.register_password;
    }
    
    this.authService.login(this.userToLogIn).subscribe((response) => {

      if(this.authService.token) {
        this.userLogged = this.authService.getUser();
        //this.router.navigateByUrl('/products');
        let redirectUrl = this.authService.getRedirectUrl();

        if (redirectUrl != '')
          this.router.navigateByUrl(redirectUrl);
        else
          this.router.navigateByUrl('/user/login');
      }
      this.toast.success({ detail: "LOGIN SUCCESS", 
                           summary: "It's good to see you here.", 
                           position: 'br', duration: 6000 })
    },
    (apiError) => {
      this.toast.error({ detail: apiError.error.message, 
                         summary: apiError.error.errors[0],
                         position: 'br', duration: 6000 })
    });
  }

  registerUser(){    
    this.authService.register(this.register_name, 
                              this.register_email, 
                              this.register_password).subscribe((response) => {

    //calling again to login method telling that the user is new
    this.loginUser(false);
    this.toast.success({ detail: "REGISTER SUCCESS",
                         summary: "Welcome to the jungle.",
                         position: 'br', duration: 6000 })
    },
    (apiError) => {
      this.toast.error({ detail: apiError.error.message,
                         summary: apiError.error.errors[0],
                         position: 'br', duration: 6000 })
    });
  }
  

}
