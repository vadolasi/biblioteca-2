import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BackendService {
  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    const res = this.http.post("/api/login", { email, senha });

    res.subscribe({
      next: (usuario) => {
        localStorage.setItem("usuario", JSON.stringify(usuario));
      }
    });

    return res;
  }

  cadastrar(email: string, nome: string, senha: string) {
    return this.http.post("/api/cadastrar", { email, nome, senha });
  }

  buscarComentarios(livroId: string) {
    return this.http.get(`/api/comentarios/${livroId}`);
  }

  cadastrarComentario(livroId: string, conteudo: string) {
    return this.http.post("/api/comentarios", { livroId, conteudo });
  }
}
