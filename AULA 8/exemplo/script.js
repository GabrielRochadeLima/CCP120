let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let quadrado1 = {
    x: -30,
    y: 0,
    altura: 30,
    largura: 30,
    cor: "blue"
};

let quadrado2 = {
    x: canvas.width,
    y: canvas.height-30,
    altura: 30,
    largura: 30,
    cor: "red"
};

function desenhar(){
    //limpa o canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // desenha o primeiro quadrado
    ctx.fillStyle = quadrado1.cor;
    ctx.fillRect(quadrado1.x, quadrado1.y, quadrado1.largura,
        quadrado1.altura);
    //atualiza a posicao em x
    quadrado1.x = quadrado1.x + 1;

    // desenha o segundo quadrado
    ctx.fillStyle = quadrado2.cor;
    ctx.fillRect(quadrado2.x, quadrado2.y, quadrado2.largura,
        quadrado2.altura);
    //atualiza a posicao em x
    quadrado2.x = quadrado2.x - 1;

    requestAnimationFrame(desenhar);
}

desenhar();