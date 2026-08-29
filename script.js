import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://qwulavohnlhfnqlvfjhc.supabase.co';
const supabaseKey = 'sb_publishable_UbO01YTgK-QBFGib30RmhA_6wvnmzeM';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const { data: { session } } = await supabaseClient.auth.getSession();

if (!session) {
  window.location.replace('login.html');
} else {
  iniciarPainel();
}

async function iniciarPainel() {
const tabela = document.querySelector("#validity-table tbody");
tabela.innerHTML = '<tr><td colspan="5" class="empty-state">Carregando produtos...</td></tr>';

const { data: produtosComValidade, error } = await supabaseClient
  .from("produtos")
  .select("produto:nome, validade, quantidade")
  .order("validade", { ascending: true });

if (error) {
  tabela.innerHTML = '<tr><td colspan="5" class="empty-state">Não foi possível carregar os produtos.</td></tr>';
  console.error("Erro ao carregar produtos:", error.message);
  return;
}

const produtos = produtosComValidade ?? [];

/* Dados antigos mantidos temporariamente para referência durante a migração.
const dadosExemplo = [
  { "produto": "QUIBE SWIFT 360 G", "validade": "2026-08-02", "quantidade": 6 },
  { "produto": "PETIT GATEAU DOCE DE LEITE HAVANNA 160 G", "validade": "2026-08-09", "quantidade": 10 },
  { "produto": "BATATA PALHA EXTRA FINA PEPSICO 90G", "validade": "2026-08-10", "quantidade": 14 },
  { "produto": "FEIJAO CARIOCA SWIFT 1 KG", "validade": "2026-08-10", "quantidade": 10 },
  { "produto": "DORITOS DINAMITA PIMENTA PEPSICO 60 G", "validade": "2026-08-17", "quantidade": 2 },
  { "produto": "AMENDOIM CROKIS CHOCOL STA HELENA 45 G", "validade": "2026-08-18", "quantidade": 80 },
  { "produto": "TORCIDA PIMENTA MEXICANA PEPSICO 100 G", "validade": "2026-08-24", "quantidade": 5 },
  { "produto": "BATATA PALHA NA MESA TRAD PEPSICO 190 G", "validade": "2026-08-24", "quantidade": 1 },
  { "produto": "CHOCOLATE KIT KAT LEITE NESTLE 41,5 G", "validade": "2026-09-02", "quantidade": 1 },
  { "produto": "BANANA EMPANADA FRITA SWIFT 300G", "validade": "2026-09-07", "quantidade": 15 },
  { "produto": "FILE MIGNON SUINO APERITIV C BACON 350Q G", "validade": "2026-09-08", "quantidade": 3 },
  { "produto": "BIS OREO EXTRA MONDELEZ 45G", "validade": "2026-09-09", "quantidade": 56 },
  { "produto": "FEIJAO PRETO SWIT 1 KG", "validade": "2026-09-11", "quantidade": 5 },
  { "produto": "MOSTARDA AMARELA SWIFT 330 G", "validade": "2026-09-12", "quantidade": 21 },
  { "produto": "CHIPS PARMESAO FAIXA AZUL 35 G", "validade": "2026-09-12", "quantidade": 5 },
  { "produto": "BROCOLIS EMPANADO PRE FRITO SWIFT 300G", "validade": "2026-09-14", "quantidade": 15 },
  { "produto": "MOLHO DE ALHO CREMOSO SWIFT 210 G", "validade": "2026-09-15", "quantidade": 15 },
  { "produto": "MOLHO ALHO CREMOSO DEFUMADO SWIFT 210 ML", "validade": "2026-09-15", "quantidade": 15 },
  { "produto": "AMENDOA DEFUMADA BRASIL FRUTT 200 G", "validade": "2026-09-19", "quantidade": 10 },
  { "produto": "CONTRA FILE SWIFT KG", "validade": "2026-09-20", "quantidade": 7 },
  { "produto": "EMPANADA ESCAROLA COM QUEIJO SWIFT 240 G", "validade": "2026-09-20", "quantidade": 12 },
  { "produto": "BIFE ANCHO SWIFT BLACK KG", "validade": "2026-09-22", "quantidade": 7 },
  { "produto": "CHOCOLATE PRESTIGIO RECHEADO NESTLE 90 G", "validade": "2026-09-22", "quantidade": 14 },
  { "produto": "CHOCOLATE CHARGE RECHEADO NESTLE 90 G", "validade": "2026-09-22", "quantidade": 42 },
  { "produto": "COSTELA TRASEIRO FATIADA SWIFT KG", "validade": "2026-09-24", "quantidade": 5 },
  { "produto": "QUEIJO PARMESAO RALADO VIGOR 100 G", "validade": "2026-09-24", "quantidade": 30 },
  { "produto": "QUEIJO PARMES CILINDRO FAIXA AZUL 195 G", "validade": "2026-09-27", "quantidade": 2 },
  { "produto": "QUEIJO PARMES CILINDRO FAIXA AZUL 195 G", "validade": "2026-09-27", "quantidade": 29 },
  { "produto": "QUEIJO MUSSARELA BOLINHA SWIFT 300 G", "validade": "2026-09-27", "quantidade": 8 },
  { "produto": "AZEITONA VERDE SEM CAROCO PO TOZZI 120 G", "validade": "2026-09-27", "quantidade": 22 },
  { "produto": "PEITO DE PATO SWIFT 480 G", "validade": "2026-09-30", "quantidade": 1 },
  { "produto": "BARRA YOPRO CHOCOLATE NUTRATA 55 G", "validade": "2026-09-30", "quantidade": 23 },
  { "produto": "CHIPS PARMES CEBOL SALSA FAIXA AZUL 35 G", "validade": "2026-09-30", "quantidade": 5 },
  { "produto": "BIS BRANCO MONDELEZ 100,8G", "validade": "2026-10-06", "quantidade": 31 },
  { "produto": "FILE DE TRUTA DA PATAGONIA 600 G", "validade": "2026-10-07", "quantidade": 30 },
  { "produto": "JERKED SUINO SEARA 400 G", "validade": "2026-10-08", "quantidade": 30 },
  { "produto": "FEIJAO CARIOCA SWIFT 1 KG", "validade": "2026-10-08", "quantidade": 10 },
  { "produto": "FEIJAO PRETO SWIT 1 KG", "validade": "2026-10-09", "quantidade": 1 },
  { "produto": "HAMBURGUER GRAN RESERVA SWIFT 400 G", "validade": "2026-10-10", "quantidade": 20 },
  { "produto": "MILHO TORR MOST MEL BRASIL FRUTT 160 G", "validade": "2026-10-10", "quantidade": 20 },
  { "produto": "HEINEKEN KEG 5 LITROS", "validade": "2026-10-16", "quantidade": 12 },
  { "produto": "AMENDOIM CROKIS CARAMELO STA HELENA 45 G", "validade": "2026-10-16", "quantidade": 80 },
  { "produto": "TRIDENT MENTA MONDELEZ 8 G", "validade": "2026-10-17", "quantidade": 230 },
  { "produto": "VIEIRA SWIFT 200 G", "validade": "2026-10-18", "quantidade": 7 },
  { "produto": "COCO RALADO UMID ADOC DA TERRINHA 100 G", "validade": "2026-10-20", "quantidade": 15 },
  { "produto": "PE DE MOLEQUE SANTA HELENA 225 G", "validade": "2026-10-20", "quantidade": 16 }
]; */

function formatarData(data) {
	return new Intl.DateTimeFormat("pt-BR").format(new Date(`${data}T00:00:00`));
}

function obterDiasRestantes(validade) {
	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);

	const dataValidade = new Date(`${validade}T00:00:00`);
  return Math.ceil((dataValidade - hoje) / 86400000);
}

