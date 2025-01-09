import { Component } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { BackendService } from "../backend.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css"
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl("", { updateOn: "blur", validators: [Validators.required] }),
    senha: new FormControl("", { updateOn: "blur", validators: [Validators.required] }),
  });
  carregando = false;

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {}

  onSubmit() {
    const { email, senha } = this.loginForm.value;

    this.carregando = true;
    const res = this.backendService.login(email!, senha!);

    res.subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: () => {
        alert("Erro ao realizar login!");
      }
    });
  }
}
