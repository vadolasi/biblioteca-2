import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { BackendService } from "../backend.service";
import { GoogleLivrosService } from "../google-livros.service";
import { RouterModule } from "@angular/router";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-comentarios",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./comentarios.component.html",
  styleUrl: "./comentarios.component.css"
})
export class ComentariosComponent implements OnInit {
  carregando = true;
  carregandoComentarios = false;
  livro: {
    id: string;
    titulo: string;
    autor: string;
    capa: string;
  } | null = null;
  comentarios: {
    id: string;
    nome: string;
    comentario: string;
  }[] = [];
  usuario: {
    nome: string;
  } | null = JSON.parse(localStorage.getItem("usuario") ?? "null");

  comentario = new FormControl("", { updateOn: "blur", validators: [Validators.required] });

  constructor(
    private googleLivrosApi: GoogleLivrosService,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    console.log(this.comentarios);
    const livroId = window.location.pathname.split("/")[2];
    const res = this.googleLivrosApi.buscarLivro(livroId);

    res.subscribe({
      next: (data: any) => {
        const volumeInfo = data.volumeInfo;
        this.livro = {
          id: data.id,
          titulo: volumeInfo.title,
          autor: volumeInfo.authors?.join(", ") ?? "Autor desconhecido",
          capa: volumeInfo.imageLinks?.thumbnail ?? "",
        };
      },
      error: () => {
        alert("Erro ao buscar livro!");
      },
      complete: () => {
        const res = this.backendService.buscarComentarios(livroId);

        res.subscribe({
          next: (data: any) => {
            this.comentarios = data.map((comentario: any) => {
              return {
                id: comentario.id,
                nome: comentario.usuario.nome,
                comentario: comentario.conteudo
              };
            });
          },
          error: () => {
            alert("Erro ao buscar comentários!");
          },
          complete: () => {
            this.carregando = false;
          }
        });
      }
    });
  }

  async comentar() {
    const livroId = window.location.pathname.split("/")[2];
    this.carregandoComentarios = true;
    const res = this.backendService.cadastrarComentario(
      livroId,
      this.comentario.value!
    );

    res.subscribe({
      next: (data: any) => {
        this.comentarios.push({
          id: data.id,
          nome: this.usuario!.nome,
          comentario: this.comentario.value!
        });
        this.comentario.setValue("");
      },
      error: () => {
        alert("Erro ao cadastrar comentário!");
      },
      complete: () => {
        this.carregandoComentarios = false;
      }
    });
  }
}
