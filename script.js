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

function obterMesChave(data) {
  const dataValidade = new Date(`${data}T00:00:00`);
  const ano = dataValidade.getFullYear();
  const mes = String(dataValidade.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

function formatarMesFiltro(valorMes) {
  if (!valorMes || valorMes === 'todos') {
    return 'Todos';
  }

  const [ano, mes] = valorMes.split('-');
  const data = new Date(Number(ano), Number(mes) - 1, 1);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
}

function popularFiltroMes() {
  const filtroMesValidade = document.querySelector('#validity-month-filter');

  if (!filtroMesValidade) {
    return;
  }

  const mesesUnicos = [...new Set((produtosComValidade ?? []).map(({ validade }) => obterMesChave(validade)))].sort();

  filtroMesValidade.innerHTML = '<option value="todos">Todos</option>';

  mesesUnicos.forEach((mes) => {
    const option = document.createElement('option');
    option.value = mes;
    option.textContent = formatarMesFiltro(mes);
    filtroMesValidade.appendChild(option);
  });
}

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

function preencherTabelaValidade(filtroStatus = "todos", filtroMes = "todos") {
	const tabela = document.querySelector("#validity-table tbody");
  tabela.replaceChildren();

  const produtosFiltrados = produtosComValidade.filter(({ validade }) => {
    const statusCorresponde = filtroStatus === "todos" || obterStatus(obterDiasRestantes(validade)).classe === filtroStatus;
    const mesCorresponde = filtroMes === "todos" || obterMesChave(validade) === filtroMes;

    return statusCorresponde && mesCorresponde;
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
const filtroMesValidade = document.querySelector("#validity-month-filter");

popularFiltroMes();

filtroValidade.addEventListener("change", (evento) => {
  preencherTabelaValidade(evento.target.value, filtroMesValidade?.value ?? "todos");
});

if (filtroMesValidade) {
  filtroMesValidade.addEventListener("change", (evento) => {
    preencherTabelaValidade(filtroValidade?.value ?? "todos", evento.target.value);
  });
}

preencherTabelaValidade(filtroValidade.value, filtroMesValidade?.value ?? "todos");

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