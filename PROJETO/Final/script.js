/* ========================================================================
   BLOCO 1 — CONFIGURAÇÃO DE IMAGENS (sprites)
   ======================================================================== */
const IMAGENS = {
  jogador:    'imagens/img_jogo/Personagem.png',
  fundo:      'imagens/img_jogo/Cenario.png',
  moeda:      'imagens/img_jogo/Moeda.png',
  obstaculo:  'imagens/img_jogo/Tiro inimigo.png',
  tiro:       'imagens/img_jogo/Tiro personagem.png'
};


/* ========================================================================
   BLOCO 2 — CANVAS + AJUSTE HiDPI
   ======================================================================== */
const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');

// Escala para telas de alta densidade (Retina)
function escalaDPI(){
  return (window.devicePixelRatio && window.devicePixelRatio > 0)
    ? Math.min(2, window.devicePixelRatio)
    : 1;
}

// Largura/altura do canvas em unidades CSS (compatíveis com setTransform)
function larguraCSS(){ return canvas.width  / escalaDPI(); }
function alturaCSS(){  return canvas.height / escalaDPI(); }

function ajustarCanvas(){
  const proporcao = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const largura = canvas.clientWidth || 800;
  const altura  = Math.round(largura * 0.5);

  canvas.style.width  = largura + 'px';
  canvas.style.height = altura  + 'px';
  canvas.width  = Math.round(largura * proporcao);
  canvas.height = Math.round(altura  * proporcao);
  ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);

  // Atualiza área de saída (barra verde na direita)
  areaSaida.largura = 20;
  areaSaida.altura  = alturaCSS();
  areaSaida.x = larguraCSS() - areaSaida.largura;
  areaSaida.y = 0;
}
addEventListener('load', ajustarCanvas);
addEventListener('resize', ajustarCanvas);


/* ========================================================================
   BLOCO 3 — FUNÇÕES AUXILIARES
   ======================================================================== */
const limitar   = (valor, min, max) => Math.max(min, Math.min(max, valor));
const aleatorio = (min, max) => min + Math.random() * (max - min);


/* ========================================================================
   BLOCO 4 — CONTROLE (apenas teclado)
   ======================================================================== */
const teclas = new Set();

addEventListener('keydown', (e)=>{
  const bloqueadas = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyP','KeyR','Space'];
  if (bloqueadas.includes(e.code) || e.key === ' ') e.preventDefault();

  // Disparo imediato com a barra de espaço
  if (e.code === 'Space' || e.key === ' ') {
    if (estado === ESTADOS.JOGANDO) disparar();
    return;
  }
  teclas.add(e.code);
});
addEventListener('keyup', (e)=> teclas.delete(e.code));


/* ========================================================================
   BLOCO 5 — ESTADOS DO JOGO E HUD
   ======================================================================== */
const ESTADOS = { MENU:'MENU', JOGANDO:'JOGANDO', PAUSADO:'PAUSADO', TRANSICAO:'TRANSICAO', FIM:'FIM' };
let estado = ESTADOS.MENU;

// HUD
const txtFase   = document.getElementById('fase');
const txtVidas  = document.getElementById('vidas');
const txtPontos = document.getElementById('pontos');
const txtMoedas = document.getElementById('moedas');
const barraProgresso = document.getElementById('progress');

// Botões HUD
document.getElementById('btnPause').onclick = ()=> alternarPausa();
document.getElementById('btnReset').onclick = ()=> reiniciarJogo(true);


/* ========================================================================
   BLOCO 6 — OBJETOS E VARIÁVEIS DO JOGO
   ======================================================================== */
const jogador = { x:50, y:300, largura:35, altura:35, velocidade:180, invulneravel:false, tempoInv:0 };
const areaSaida = { x:780, y:0, largura:20, altura:400, cor:'#16a34a' };

let obstaculos = [];
let moedas = [];
let fase = 1, vidas = 3, pontuacao = 0;
let moedasNecessarias = 0, moedasColetadas = 0;

// Tiro
let tiros = [];
let recargaTiro = 0;
const TEMPO_RECARGA   = 0.20;
const VELOCIDADE_TIRO = 520;
const LARGURA_TIRO    = 25;
const ALTURA_TIRO     = 23;

// Loop fixo
let ultimoFrame = 0, acumulador = 0;
const passo = 1/60;

// Transição de fase
let tempoTransicao = 3;
let contadorTransicao = 0;


