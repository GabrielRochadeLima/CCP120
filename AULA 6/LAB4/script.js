
const numeroSecreto = Math.floor(Math.random() * 10);
console.log(`Número secreto (iniciado): ${numeroSecreto}`);

const caixaNumero = document.getElementById("caixa");

function verificarNumeroDigitado() {
    const numeroDigitado = Number(caixaNumero.value);

    console.log(`Número secreto: ${numeroSecreto}`);
    console.log(`Número digitado: ${numeroDigitado}`);

    if (isNaN(numeroDigitado)) {
        alert("Por favor, digite um número válido.");
        caixaNumero.style.setProperty("background-color", "red");
        return;
    }

    if (numeroDigitado === numeroSecreto) {
        alert("Parabéns! Você acertou!");
        caixaNumero.style.setProperty("background-color", "lightgreen");
    } else {
        alert("Errado! Tente novamente.");
        caixaNumero.style.setProperty("background-color", "red");

        if (numeroDigitado > numeroSecreto) {
            alert("Dica: o número digitado é maior que o número secreto.");
        } else {
            alert("Dica: o número digitado é menor que o número secreto.");
        }
    }
}

// Adiciona o evento para quando o valor mudar no input
caixaNumero.addEventListener("change", verificarNumeroDigitado);
