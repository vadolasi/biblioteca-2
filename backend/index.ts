import express from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import session from "express-session";
import { books } from "@googleapis/books";

const booksApi = books("v1");

const prisma = new PrismaClient();

const app = express();
// @ts-ignore
app.use(session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
        where: {
            email,
        },
    });

    if (!usuario) {
        res.status(404).send("Usuário não encontrado");
        return;
    }

    if (await compare(senha, usuario.senha)) {
        res.status(401).send("Senha incorreta");
        return;
    }

    req.session.usuario = usuario;

    res.json(usuario);
});

app.post("/cadastrar", async (req, res) => {
    const {
        email,
        senha,
        nome
    } = req.body as {
        email: string;
        senha: string,
        nome: string
    };

    let usuario = await prisma.usuario.findUnique({
        where: {
            email,
        },
    })

    if (usuario) {
        res.status(400).send("Usuário já existe");
        return;
    }

    usuario = await prisma.usuario.create({
        data: {
            email,
            senha: await hash(senha, 10),
            nome,
        },
    });

    res.json(usuario);
});

app.get("/comentarios/:id", async (req, res) => {
    const livroId = req.params.id;

    const comentarios = await prisma.comentario.findMany({
        where: {
            livroId,
        },
        include: {
            usuario: true,
        },
    });

    res.json(comentarios);
})

app.post("/comentarios", async (req, res) => {
    const { conteudo, livroId } = req.body as {
        conteudo: string;
        livroId: string;
    };

    const usuario = req.session.usuario;

    if (!usuario) {
        res.status(401).send("Não autenticado");
        return;
    }

    const livro = await prisma.livro.findUnique({
        where: {
            id: livroId,
        },
    });

    if (!livro) {
        const livro = await booksApi.volumes.get({
            volumeId: livroId,
        })

        if (!livro) {
            res.status(404).send("Livro não encontrado");
            return;
        }

        await prisma.livro.create({
            data: { id: livroId },
        });
    }

    const comentario = await prisma.comentario.create({
        data: {
            conteudo,
            usuarioId: usuario.id,
            livroId,
        },
    });

    res.json(comentario);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