/* ========================================================================
   BLOCO 7 — CARREGAMENTO DE IMAGENS
   ======================================================================== */
function carregarImagem(caminho){
  return new Promise((ok, erro)=>{
    const img = new Image();
    img.onload  = ()=> ok(img);
    img.onerror = ()=> erro(new Error(`Erro ao carregar: ${caminho}`));
    img.src = caminho;
  });
}

const imagens = { jogador:null, fundo:null, moeda:null, obstaculo:null, tiro:null };

(async function iniciar(){
  try {
    [imagens.jogador, imagens.fundo, imagens.moeda, imagens.obstaculo, imagens.tiro] = await Promise.all([
      carregarImagem(IMAGENS.jogador),
      carregarImagem(IMAGENS.fundo),
      carregarImagem(IMAGENS.moeda),
      carregarImagem(IMAGENS.obstaculo),
      carregarImagem(IMAGENS.tiro)
    ]);
  } catch(e){ console.error(e); }

  ajustarCanvas();
  reiniciarJogo(false);
  requestAnimationFrame(loopPrincipal);
})();


/* ========================================================================
   BLOCO 8 — FLUXO DE JOGO (controle de estados)
   ======================================================================== */
function reiniciarJogo(total){
  if(total){ fase = 1; vidas = 3; pontuacao = 0; }
  moedasColetadas = 0;
  jogador.x = 50; jogador.y = 300;
  jogador.invulneravel = false; jogador.tempoInv = 0;
  tiros = []; recargaTiro = 0;

  gerarObstaculos();
  gerarMoedas();

  estado = ESTADOS.TRANSICAO;
  contadorTransicao = tempoTransicao;
}

function proximaFase(){
  fase++;
  pontuacao += 100;
  moedasColetadas = 0;
  jogador.x = 50; jogador.y = 300;
  tiros = []; recargaTiro = 0;

  gerarObstaculos();
  gerarMoedas();

  estado = ESTADOS.TRANSICAO;
  contadorTransicao = tempoTransicao;
}

function fimDeJogo(){
  estado = ESTADOS.FIM;
  salvarRecorde();
}

function alternarPausa(){
  if(estado === ESTADOS.JOGANDO) estado = ESTADOS.PAUSADO;
  else if(estado === ESTADOS.PAUSADO) estado = ESTADOS.JOGANDO;
}


/* ========================================================================
   BLOCO 9 — GERADORES DE MOEDAS E OBSTÁCULOS
   ======================================================================== */
function gerarMoedas(){
  moedas = [];
  moedasNecessarias = 3 + fase;
  const margem = 30;

  for(let i=0;i<moedasNecessarias;i++){
    const m = { x:0, y:0, largura:20, altura:20 };
    let tentativas = 0;
    do {
      m.x = aleatorio(margem, larguraCSS()-margem-m.largura);
      m.y = aleatorio(margem, alturaCSS()-margem-m.altura);
      tentativas++;
    } while(colisao(m, areaSaida) && tentativas<50);
    moedas.push(m);
  }
}

function gerarObstaculos(){
  obstaculos = [];
  const ZONA_SEGURA = 200;
  const quantidade = fase + 3;
  const base = (fase === 1) ? 120 : 180 + fase*40;

  for(let i=0;i<quantidade;i++){
    obstaculos.push({
      x: larguraCSS() + aleatorio(0, larguraCSS()*0.5) + ZONA_SEGURA,
      y: aleatorio(0, alturaCSS()-30),
      largura:30, altura:30, velocidade: base
    });
  }
}


/* ========================================================================
   BLOCO 10 — COLISÃO RETANGULAR (AABB)
   ======================================================================== */
function colisao(a,b){
  return a.x < b.x + b.largura && a.x + a.largura > b.x &&
         a.y < b.y + b.altura  && a.y + a.altura  > b.y;
}


/* ========================================================================
   BLOCO 11 — TIRO DO JOGADOR
   ======================================================================== */
function disparar(){
  if(recargaTiro > 0) return;
  recargaTiro = TEMPO_RECARGA;

  const xTiro = jogador.x + jogador.largura;
  const yTiro = jogador.y + jogador.altura/2 - ALTURA_TIRO/2;
  tiros.push({ x: xTiro, y: yTiro, largura: LARGURA_TIRO, altura: ALTURA_TIRO, velocidade: VELOCIDADE_TIRO });
}


