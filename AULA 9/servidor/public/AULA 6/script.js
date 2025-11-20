
let entrada = prompt("Entre com os dados: ")
let entrada_int = parseInt(entrada)
let strinResultado = ""

let i =0;
while (entrada_int > 0){
    strinResultado = strinResultado + " " + String(entrada_int);
    entrada_int = entrada_int - 1;
}
window.alert(strinResultado);

window.alert("Seu nuemro é: " + entrada);