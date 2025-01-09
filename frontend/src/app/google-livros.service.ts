import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GoogleLivrosService {
  constructor(private http: HttpClient) {}

  pesquisarLivros(query: string) {
    return this.http.get(
      "https://www.googleapis.com/books/v1/volumes",
      { params: { q: query, key: "AIzaSyCr_8r4jM0JCvDvH73n7VZDGL__5GUMehA" } }
    );
  }

  buscarLivro(id: string) {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { params: { key: "AIzaSyCr_8r4jM0JCvDvH73n7VZDGL__5GUMehA" } }
    );
  }
}
