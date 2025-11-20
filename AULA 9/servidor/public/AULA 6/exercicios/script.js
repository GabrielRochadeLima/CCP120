let totalSalario = 0;
let totalPessoas = 0;
let maiorIdade = 0;
let menorIdade = 200;
let mulheresAte5000 = 0;

while (true) {
  let idade = parseInt(prompt("Informe a idade (negativa para sair):"));
  if (idade < 0) break;

  let sexo = prompt("Informe o sexo (M/F):");
  let salario = parseFloat(prompt("Informe o salário:"));

  totalSalario += salario;
  totalPessoas++;

  if (idade > maiorIdade) 
    maiorIdade = idade;
  if (idade < menorIdade) 
    menorIdade = idade;

  if (sexo === "F" && salario <= 5000) {
    mulheresAte5000++;
  }
}

if (totalPessoas > 0) {
  console.log("Média de salário: R$ " + (totalSalario / totalPessoas));
  console.log("Maior idade: " + maiorIdade);
  console.log("Menor idade: " + menorIdade);
  console.log("Mulheres com salário até R$5000: " + mulheresAte5000);
} else {
  console.log("Nenhum dado foi inserido.");
}
