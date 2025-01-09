import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GoogleLivrosService } from "../google-livros.service";

@Component({
  selector: "app-livros",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./livros.component.html",
  styleUrl: "./livros.component.css"
})
export class LivrosComponent {
  pesquisa = new FormControl("");
  livros: {
    id: string;
    titulo: string;
    autor: string;
    capa: string;
  }[] = [];
  carregando = false;

  constructor(private googleLivrosApi: GoogleLivrosService) {}

  async pesquisar() {
    this.carregando = true;
    const res = this.googleLivrosApi.pesquisarLivros(this.pesquisa.value!);

    res.subscribe({
      next: (data: any) => {
        this.livros = data.items.map((item: any) => {
          const volumeInfo = item.volumeInfo;
          return {
            id: item.id,
            titulo: volumeInfo.title,
            autor: volumeInfo.authors?.join(", ") ?? "Autor desconhecido",
            capa: volumeInfo.imageLinks?.thumbnail ?? "",
          };
        });
      },
      error: () => {
        alert("Erro ao pesquisar livros!");
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }
}
