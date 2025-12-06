if (!localStorage.getItem("foco")) localStorage.setItem("foco", 0);
if (!localStorage.getItem("descanso")) localStorage.setItem("descanso", 0);
if (!localStorage.getItem("meta")) localStorage.setItem("meta", 0);
if (!localStorage.getItem("historico")) localStorage.setItem("historico", "[]");

let modo = "foco";
let tempoRestante = localStorage.getItem("foco") * 60;
let interval = null;

// Atualização do Timer
function atualizarTimer() {
  const min = Math.floor(tempoRestante / 60);
  const seg = tempoRestante % 60;

  document.getElementById("timer").textContent = `${String(min).padStart(
    2,
    "0"
  )}:${String(seg).padStart(2, "0")}`;
}

atualizarTimer();

document.getElementById("start").onclick = () => {
  if (interval !== null) return;

  interval = setInterval(() => {
    tempoRestante--;
    atualizarTimer();

    if (tempoRestante <= 0) {
      clearInterval(interval);
      interval = null;

      registrarHistorico(`Completou um ciclo de ${modo}`);

      if (modo === "foco") {
        modo = "descanso";
        tempoRestante = localStorage.getItem("descanso") * 60;
      } else {
        modo = "foco";
        tempoRestante = localStorage.getItem("foco") * 60;
      }

      atualizarTimer();
    }
  }, 1000);
};

document.getElementById("pause").onclick = () => {
  clearInterval(interval);
  interval = null;
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  interval = null;

  modo = "foco";
  tempoRestante = localStorage.getItem("foco") * 60;
  atualizarTimer();
};

// salvar config
document.getElementById("salvar").onclick = () => {
  const foco = Number(document.getElementById("foco").value);
  const descanso = Number(document.getElementById("descanso").value);
  const meta = Number(document.getElementById("meta").value);

  localStorage.setItem("foco", foco);
  localStorage.setItem("descanso", descanso);
  localStorage.setItem("meta", meta);

  modo = "foco";
  tempoRestante = foco * 60;
  atualizarTimer();

  alert("Configurações Salvas!");
};

//historico
function carregarHistorico() {
  const lista = document.getElementById("historico");
  lista.innerHTML = "";

  const dados = JSON.parse(localStorage.getItem("historico"));

  dados.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

carregarHistorico();

// adicionar historico
function registrarHistorico(texto) {
  const data = new Date().toLocaleString();
  const item = `${data} - ${texto}`;

  let historico = JSON.parse(localStorage.getItem("historico"));
  historico.push(item);

  localStorage.setItem("historico", JSON.stringify(historico));
  carregarHistorico();
}

document.getElementById("manual").onclick = () => {
  const minutos = prompt("Quantos minutos você estudou?");

  if (!minutos || isNaN(minutos)) return;

  registrarHistorico(`Estudou por ${minutos} minutos`);
};