/* ========================================================================
   BLOCO 12 — LOOP PRINCIPAL (GAME LOOP)
   ======================================================================== */
function loopPrincipal(agora){
  const delta = (agora - ultimoFrame)/1000 || 0;
  ultimoFrame = agora;
  acumulador += delta;

  // Atalhos
  if(teclas.has('KeyP')) { teclas.delete('KeyP'); alternarPausa(); }
  if(teclas.has('KeyR')) { teclas.delete('KeyR'); reiniciarJogo(true); }

  // Atualização com passo fixo
  while(acumulador >= passo){ atualizar(passo); acumulador -= passo; }

  // Desenho do frame
  desenhar();
  requestAnimationFrame(loopPrincipal);
}


/* ========================================================================
   BLOCO 13 — ATUALIZAÇÃO DE LÓGICA
   ======================================================================== */
function atualizar(dt){
  // Transição
  if(estado===ESTADOS.TRANSICAO){
    contadorTransicao -= dt;
    if(contadorTransicao <= 0) estado = ESTADOS.JOGANDO;
  }
  if(estado !== ESTADOS.JOGANDO){
    atualizarHUD();
    return;
  }

  // Cooldown do tiro
  if(recargaTiro > 0) recargaTiro = Math.max(0, recargaTiro - dt);

  // Movimento do jogador
  const vel = jogador.velocidade;
  if(teclas.has('ArrowUp'))    jogador.y -= vel*dt;
  if(teclas.has('ArrowDown'))  jogador.y += vel*dt;
  if(teclas.has('ArrowLeft'))  jogador.x -= vel*dt;
  if(teclas.has('ArrowRight')) jogador.x += vel*dt;

  // Limites do canvas
  jogador.x = limitar(jogador.x, 0, larguraCSS() - jogador.largura);
  jogador.y = limitar(jogador.y, 0, alturaCSS()  - jogador.altura);

  // Invulnerabilidade temporária
  if(jogador.invulneravel){
    jogador.tempoInv -= dt;
    if(jogador.tempoInv <= 0) jogador.invulneravel = false;
  }

  // Obstáculos: movimento e reciclagem
  for(const o of obstaculos){
    o.x -= o.velocidade*dt;
    if(o.x + o.largura < 0){
      o.x = larguraCSS() + aleatorio(0, larguraCSS()*0.5);
      o.y = aleatorio(0, alturaCSS()-o.altura);
    }
  }

  // Tiros: movimento e colisão com obstáculos
  for(let i=tiros.length-1;i>=0;i--){
    const t = tiros[i];
    t.x += t.velocidade*dt;
    if(t.x > larguraCSS() + 50){ tiros.splice(i,1); continue; }

    for(let j=obstaculos.length-1;j>=0;j--){
      const o = obstaculos[j];
      if(colisao(t, o)){
        tiros.splice(i,1);
        obstaculos.splice(j,1);
        pontuacao += 20;

        // repõe um obstáculo para manter a pressão
        const base = (fase===1) ? 120 : 180 + fase*40;
        obstaculos.push({
          x: larguraCSS() + aleatorio(0, larguraCSS()*0.8) + 200,
          y: aleatorio(0, alturaCSS()-30),
          largura:30, altura:30, velocidade: base
        });
        break;
      }
    }
  }

  // Coleta de moedas
  for(let i=moedas.length-1;i>=0;i--){
    const m = moedas[i];
    if(colisao(jogador, m)){
      moedas.splice(i,1);
      moedasColetadas++;
      pontuacao += 10;
    }
  }

  // Dano ao colidir com obstáculos
  for(const o of obstaculos){
    if(colisao(jogador, o) && !jogador.invulneravel){
      vidas--;
      jogador.invulneravel = true;
      jogador.tempoInv = 2;
      jogador.x = 50; jogador.y = 300;
      moedasColetadas = 0;
      tiros = [];
      gerarObstaculos(); gerarMoedas();
      if(vidas <= 0){ fimDeJogo(); break; }
      return;
    }
  }

  // Área de saída (passagem de fase)
  if(colisao(jogador, areaSaida)){
    if(moedasColetadas >= moedasNecessarias) proximaFase();
    else jogador.x = areaSaida.x - jogador.largura - 5;
  }

  atualizarHUD();
}


/* ========================================================================
   BLOCO 14 — DESENHO (RENDERIZAÇÃO NO CANVAS)
   ======================================================================== */
