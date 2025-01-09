import { TestBed } from "@angular/core/testing";

import { GoogleLivrosService } from "./google-livros.service";

describe("GoogleLivrosService", () => {
  let service: GoogleLivrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleLivrosService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
