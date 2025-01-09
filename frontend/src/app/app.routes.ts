import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CadastroComponent } from "./cadastro/cadastro.component";
import { LivrosComponent } from "./livros/livros.component";
import { ComentariosComponent } from "./comentarios/comentarios.component";

export const routes: Routes = [
  { path: "", component: LivrosComponent },
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "comentarios/:livroId", component: ComentariosComponent },
];
