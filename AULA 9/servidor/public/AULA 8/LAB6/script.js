const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const largura = canvas.width;
const altura = canvas.height;

const img = new Image();
img.src = 'imagem.png'; // caminho correto, pois a imagem está na mesma pasta do html e do js

const tamanho = 50;
let mouseX = largura / 2;
let mouseY = altura / 2;

document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

img.onload = () => {
  requestAnimationFrame(desenhar);
};

function desenhar() {
  ctx.clearRect(0, 0, largura, altura);

  let novoX = mouseX - tamanho / 2;
  let novoY = mouseY - tamanho / 2;

  const x = Math.max(0, Math.min(largura - tamanho, novoX));
  const y = Math.max(0, Math.min(altura - tamanho, novoY));

  ctx.drawImage(img, x, y, tamanho, tamanho);

  requestAnimationFrame(desenhar);
}
