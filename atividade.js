document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("novo")) {
        // É index.html: valida sessão e carrega lista
        if (!validaSessao()) {
            window.location.href = '../CRUD_ATIVIDADE/atividade.html'; // Ajuste o path se necessário
        } else {
            carregaItens();
        }
    } else {
        //  valida sessão e carrega para edit se ID na URL
        if (!validaSessao()) {
            window.location.href = '../CRUD_ATIVIDADE/atividade.html'; // Ajuste o path
        } else {
            carregaParaEdicao(); // Novo: carrega dados se editando
            document.getElementById("formAtividade").addEventListener("submit", function(e) {
                e.preventDefault();
                armazenar();
                window.location.href = "atividade.html";
            });
        }
    }
});

document.getElementById("novo")?.addEventListener("click", function() {
    window.location.href = "nova_atividade.html";
});

document.getElementById("criarSessao").onclick = function() {
    localStorage.setItem("sessao", "ok");
    alert("Sessão criada! Recarregue a página.");
};

function validaSessao() {
    return localStorage.getItem("sessao") ? true : false;
}

function carregaItens() {
    let lista = [];
    if (localStorage.getItem("listaAtividades")) {
        lista = JSON.parse(localStorage.getItem("listaAtividades"));
    }
    
    let html = "";
    if (lista.length > 0) {
        html += "<table>";
        html += "<tr>";
        html += "<th>#</th>";
        html += "<th>Título</th>";
        html += "<th>Descrição</th>";
        html += "<th>Categoria</th>";
        html += "<th>Data de Início</th>";
        html += "<th>Ações</th>";
        html += "</tr>";

        for (let i = 0; i < lista.length; i++) {
            // Mapeia valor curto para nome completo na exibição
            let nomeCategoria = getNomeCategoria(lista[i].categoria);
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + lista[i].titulo + "</td>";
            html += "<td>" + lista[i].descricao.substring(0, 50) + "...</td>"; // Resumo
            html += "<td>" + nomeCategoria + "</td>";
            html += "<td>" + new Date(lista[i].data_inicio).toLocaleString('pt-BR') + "</td>";
            html += "<td>";
            html += "<a href='nova_atividade.html?id=" + i + "' class='btn btn-edit'>Editar</a>";
            html += "<a href='javascript:excluir(" + i + ")' class='btn btn-delete'>Excluir</a>";
            html += "</td>";
            html += "</tr>";
        }
        html += "</table>";
    } else {
        html = "<p>Nenhuma atividade cadastrada.</p>";
    }
    
    document.getElementById("lista").innerHTML = html;
}

//  Função para carregar dados no form para edição 
function carregaParaEdicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id !== null) {
        let lista = JSON.parse(localStorage.getItem("listaAtividades"));
        if (lista && lista[id]) {
            let item = lista[id];
            document.getElementById("titulo").value = item.titulo;
            document.getElementById("descricao").value = item.descricao;
            document.getElementById("categoria").value = item.categoria;
            document.getElementById("data_inicio").value = item.data_inicio;
            document.getElementById("enviar").textContent = "Atualizar";
            // Armazena ID para update
            document.getElementById("formAtividade").dataset.id = id;
        }
    }
}

// Função auxiliar para mapear categoria (valor curto -> nome completo)
function getNomeCategoria(valor) {
    const map = {
        "Comunicacao": "Comunicação Verbal e Não Verbal",
        "HabilidadesSociais": "Habilidades Sociais e Emocionais",
        "Rotinas": "Rotinas Diárias e Autonomia",
        "AprendizagemSensorial": "Aprendizagem Sensorial e Motora",
        "Cognitiva": "Cognitiva e Acadêmica",
        "Outras": "Outras"
    };
    return map[valor] || valor;
}

function excluir(id) {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
        let listaAtividades = JSON.parse(localStorage.getItem("listaAtividades"));
        listaAtividades.splice(id, 1);
        localStorage.setItem("listaAtividades", JSON.stringify(listaAtividades));
        carregaItens(); // Recarrega sem reload total
    }
}

function armazenar() {
    let listaAtividades = JSON.parse(localStorage.getItem("listaAtividades")) || [];
    const form = document.getElementById("formAtividade");
    const idEdit = form.dataset.id; // Para update
    
    let obj = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value,
        data_inicio: document.getElementById("data_inicio").value
    };
    
    if (idEdit !== undefined) {
        // Update
        listaAtividades[idEdit] = obj;
        alert("Atividade atualizada!");
    } else {
        // Create
        listaAtividades.push(obj);
        alert("Atividade cadastrada!");
    }
    
    localStorage.setItem("listaAtividades", JSON.stringify(listaAtividades));
    // Limpa dataset para próximo create
    delete form.dataset.id;
}