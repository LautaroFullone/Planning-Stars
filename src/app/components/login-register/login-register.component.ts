import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  constructor(private render: Renderer2) { }

  ngOnInit(): void {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    this.render.listen(signUpButton, "click",() => {
      console.log("signUpButton");
      //container.classList.add("right-panel-active");
      this.render.addClass(container,"right-panel-active");
    })

    this.render.listen(signInButton, "click",() => {
      console.log("signInButton");
      //container.classList.remove("right-panel-active");
      this.render.removeClass(container,"right-panel-active");
    })
    
  }
  

}