function desenhar(){
  ctx.clearRect(0, 0, larguraCSS(), alturaCSS());

  // Fundo em "cover" (sem distorcer)
  if(imagens.fundo && imagens.fundo.naturalWidth > 0){
    const cw = larguraCSS(), ch = alturaCSS();
    const iw = imagens.fundo.naturalWidth, ih = imagens.fundo.naturalHeight;
    const rCanvas = cw/ch, rImg = iw/ih;
    let sx, sy, sw, sh;
    if(rImg > rCanvas){ sh = ih; sw = ih*rCanvas; sx = (iw - sw)/2; sy = 0; }
    else { sw = iw; sh = iw/rCanvas; sx = 0; sy = (ih - sh)/2; }
    ctx.drawImage(imagens.fundo, sx, sy, sw, sh, 0, 0, cw, ch);
  } else {
    ctx.fillStyle = '#0c160e';
    ctx.fillRect(0,0,larguraCSS(),alturaCSS());
  }

  // Área de saída
  ctx.fillStyle = areaSaida.cor;
  ctx.fillRect(areaSaida.x, areaSaida.y, areaSaida.largura, areaSaida.altura);

  // Jogador (pisca quando invulnerável)
  const piscar = jogador.invulneravel ? Math.floor((jogador.tempoInv*10))%2===0 : true;
  if(piscar){
    if(imagens.jogador) ctx.drawImage(imagens.jogador, jogador.x, jogador.y, jogador.largura, jogador.altura);
    else { ctx.fillStyle = '#1d4ed8'; ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura); }
  }

  // Obstáculos
  for(const o of obstaculos){
    if(imagens.obstaculo) ctx.drawImage(imagens.obstaculo, o.x, o.y, o.largura, o.altura);
    else { ctx.fillStyle = '#ef4444'; ctx.fillRect(o.x, o.y, o.largura, o.altura); }
  }

  // Moedas
  for(const m of moedas){
    if(imagens.moeda) ctx.drawImage(imagens.moeda, m.x, m.y, m.largura, m.altura);
    else {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(m.x+m.largura/2, m.y+m.altura/2, m.largura/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Tiros
  for(const t of tiros){
    if(imagens.tiro) ctx.drawImage(imagens.tiro, t.x, t.y, t.largura, t.altura);
    else { ctx.fillStyle = '#27ff75'; ctx.fillRect(t.x, t.y, t.largura, t.altura); }
  }

  // Overlays de estado
  if(estado===ESTADOS.TRANSICAO)   desenharTela(`Fase ${fase} - começando em...`, Math.ceil(contadorTransicao));
  else if(estado===ESTADOS.MENU)   desenharTela('Jogo 2D com Fases', 'Aperte R para reiniciar');
  else if(estado===ESTADOS.PAUSADO) desenharTela('Pausado', 'Aperte P para continuar');
  else if(estado===ESTADOS.FIM)     desenharTela('Fim de jogo', `Pontuação: ${pontuacao} — Recorde: ${lerRecorde()}`);
}

function desenharTela(titulo, subtitulo){
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fillRect(0,0,larguraCSS(),alturaCSS());
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.font = '28px Arial';
  ctx.fillText(titulo, larguraCSS()/2, alturaCSS()/2 - 10);
  ctx.font = '48px Arial';
  ctx.fillText(subtitulo, larguraCSS()/2, alturaCSS()/2 + 38);
  ctx.textAlign = 'left';
  ctx.restore();
}


/* ========================================================================
   BLOCO 15 — HUD E RECORDE (localStorage)
   ======================================================================== */
function atualizarHUD(){
  txtFase.textContent   = `Fase: ${fase}`;
  txtVidas.textContent  = `Vidas: ${vidas}`;
  txtPontos.textContent = `Pontos: ${pontuacao}`;
  txtMoedas.textContent = `Moedas: ${moedasColetadas}/${moedasNecessarias}`;
  const progresso = moedasNecessarias
    ? Math.min(100, Math.round((moedasColetadas/moedasNecessarias)*100))
    : 0;
  barraProgresso.style.width = progresso + '%';
}

const CHAVE_RECORDE = 'Recorde';
function lerRecorde(){ return Number(localStorage.getItem(CHAVE_RECORDE) || 0); }
function salvarRecorde(){ if(pontuacao > lerRecorde()) localStorage.setItem(CHAVE_RECORDE, String(pontuacao)); }