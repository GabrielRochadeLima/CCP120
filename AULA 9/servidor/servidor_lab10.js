require("colors");

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

/* ====== STATIC + PARSERS + VIEWS ====== */
// public DENTRO de servidor/
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ====== CONEXÃO COM MONGODB ====== */
const DB_URI = "mongodb+srv://gabrielrochadelima:Grl%4030103010@cluster0.u4m7q63.mongodb.net/?appName=Cluster0";
const DB_NAME = "blog_posts_db";
let db;

MongoClient.connect(DB_URI)
  .then((client) => {
    db = client.db(DB_NAME);
    console.log("✅ MongoDB Atlas conectado:", DB_NAME.green);

    const server = http.createServer(app);
    server.listen(80, () => {
      console.log("🚀 Servidor rodando na porta 80".rainbow);
      console.log("🌐 Acesse: http://localhost/cars");
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no Mongo:", err);
    process.exit(1);
  });

/* ====== HELPERS ====== */
const usersCol = () => db.collection("usuarios");
const carsCol  = () => db.collection("carros");

/* ====== ROTAS BÁSICAS ====== */
app.get("/", (req, res) => res.redirect("/cars"));

/* ---------- Usuários ---------- */
// Página de cadastro (CREATE)
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  try {
    const { nome, login, senha } = req.body;
    if (!nome || !login || !senha)
      return res.render("register", { error: "Preencha todos os campos." });

    const exists = await usersCol().findOne({ login });
    if (exists)
      return res.render("register", { error: "Login já existe." });

    await usersCol().insertOne({ nome, login, senha }); // sem hash para simplicidade
    res.redirect("/login");
  } catch (e) {
    console.error(e);
    res.render("register", { error: "Erro ao cadastrar usuário." });
  }
});

// Página de login (READ)
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;
    const user = await usersCol().findOne({ login, senha });
    if (!user)
      return res.render("login", { error: "Login ou senha inválidos." });
    res.redirect("/admin/cars");
  } catch (e) {
    console.error(e);
    res.render("login", { error: "Erro ao logar." });
  }
});

/* ---------- Carros (Loja Pública) ---------- */
// Listagem de carros (READ)
app.get("/cars", async (req, res) => {
  try {
    const carros = await carsCol().find({}).sort({ marca: 1, modelo: 1 }).toArray();
    res.render("cars", { carros, ok: req.query.ok });
  } catch (e) {
    console.error(e);
    res.render("cars", { carros: [], ok: null });
  }
});

// Vender carro (DECREMENTAR estoque)
app.post("/cars/:id/sell", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const car = await carsCol().findOne({ _id: id });
    if (!car) return res.redirect("/cars");

    if ((car.qtde_disponivel || 0) <= 0)
      return res.redirect("/cars?ok=esgotado");

    await carsCol().updateOne(
      { _id: id, qtde_disponivel: { $gt: 0 } },
      { $inc: { qtde_disponivel: -1 } }
    );

    res.redirect("/cars?ok=vendido");
  } catch (e) {
    console.error(e);
    res.redirect("/cars");
  }
});

/* ---------- ADMIN CRUD ---------- */
// Listagem de carros (READ)
app.get("/admin/cars", async (req, res) => {
  try {
    const carros = await carsCol().find({}).sort({ marca: 1, modelo: 1 }).toArray();
    res.render("admin_cars", { carros, ok: req.query.ok });
  } catch (e) {
    console.error(e);
    res.render("admin_cars", { carros: [], ok: null });
  }
});

// Criar carro (CREATE)
app.post("/admin/cars/new", async (req, res) => {
  try {
    const { marca, modelo, ano, qtde_disponivel } = req.body;
    if (!marca || !modelo || !ano || qtde_disponivel === undefined)
      return res.redirect("/admin/cars?ok=campos");

    await carsCol().insertOne({
      marca,
      modelo,
      ano: parseInt(ano, 10),
      qtde_disponivel: parseInt(qtde_disponivel, 10) || 0,
    });

    res.redirect("/admin/cars?ok=created");
  } catch (e) {
    console.error(e);
    res.redirect("/admin/cars");
  }
});

// Atualizar carro (UPDATE)
app.post("/admin/cars/:id/update", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { marca, modelo, ano, qtde_disponivel } = req.body;
    await carsCol().updateOne(
      { _id: id },
      {
        $set: {
          marca,
          modelo,
          ano: parseInt(ano, 10),
          qtde_disponivel: parseInt(qtde_disponivel, 10) || 0,
        },
      }
    );
    res.redirect("/admin/cars?ok=updated");
  } catch (e) {
    console.error(e);
    res.redirect("/admin/cars");
  }
});

// Deletar carro (DELETE)
app.post("/admin/cars/:id/delete", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await carsCol().deleteOne({ _id: id });
    res.redirect("/admin/cars?ok=deleted");
  } catch (e) {
    console.error(e);
    res.redirect("/admin/cars");
  }
});

/* ---------- Diagnóstico (opcional) ---------- */
app.get("/health/db", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.send("✅ MongoDB conectado com sucesso!");
  } catch (e) {
    console.error(e);
    res.status(500).send("❌ Erro ao conectar no MongoDB.");
  }
});
