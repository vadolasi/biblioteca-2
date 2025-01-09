import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { BackendService } from "../backend.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./cadastro.component.html",
  styleUrl: "./cadastro.component.css"
})
export class CadastroComponent {
  cadastroForm = new FormGroup({
    email: new FormControl("", { updateOn: "blur" , validators: [Validators.required, Validators.email] }),
    nome: new FormControl("", { updateOn: "blur", validators: [Validators.required] }),
    senha: new FormControl("", { updateOn: "blur", validators: [Validators.required] }),
    confirmacaoSenha: new FormControl("", { updateOn: "blur", validators: [Validators.required] }),
  }, {
    validators: (formGroup) => {
      const senha = formGroup.get("senha")?.value;
      const confirmacaoSenha = formGroup.get("confirmacaoSenha")?.value;

      if (senha === confirmacaoSenha) {
        return null;
      }

      return {
        senhasDiferentes: true,
      };
    }
  });
  carregando = false;

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {}

  async onSubmit() {
    const { email, nome, senha } = this.cadastroForm.value;

    this.carregando = true;
    const res = this.backendService.cadastrar(
      email!,
      nome!,
      senha!
    );

    res.subscribe({
      next: () => {
        this.router.navigate(["/login"]);
      },
      error: () => {
        alert("Erro ao realizar cadastro!");
      }
    });
  }
}
