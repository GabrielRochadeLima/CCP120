var http = require('http');
var express = require('express');
var colors = require('colors');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);

console.log('Servidor rodando 3...'.rainbow);

app.get('/', function (requisicao, resposta){
resposta.redirect('cadastro.html')
})

app.get('/inicio', function (requisicao, resposta){
var nome = requisicao.query.info;
console.log(nome);
})

app.get('/inicio', function (requisicao, resposta){
var email = requisicao.query.info;
console.log(email);
})
app.get('/inicio', function (requisicao, resposta){
var senha = requisicao.query.info;
console.log(senha);
})

app.post('/inicio', function (requisicao, resposta){
var email = requisicao.body.data;
console.log(email);
})

app.get('/cadastrar',function (requisicao, resposta){
var nome = requisicao.query.nome;
var email = requisicao.query.email;
var senha = requisicao.query.senha;


resposta.render('resposta', {nome, email, senha})
});

app.get('/logar',function (requisicao, resposta){
var email = requisicao.query.email;
var senha = requisicao.query.senha;

resposta.render('resposta_login', {email, senha})
})
