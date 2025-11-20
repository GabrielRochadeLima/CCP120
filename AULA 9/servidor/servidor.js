require("colors");

// 1️⃣ MÓDULOS ESSENCIAIS
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");

// 2️⃣ INICIALIZAÇÃO DO EXPRESS
const app = express();

// 3️⃣ MIDDLEWARES E CONFIGURAÇÕES
// Serve arquivos estáticos (CSS, HTML, JS) da pasta 'public' que está dentro de /servidor
app.use(express.static(path.join(__dirname, "public")));

// Permite ao Express ler dados enviados por formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura o EJS e a pasta onde estão as views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 4️⃣ CONEXÃO COM O MONGODB ATLAS
const DB_URI = "mongodb+srv://gabrielrochadelima:Grl%4030103010@cluster0.u4m7q63.mongodb.net/?appName=Cluster0";
const DB_NAME = "blog_posts_db";
let db;

MongoClient.connect(DB_URI)
  .then((client) => {
    db = client.db(DB_NAME);
    console.log("✅ MongoDB Atlas conectado com sucesso! Banco:".green, DB_NAME);

    // Inicia o servidor apenas após a conexão
    const server = http.createServer(app);
    server.listen(80, () => {
      console.log("🚀 Servidor rodando na porta 80".rainbow);
      console.log("🌐 Acesse: http://localhost/blog");
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao MongoDB Atlas:", err);
    process.exit(1);
  });

// 5️⃣ FUNÇÕES DE ACESSO AO BANCO
const getPosts = async () => {
  const postsCollection = db.collection("posts");
  return postsCollection.find({}).sort({ _id: -1 }).toArray();
};

const addPost = async (postData) => {
  const postsCollection = db.collection("posts");
  const result = await postsCollection.insertOne(postData);
  return result.acknowledged;
};

// 6️⃣ ROTAS

// Rota inicial → redireciona para o blog
app.get("/", (req, res) => res.redirect("/blog"));

// Página principal do blog → lista todos os posts
app.get("/blog", async (req, res) => {
  try {
    const posts = await getPosts();
    res.render("blog", { posts, error: null, query: req.query });
  } catch (e) {
    console.error("❌ Erro ao carregar /blog:", e);
    res.render("blog", { posts: [], error: "Erro ao carregar posts.", query: req.query });
  }
});

// Página de cadastro de novo post
app.get("/cadastrar_post", (req, res) => {
  res.render("cadastrar_post");
});

// Função auxiliar de renderização segura
function renderSafe(res, view, data, status = 200) {
  res.status(status).render(view, data, (err, html) => {
    if (err) {
      console.error(`Erro ao renderizar "${view}":`, err);
      return res.status(500).send(`Erro ao renderizar a view "${view}".`);
    }
    return res.send(html);
  });
}

// Cadastro de novo post
app.post("/cadastrar_post", async (req, res) => {
  try {
    console.log("📩 Recebendo POST:", req.body);
    const { titulo, resumo, conteudo } = req.body;

    // Validação
    if (!titulo || !resumo || !conteudo) {
      return res.status(400).render("resposta_post", {
        status: "erro",
        titulo_msg: "⚠️ Campos obrigatórios!",
        mensagem: "Preencha título, resumo e conteúdo.",
        post: null,
      });
    }

    const postData = {
      titulo: titulo.trim(),
      resumo: resumo.trim(),
      conteudo: conteudo.trim(),
      dataCriacao: new Date(),
    };

    const success = await addPost(postData);

    if (!success) {
      return res.status(500).render("resposta_post", {
        status: "erro",
        titulo_msg: "❌ Falha no cadastro!",
        mensagem: "Erro ao salvar o post no MongoDB.",
        post: null,
      });
    }

    // Redireciona para o blog
    const base = `${req.protocol}://${req.headers.host}`;
    const destino = `${base}/blog?ok=1`;
    console.log(`[✅ POST] Salvo com sucesso. Redirecionando para ${destino}`);
    return res.redirect(303, destino);
  } catch (err) {
    console.error("💥 Erro no POST /cadastrar_post:", err);
    return res.status(500).send("Erro interno no servidor.");
  }
});

// Middleware de log simples
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.originalUrl}`);
  next();
});