function obterStatus(diasRestantes) {

	if (diasRestantes < 0) {
		return { texto: "Vencido", classe: "danger" };
	}

	if (diasRestantes <= 30) {
		return { texto: "A vencer", classe: "warning" };
	}

	return { texto: "Em dia", classe: "success" };
}

function formatarDiasRestantes(diasRestantes) {
  if (diasRestantes < 0) {
    return ` há ${Math.abs(diasRestantes)} dias`;
  }

  if (diasRestantes === 0) {
    return "Vence hoje";
  }

  return `${diasRestantes} dias`;
}

function preencherTabelaValidade(filtro = "todos") {
	const tabela = document.querySelector("#validity-table tbody");
  tabela.replaceChildren();

  const produtosFiltrados = produtosComValidade.filter(({ validade }) => {
    if (filtro === "todos") {
      return true;
    }

    return obterStatus(obterDiasRestantes(validade)).classe === filtro;
  });

  if (produtosFiltrados.length === 0) {
    const linhaVazia = document.createElement("tr");
    const celulaVazia = document.createElement("td");
    celulaVazia.colSpan = 5;
    celulaVazia.className = "empty-state";
    celulaVazia.textContent = "Nenhum produto encontrado neste filtro.";
    linhaVazia.appendChild(celulaVazia);
    tabela.appendChild(linhaVazia);
    return;
  }

	produtosFiltrados.forEach(({ produto, validade, quantidade }) => {
    const diasRestantes = obterDiasRestantes(validade);
    const status = obterStatus(diasRestantes);
		const linha = document.createElement("tr");
    const statusCelula = document.createElement("td");
    const statusTexto = document.createElement("span");

    const criarCelula = (valor, classe = "") => {
      const celula = document.createElement("td");
      celula.className = classe;
      celula.textContent = valor ?? "";
      return celula;
    };

    statusCelula.className = "status-cell";
    statusTexto.className = status.classe;
    statusTexto.textContent = status.texto;
    statusCelula.appendChild(statusTexto);

    linha.append(
      criarCelula(produto, "product-name"),
      criarCelula(formatarData(validade)),
      criarCelula(quantidade, "quantity-cell"),
      criarCelula(formatarDiasRestantes(diasRestantes), "days-cell"),
      statusCelula
    );

		tabela.appendChild(linha);
	});
}

const filtroValidade = document.querySelector("#validity-filter");

filtroValidade.addEventListener("change", (evento) => {
  preencherTabelaValidade(evento.target.value);
});

preencherTabelaValidade(filtroValidade.value);

const btnSair = document.getElementById('btnSair');

if (btnSair) {
  btnSair.addEventListener('click', async () => {
    btnSair.disabled = true;

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error('Erro ao sair:', error);
        btnSair.disabled = false;
        return;
    }

    window.location.href = 'login.html';
  });
}
}