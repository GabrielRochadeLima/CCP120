// servidor_dispensa.js
require("colors");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// Configuração Express
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuração MongoDB
const DB_URI = "mongodb+srv://gabrielrochadelima:Grl%4030103010@cluster0.u4m7q63.mongodb.net/?appName=Cluster0";
const DB_NAME = "dispensa_db";
let db;

MongoClient.connect(DB_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("✅ MongoDB conectado:", DB_NAME.green);
    const server = http.createServer(app);
    server.listen(80, () => console.log("🚀 Servidor rodando na porta 80".rainbow));
  })
  .catch(err => console.error("❌ Erro ao conectar:", err));

// Helper
const produtosCol = () => db.collection("produtos");

// Rota principal
app.get("/", async (req, res) => {
  try {
    const produtos = await produtosCol().find({}).sort({ nome: 1 }).toArray();
    res.render("index", { produtos, ok: req.query.ok });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar os produtos.");
  }
});

// Rota para adicionar produto
app.post("/add", async (req, res) => {
  try {
    const { nome, tipo, quantidade, vencimento } = req.body;
    if (!nome || !tipo || !quantidade || !vencimento) return res.redirect("/?ok=campos");
    await produtosCol().insertOne({
      nome,
      tipo: tipo === "1" ? "Refrigerado" : "Não Refrigerado",
      quantidade: parseInt(quantidade, 10),
      vencimento,
      dataCadastro: new Date()
    });
    res.redirect("/?ok=add");
  } catch (err) {
    console.error(err);
    res.redirect("/?ok=erro");
  }
});

// Rota para remover produto
app.post("/remove/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await produtosCol().deleteOne({ _id: id });
    res.redirect("/?ok=removido");
  } catch (err) {
    console.error(err);
    res.redirect("/?ok=erro");
  }
});
