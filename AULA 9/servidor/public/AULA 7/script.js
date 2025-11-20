let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


ctx.beginPath();

ctx.lineWidth = 2;
ctx.fillStyle = 'blue';
ctx.strokeStyle = 'blue';
ctx.fillRect(0, 0, 60, 60);
ctx.strokeRect(0, 0, 50, 50);

ctx.lineWidth = 2;
ctx.fillStyle = 'red';
ctx.strokeStyle = '';
ctx.fillRect(340, 0, 60, 60);
ctx.strokeRect(0, 0, 50, 50);


ctx.lineWidth = 2;
ctx.fillStyle = 'red';
ctx.strokeStyle = '';
ctx.fillRect(350, 0, 50, 50);
ctx.strokeRect(0, 0, 50, 50);

ctx.lineWidth = 2;
ctx.fillStyle = 'aqua';
ctx.strokeStyle = '';
ctx.fillRect(0, 162.5 , 35, 75);

ctx.lineWidth = 2;
ctx.fillStyle = 'aqua';
ctx.strokeStyle = '';
ctx.fillRect(365, 175, 50, 50);

ctx.lineWidth = 2;
ctx.fillStyle = 'yellow';
ctx.strokeStyle = '';
ctx.fillRect(0, 320, 40, 40);

ctx.lineWidth = 2;
ctx.fillStyle = 'yellow';
ctx.strokeStyle = '';
ctx.fillRect(0, 360, 40, 40);

ctx.lineWidth = 2;
ctx.fillStyle = 'yellow';
ctx.strokeStyle = '';
ctx.fillRect(40, 360, 40, 40);


ctx.lineWidth = 2;
ctx.fillStyle = 'black';
ctx.strokeStyle = '';
ctx.fillRect(360, 320, 40, 40);

ctx.lineWidth = 2;
ctx.fillStyle = 'black';
ctx.strokeStyle = '';
ctx.fillRect(320, 360, 40, 40);

ctx.lineWidth = 2;
ctx.fillStyle = 'black';
ctx.strokeStyle = '';
ctx.fillRect(360, 350, 40, 50);


ctx.beginPath();
ctx.fillStyle = '#90EE90';
ctx.lineTo(0, 200);
ctx.lineTo(400, 200);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = '#90EE90';
ctx.stroke();

ctx.beginPath();
ctx.fillStyle = 'red';
ctx.lineTo(350, 50);
ctx.lineTo(200, 200);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = 'red';
ctx.stroke();

ctx.beginPath();
ctx.fillStyle = 'blue';
ctx.lineTo(50, 50);
ctx.lineTo(200, 200);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = 'blue';
ctx.stroke();

ctx.closePath();

ctx.beginPath();
ctx.fillStyle = 'grey';
ctx.lineTo(200, 350);
ctx.lineTo(200, 200);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = 'grey';
ctx.stroke();

ctx.lineWidth = 2;
ctx.fillStyle = 'red';
ctx.strokeStyle = '';
ctx.fillRect(150, 200, 50, 50);


ctx.beginPath();
ctx.arc(200, 150, 20, 0, 2 * Math.PI);
ctx.strokeStyle = 'blue';
ctx.lineWidth = 3;
ctx.stroke();
ctx.fillStyle = 'aqua';
ctx.fill();

ctx.beginPath();
ctx.arc(100, 280, 20, 0, 2 * Math.PI);
ctx.strokeStyle = 'green';
ctx.lineWidth = 3;
ctx.stroke();
ctx.fillStyle = 'yellow';
ctx.fill();



ctx.beginPath();
ctx.arc(280, 280, 20, 0, 2 * Math.PI);
ctx.strokeStyle = 'gren';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = 'yellow';
ctx.fill();

ctx.beginPath();
ctx.arc(200, 400, 50, 1 * Math.PI, 2 * Math.PI);
ctx.strokeStyle = '#47C237';
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = 'aqua';
ctx.fill();

ctx.beginPath();
ctx.arc(200, 200, 80, Math.PI, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(200, 400, 95, Math.PI, Math.PI + Math.PI / 2);
ctx.stroke();

ctx.beginPath();
ctx.arc(200, 400, 75, Math.PI + Math.PI / 2, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(200, 200, 105, Math.PI, Math.PI + Math.PI / 4);
ctx.stroke();

ctx.beginPath();
ctx.arc(200, 200, 105, 2 * Math.PI - Math.PI / 4, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = 'black';
ctx.font = "25px Arial"
ctx.textAlign = "center";
ctx.fillText("Canvas",200,75);
ctx.closePath();


let canvas2 = document.getElementById('canvas2');
canvas2.width = 400;
canvas2.height = 400;
let ctx2 = canvas2.getContext('2d');

// chão
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = 'gray';
ctx2.fillRect(0, 300, 400, 100);
ctx2.closePath();

// tronco 1
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#81491f';
ctx2.fillRect(50, 250, 25, 50);
ctx2.closePath();

// folha 1
ctx2.beginPath();
ctx2.lineWidth = 1;
ctx2.fillStyle = 'green';
ctx2.arc(62.5, 235, 25, 0, 2 * Math.PI);
ctx2.fill();
ctx2.closePath();

// tronco 2
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#81491f';
ctx2.fillRect(350, 300, 25, 50);
ctx2.closePath();

// folha 2
ctx2.beginPath();
ctx2.lineWidth = 1;
ctx2.fillStyle = 'green';
ctx2.arc(362.5, 285, 25, 0, 2 * Math.PI);
ctx2.fill();
ctx2.closePath();

// sol
ctx2.beginPath();
ctx2.lineWidth = 1;
ctx2.fillStyle = 'yellow';
ctx2.arc(300, 100, 37.5, 0, 2 * Math.PI);
ctx2.fill();
ctx2.closePath();

// casa
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#81491f';
ctx2.fillRect(150, 200, 100, 100);
ctx2.closePath();

// porta
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#5f4525';
ctx2.fillRect(190, 250, 20, 50);
ctx2.closePath();

// janela esquerda
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#61bbfb';
ctx2.fillRect(157.5, 215, 32.5, 32.5);
ctx2.closePath();

// janela direita
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#61bbfb';
ctx2.fillRect(210, 215, 32.5, 32.5);
ctx2.closePath();

// telhado
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#ec6e52';
ctx2.moveTo(150, 200);
ctx2.lineTo(200, 150);
ctx2.lineTo(250, 200);
ctx2.fill();
ctx2.closePath();

// rio 1
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#598cfa';
ctx2.fillRect(0, 300, 50, 100);
ctx2.closePath();

// rio 2
ctx2.beginPath();
ctx2.lineWidth = 1;
ctx2.fillStyle = '#598cfa';
ctx2.arc(0, 300, 50, 1.5 * Math.PI, 2.5 * Math.PI);
ctx2.fill();
ctx2.closePath();

// rio 3
ctx2.beginPath();
ctx2.lineWidth = 2;
ctx2.fillStyle = '#598cfa';
ctx2.fillRect(0, 350, 150, 50);
ctx2.closePath();

// rio 4
ctx2.beginPath();
ctx2.lineWidth = 1;
ctx2.fillStyle = '#598cfa';
ctx2.arc(150, 400, 50, 1.5 * Math.PI, 2.5 * Math.PI);
ctx2.fill();
ctx2.closePath();

