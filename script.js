// ==========================================
// 1. CONFIGURAÇÃO DO FIREBASE E ÁUDIOS
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAtqYEdFzj3PTFv1kXhYr1BxicPeljCWAE",
    authDomain: "cabo-de-guerra-edu.firebaseapp.com",
    databaseURL: "https://cabo-de-guerra-edu-default-rtdb.firebaseio.com",
    projectId: "cabo-de-guerra-edu",
    storageBucket: "cabo-de-guerra-edu.firebasestorage.app",
    messagingSenderId: "990704724155",
    appId: "1:990704724155:web:d077969f11d2bb47f2619e"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const somTick = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const somPuxadaCorda = new Audio('https://actions.google.com/sounds/v1/sports/slide_whistle_to_drum.ogg');
const somVitoria = new Audio('https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg');
somVitoria.volume = 0.6;

// ==========================================
// 2. VARIÁVEIS GLOBAIS E QUESTÕES BASE
// ==========================================
const questoesBaseLocais = {
    "Matemática": {
        "Adição": {
            "Fácil": [
                { pergunta: "Quanto é 15 + 22?", alternativas: ["35", "37", "42", "27"], resposta: "37" },
                { pergunta: "Quanto é 8 + 7?", alternativas: ["14", "15", "16", "17"], resposta: "15" },
                { pergunta: "Quanto é 45 + 10?", alternativas: ["50", "55", "65", "40"], resposta: "55" },
                { pergunta: "Quanto é 21 + 14?", alternativas: ["35", "34", "36", "45"], resposta: "35" },
                { pergunta: "Quanto é 100 + 50?", alternativas: ["150", "10050", "105", "500"], resposta: "150" }
            ],
            "Média": [
                { pergunta: "Quanto é 145 + 258?", alternativas: ["393", "403", "383", "413"], resposta: "403" },
                { pergunta: "Quanto é 312 + 199?", alternativas: ["511", "501", "411", "521"], resposta: "511" },
                { pergunta: "Quanto é 450 + 375?", alternativas: ["815", "825", "725", "835"], resposta: "825" },
                { pergunta: "Quanto é 1050 + 230?", alternativas: ["1280", "1380", "1250", "1300"], resposta: "1280" },
                { pergunta: "Quanto é 678 + 322?", alternativas: ["990", "1000", "1100", "900"], resposta: "1000" }
            ],
            "Difícil": [
                { pergunta: "Quanto é 1450 + 2875?", alternativas: ["4225", "4325", "4125", "4425"], resposta: "4325" },
                { pergunta: "Quanto é 3891 + 4120?", alternativas: ["7911", "8011", "8111", "7811"], resposta: "8011" },
                { pergunta: "Quanto é 15600 + 8450?", alternativas: ["23050", "24050", "24150", "23150"], resposta: "24050" },
                { pergunta: "Quanto é 9999 + 1111?", alternativas: ["11110", "11010", "11100", "10110"], resposta: "11110" },
                { pergunta: "Quanto é 45678 + 12345?", alternativas: ["58023", "57923", "58123", "57023"], resposta: "58023" }
            ]
        },
        "Subtração": {
            "Fácil": [
                { pergunta: "Quanto é 20 - 8?", alternativas: ["10", "12", "14", "8"], resposta: "12" },
                { pergunta: "Quanto é 50 - 15?", alternativas: ["30", "35", "45", "40"], resposta: "35" },
                { pergunta: "Quanto é 100 - 25?", alternativas: ["65", "75", "85", "55"], resposta: "75" },
                { pergunta: "Quanto é 42 - 12?", alternativas: ["20", "30", "40", "28"], resposta: "30" },
                { pergunta: "Quanto é 80 - 40?", alternativas: ["20", "30", "40", "50"], resposta: "40" }
            ],
            "Média": [
                { pergunta: "Quanto é 150 - 68?", alternativas: ["82", "92", "72", "62"], resposta: "82" },
                { pergunta: "Quanto é 300 - 145?", alternativas: ["145", "155", "165", "135"], resposta: "155" },
                { pergunta: "Quanto é 512 - 256?", alternativas: ["256", "246", "266", "236"], resposta: "256" },
                { pergunta: "Quanto é 1000 - 347?", alternativas: ["653", "553", "753", "643"], resposta: "653" },
                { pergunta: "Quanto é 750 - 380?", alternativas: ["370", "360", "470", "460"], resposta: "370" }
            ],
            "Difícil": [
                { pergunta: "Quanto é 5200 - 1850?", alternativas: ["3350", "3250", "3450", "3150"], resposta: "3350" },
                { pergunta: "Quanto é 10000 - 4567?", alternativas: ["5433", "4433", "5533", "6433"], resposta: "5433" },
                { pergunta: "Quanto é 25400 - 9900?", alternativas: ["15500", "14500", "16500", "15400"], resposta: "15500" },
                { pergunta: "Quanto é 80500 - 22750?", alternativas: ["57750", "58750", "56750", "59750"], resposta: "57750" },
                { pergunta: "Quanto é 12345 - 6789?", alternativas: ["5556", "5656", "5456", "5756"], resposta: "5556" }
            ]
        },
        "Multiplicação": {
            "Fácil": [
                { pergunta: "Quanto é 7 x 8?", alternativas: ["54", "56", "64", "62"], resposta: "56" },
                { pergunta: "Quanto é 6 x 6?", alternativas: ["32", "36", "42", "26"], resposta: "36" },
                { pergunta: "Quanto é 5 x 9?", alternativas: ["40", "45", "50", "35"], resposta: "45" },
                { pergunta: "Quanto é 4 x 7?", alternativas: ["24", "28", "32", "21"], resposta: "28" },
                { pergunta: "Quanto é 3 x 12?", alternativas: ["30", "32", "36", "34"], resposta: "36" }
            ],
            "Média": [
                { pergunta: "Quanto é 15 x 12?", alternativas: ["160", "170", "180", "190"], resposta: "180" },
                { pergunta: "Quanto é 25 x 4?", alternativas: ["75", "100", "125", "150"], resposta: "100" },
                { pergunta: "Quanto é 14 x 14?", alternativas: ["186", "196", "206", "176"], resposta: "196" },
                { pergunta: "Quanto é 30 x 15?", alternativas: ["400", "450", "500", "350"], resposta: "450" },
                { pergunta: "Quanto é 18 x 9?", alternativas: ["152", "162", "172", "182"], resposta: "162" }
            ],
            "Difícil": [
                { pergunta: "Quanto é 120 x 15?", alternativas: ["1600", "1700", "1800", "1900"], resposta: "1800" },
                { pergunta: "Quanto é 34 x 28?", alternativas: ["932", "942", "952", "962"], resposta: "952" },
                { pergunta: "Quanto é 250 x 16?", alternativas: ["3800", "4000", "4200", "3600"], resposta: "4000" },
                { pergunta: "Quanto é 99 x 99?", alternativas: ["9801", "9901", "9701", "9991"], resposta: "9801" },
                { pergunta: "Quanto é 145 x 12?", alternativas: ["1720", "1740", "1760", "1780"], resposta: "1740" }
            ]
        },
        "Divisão": {
            "Fácil": [
                { pergunta: "Quanto é 20 / 4?", alternativas: ["4", "5", "6", "3"], resposta: "5" },
                { pergunta: "Quanto é 81 / 9?", alternativas: ["7", "8", "9", "10"], resposta: "9" },
                { pergunta: "Quanto é 50 / 2?", alternativas: ["20", "25", "30", "15"], resposta: "25" },
                { pergunta: "Quanto é 42 / 6?", alternativas: ["6", "7", "8", "9"], resposta: "7" },
                { pergunta: "Quanto é 100 / 10?", alternativas: ["1", "10", "100", "0"], resposta: "10" }
            ],
            "Média": [
                { pergunta: "Quanto é 144 / 12?", alternativas: ["10", "11", "12", "14"], resposta: "12" },
                { pergunta: "Quanto é 250 / 5?", alternativas: ["40", "50", "60", "70"], resposta: "50" },
                { pergunta: "Quanto é 360 / 6?", alternativas: ["50", "60", "70", "80"], resposta: "60" },
                { pergunta: "Quanto é 1000 / 8?", alternativas: ["120", "125", "130", "135"], resposta: "125" },
                { pergunta: "Quanto é 450 / 15?", alternativas: ["20", "30", "40", "50"], resposta: "30" }
            ],
            "Difícil": [
                { pergunta: "Quanto é 1024 / 8?", alternativas: ["128", "138", "118", "148"], resposta: "128" },
                { pergunta: "Quanto é 1250 / 25?", alternativas: ["40", "45", "50", "55"], resposta: "50" },
                { pergunta: "Quanto é 4320 / 12?", alternativas: ["340", "350", "360", "370"], resposta: "360" },
                { pergunta: "Quanto é 9801 / 99?", alternativas: ["89", "99", "109", "119"], resposta: "99" },
                { pergunta: "Quanto é 15625 / 25?", alternativas: ["525", "625", "725", "825"], resposta: "625" }
            ]
        },
        "Equação": {
            "Fácil": [
                { pergunta: "Qual o valor de x em: x + 5 = 12?", alternativas: ["5", "6", "7", "8"], resposta: "7" },
                { pergunta: "Qual o valor de x em: 2x = 10?", alternativas: ["2", "4", "5", "10"], resposta: "5" },
                { pergunta: "Qual o valor de x em: x - 4 = 10?", alternativas: ["6", "14", "10", "4"], resposta: "14" },
                { pergunta: "Qual o valor de x em: 3x = 21?", alternativas: ["6", "7", "8", "9"], resposta: "7" },
                { pergunta: "Qual o valor de x em: x / 2 = 8?", alternativas: ["4", "10", "16", "12"], resposta: "16" }
            ],
            "Média": [
                { pergunta: "Qual o valor de x em: 3x - 4 = 11?", alternativas: ["3", "4", "5", "6"], resposta: "5" },
                { pergunta: "Qual o valor de x em: 5x + 10 = 35?", alternativas: ["4", "5", "6", "7"], resposta: "5" },
                { pergunta: "Qual o valor de x em: 2x + 8 = 20?", alternativas: ["4", "6", "8", "10"], resposta: "6" },
                { pergunta: "Qual o valor de x em: 4x - 12 = 12?", alternativas: ["4", "6", "8", "10"], resposta: "6" },
                { pergunta: "Qual o valor de x em: x/3 + 5 = 10?", alternativas: ["10", "15", "20", "25"], resposta: "15" }
            ],
            "Difícil": [
                { pergunta: "Qual o valor de x em: 2(x + 3) = 14?", alternativas: ["2", "3", "4", "5"], resposta: "4" },
                { pergunta: "Qual o valor de x em: 4x - 5 = 2x + 9?", alternativas: ["5", "6", "7", "8"], resposta: "7" },
                { pergunta: "Qual o valor de x em: 3(x - 2) = x + 10?", alternativas: ["6", "7", "8", "9"], resposta: "8" },
                { pergunta: "Qual o valor de x em: 5x/2 - 4 = 11?", alternativas: ["4", "6", "8", "10"], resposta: "6" },
                { pergunta: "Qual o valor de x em: 7x - (2x + 5) = 20?", alternativas: ["4", "5", "6", "7"], resposta: "5" }
            ]
        }
    }
};

let bancoDeQuestoes = {}; 
let rawQuestoesNuvem = {}; 
let idQuestaoEmEdicao = null;

let codigoSalaAtual = null;
let meuNome = null;
let minhaEquipe = null;
let meuId = null; 
let isProfessor = false;
let questoesDaPartida = [];
let rodadaAtualLocal = 0;
let totalRodadas = 5; 
let tempoRestante = 15;
let intervaloTimer;
let totalJogadores = 0;
let jogadoresNaMinhaEquipe = 0; 
let historicoRodadas = []; 

// ELEMENTOS DO DOM E NAVEGAÇÃO
const roleScreen = document.getElementById('role-screen');
const studentScreen = document.getElementById('student-screen');
const setupScreen = document.getElementById('setup-screen');
const manageQuestionsScreen = document.getElementById('manage-questions-screen');
const addQuestionScreen = document.getElementById('add-question-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const gameScreen = document.getElementById('game-screen');

function mudarTela(telaAtiva) {
    roleScreen.classList.add('hidden');
    studentScreen.classList.add('hidden');
    setupScreen.classList.add('hidden');
    manageQuestionsScreen.classList.add('hidden');
    addQuestionScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    telaAtiva.classList.remove('hidden');
}

document.getElementById('btn-show-student').onclick = () => mudarTela(studentScreen);
document.getElementById('btn-show-teacher').onclick = () => mudarTela(setupScreen);
document.getElementById('btn-back-role-1').onclick = () => mudarTela(roleScreen);
document.getElementById('btn-back-role-2').onclick = () => mudarTela(roleScreen);

// ==========================================
// 3. SINCRONIZAÇÃO DO BANCO DE QUESTÕES (LOCAL + NUVEM)
// ==========================================
db.ref('questoes_comunidade').on('value', (snapshot) => {
    rawQuestoesNuvem = snapshot.val() || {};
    
    // 1. Carrega as questões originais que já vêm no código
    bancoDeQuestoes = JSON.parse(JSON.stringify(questoesBaseLocais)); 
    
    // 2. Mescla adicionando as questões da nuvem (se houver)
    Object.keys(rawQuestoesNuvem).forEach(id => {
        const q = rawQuestoesNuvem[id];
        if (!bancoDeQuestoes[q.disciplina]) bancoDeQuestoes[q.disciplina] = {};
        if (!bancoDeQuestoes[q.disciplina][q.assunto]) bancoDeQuestoes[q.disciplina][q.assunto] = {};
        if (!bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade]) bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade] = [];
        
        bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade].push(q);
    });
    
    carregarMenuConfiguracao();
    renderizarListaDeQuestoes();
});

// ==========================================
// 4. MENU DO PROFESSOR (CRIAR SALA)
// ==========================================
const selSubject = document.getElementById('sel-subject');
const selTopic = document.getElementById('sel-topic');
const selDifficulty = document.getElementById('sel-difficulty');
const selRounds = document.getElementById('sel-rounds');

function carregarMenuConfiguracao() {
    if (Object.keys(bancoDeQuestoes).length === 0) {
        selSubject.innerHTML = '<option value="">Banco vazio</option>';
        selTopic.innerHTML = '';
        selDifficulty.innerHTML = '';
        return;
    }
    popularSelect(selSubject, Object.keys(bancoDeQuestoes));
    atualizarTopicos(); 
}
function atualizarTopicos() {
    const subject = selSubject.value;
    if(bancoDeQuestoes[subject]) {
        popularSelect(selTopic, Object.keys(bancoDeQuestoes[subject]));
        atualizarDificuldades();
    }
}
function atualizarDificuldades() {
    const subject = selSubject.value;
    const topic = selTopic.value;
    if(bancoDeQuestoes[subject] && bancoDeQuestoes[subject][topic]) {
        popularSelect(selDifficulty, Object.keys(bancoDeQuestoes[subject][topic]));
    }
}
function popularSelect(el, opcoes) {
    el.innerHTML = '';
    opcoes.forEach(op => el.innerHTML += `<option value="${op}">${op}</option>`);
}

selSubject.addEventListener('change', atualizarTopicos);
selTopic.addEventListener('change', atualizarDificuldades);

// ==========================================
// 5. CRUD DE QUESTÕES (GERENCIAR, EDITAR, SALVAR, DELETAR)
// ==========================================
document.getElementById('btn-manage-questions').onclick = () => mudarTela(manageQuestionsScreen);
document.getElementById('btn-back-manage-to-setup').onclick = () => mudarTela(setupScreen);
document.getElementById('btn-back-to-manage').onclick = () => mudarTela(manageQuestionsScreen);

document.getElementById('btn-new-question').onclick = () => {
    idQuestaoEmEdicao = null;
    document.getElementById('modal-title-question').innerText = "➕ Nova Questão";
    limparFormularioQuestao();
    mudarTela(addQuestionScreen);
};

function limparFormularioQuestao() {
    document.getElementById('new-subject').value = "";
    document.getElementById('new-topic').value = "";
    document.getElementById('new-difficulty').value = "Fácil";
    document.getElementById('new-question').value = "";
    document.getElementById('new-alt-1').value = "";
    document.getElementById('new-alt-2').value = "";
    document.getElementById('new-alt-3').value = "";
    document.getElementById('new-alt-4').value = "";
}

// ----------------------------------------------------
// NOVIDADE: Organizando a lista em pastas expansíveis!
// ----------------------------------------------------
function renderizarListaDeQuestoes() {
    const container = document.getElementById('questions-list-container');
    container.innerHTML = '';
    
    if (Object.keys(rawQuestoesNuvem).length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; font-size: 16px;">Você ainda não adicionou nenhuma questão na nuvem.</p>';
        return;
    }

    // 1. Agrupar as questões
    const agrupado = {};
    Object.keys(rawQuestoesNuvem).forEach(id => {
        const q = rawQuestoesNuvem[id];
        if (!agrupado[q.disciplina]) agrupado[q.disciplina] = {};
        if (!agrupado[q.disciplina][q.assunto]) agrupado[q.disciplina][q.assunto] = {};
        if (!agrupado[q.disciplina][q.assunto][q.dificuldade]) agrupado[q.disciplina][q.assunto][q.dificuldade] = [];
        
        agrupado[q.disciplina][q.assunto][q.dificuldade].push({ id: id, ...q });
    });

    // 2. Gerar o visual em sanfona
    let html = '';
    for (const disc in agrupado) {
        html += `
        <details style="margin-bottom: 10px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dfe4ea; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <summary style="font-weight: bold; font-size: 18px; cursor: pointer; color: #2f3542; padding: 12px; outline: none;">📚 ${disc}</summary>
            <div style="padding: 0 12px 12px 12px;">`;
        
        for (const ass in agrupado[disc]) {
            html += `
            <details style="margin-bottom: 8px; background: white; border-radius: 6px; border: 1px solid #ccc;">
                <summary style="font-weight: bold; font-size: 16px; cursor: pointer; color: #007bff; padding: 10px; outline: none;">📑 ${ass}</summary>
                <div style="padding: 0 10px 10px 10px;">`;
            
            for (const dif in agrupado[disc][ass]) {
                let corDif = dif === "Fácil" ? "#2ed573" : (dif === "Média" ? "#ffa502" : "#ff4757");
                let iconeDif = dif === "Fácil" ? "🟢" : (dif === "Média" ? "🟡" : "🔴");
                
                html += `
                <details style="margin-bottom: 8px; background: #fafafa; border-radius: 6px; border-left: 4px solid ${corDif}; border: 1px solid #eee; border-left-width: 4px;">
                    <summary style="font-weight: bold; font-size: 14px; cursor: pointer; color: #57606f; padding: 8px; outline: none;">${iconeDif} ${dif}</summary>
                    <div style="padding: 10px; display: flex; flex-direction: column; gap: 10px;">`;
                
                agrupado[disc][ass][dif].forEach(q => {
                    html += `
                        <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #dfe4ea;">
                            <div style="font-size: 15px; color: #2f3542; margin-bottom: 10px;"><strong>Q:</strong> ${q.pergunta}</div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="editarQuestao('${q.id}')" style="background: #1e90ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;">✏️ Editar</button>
                                <button onclick="deletarQuestao('${q.id}')" style="background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;">🗑️ Excluir</button>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div></details>`;
            }
            html += `</div></details>`;
        }
        html += `</div></details>`;
    }
    
    container.innerHTML = html;
}

window.editarQuestao = function(id) {
    idQuestaoEmEdicao = id;
    const q = rawQuestoesNuvem[id];
    
    document.getElementById('modal-title-question').innerText = "✏️ Editar Questão";
    document.getElementById('new-subject').value = q.disciplina;
    document.getElementById('new-topic').value = q.assunto;
    document.getElementById('new-difficulty').value = q.dificuldade;
    document.getElementById('new-question').value = q.pergunta;
    document.getElementById('new-alt-1').value = q.alternativas[0];
    document.getElementById('new-alt-2').value = q.alternativas[1];
    document.getElementById('new-alt-3').value = q.alternativas[2];
    document.getElementById('new-alt-4').value = q.alternativas[3];
    
    const indexCorreta = q.alternativas.indexOf(q.resposta) + 1;
    document.getElementById('new-correct-alt').value = indexCorreta;
    
    mudarTela(addQuestionScreen);
};

window.deletarQuestao = function(id) {
    if (confirm("Tem certeza que deseja excluir esta questão permanentemente da nuvem?")) {
        db.ref('questoes_comunidade/' + id).remove();
    }
};

document.getElementById('btn-save-question').addEventListener('click', () => {
    const disc = document.getElementById('new-subject').value.trim();
    const assunto = document.getElementById('new-topic').value.trim();
    const dif = document.getElementById('new-difficulty').value;
    const perg = document.getElementById('new-question').value.trim();
    const alts = [
        document.getElementById('new-alt-1').value.trim(),
        document.getElementById('new-alt-2').value.trim(),
        document.getElementById('new-alt-3').value.trim(),
        document.getElementById('new-alt-4').value.trim()
    ];
    const indiceCorreta = parseInt(document.getElementById('new-correct-alt').value) - 1;

    if (!disc || !assunto || !perg || !alts[0] || !alts[1] || !alts[2] || !alts[3]) {
        return alert("Preencha todos os campos!");
    }

    const questaoData = {
        disciplina: disc,
        assunto: assunto,
        dificuldade: dif,
        pergunta: perg,
        alternativas: alts,
        resposta: alts[indiceCorreta]
    };

    if (idQuestaoEmEdicao) {
        db.ref('questoes_comunidade/' + idQuestaoEmEdicao).update(questaoData).then(() => {
            mudarTela(manageQuestionsScreen);
        });
    } else {
        db.ref('questoes_comunidade').push(questaoData).then(() => {
            mudarTela(manageQuestionsScreen);
        });
    }
});

// ==========================================
// 6. INICIAR SALA (PROFESSOR)
// ==========================================
document.getElementById('btn-create-room').addEventListener('click', () => {
    if (Object.keys(bancoDeQuestoes).length === 0) return alert("Crie pelo menos uma questão no banco antes de abrir a sala!");
    
    isProfessor = true;
    totalRodadas = parseInt(selRounds.value);
    historicoRodadas = []; 
    
    const poolDeQuestoes = bancoDeQuestoes[selSubject.value][selTopic.value][selDifficulty.value];
    if(!poolDeQuestoes || poolDeQuestoes.length === 0) {
        return alert("Não há questões nesta categoria.");
    }
    
    questoesDaPartida = [...poolDeQuestoes].sort(() => Math.random() - 0.5);
    codigoSalaAtual = Math.floor(100000 + Math.random() * 900000).toString();

    db.ref('salas/' + codigoSalaAtual).set({
        status: 'lobby',
        questoes: questoesDaPartida,
        totalRodadas: totalRodadas,
        posicaoCorda: 0,
        rodadaAtual: 0,
        vitoriasAzul: 0,
        vitoriasVermelha: 0,
        jogadores: { azul: {}, vermelha: {} },
        respostasRodada: { acertosAzul: 0, acertosVermelha: 0, respondidosAzul: 0, respondidosVermelha: 0 }
    }).then(() => {
        document.getElementById('display-room-code').innerText = codigoSalaAtual;
        document.getElementById('btn-start-multiplayer').classList.remove('hidden');
        document.getElementById('btn-choose-blue').style.display = 'none';
        document.getElementById('btn-choose-red').style.display = 'none';
        mudarTela(lobbyScreen);
        iniciarEscutaLobby(); 
        iniciarEscutaPartida(); 
    });
});

// ==========================================
// 7. LÓGICA DO ALUNO
// ==========================================
document.getElementById('btn-join-room').addEventListener('click', () => {
    const nomeInput = document.getElementById('input-student-name').value.trim();
    const codigoInput = document.getElementById('input-room-code').value.trim();
    if (!nomeInput || !codigoInput) return alert("Preencha nome e código!");

    db.ref('salas/' + codigoInput).once('value').then((snapshot) => {
        if (snapshot.exists() && snapshot.val().status === 'lobby') {
            isProfessor = false;
            meuNome = nomeInput;
            codigoSalaAtual = codigoInput;
            questoesDaPartida = snapshot.val().questoes;
            totalRodadas = snapshot.val().totalRodadas;
            document.getElementById('display-room-code').innerText = codigoSalaAtual;
            document.getElementById('btn-start-multiplayer').classList.add('hidden');
            mudarTela(lobbyScreen);
            iniciarEscutaLobby();
            iniciarEscutaPartida();
        } else {
            alert("Sala não encontrada ou partida já iniciada!");
        }
    });
});

document.getElementById('btn-choose-blue').onclick = () => entrarNaEquipe('azul');
document.getElementById('btn-choose-red').onclick = () => entrarNaEquipe('vermelha');

function entrarNaEquipe(equipe) {
    minhaEquipe = equipe;
    const refJogador = db.ref(`salas/${codigoSalaAtual}/jogadores/${equipe}`).push();
    meuId = refJogador.key; 
    refJogador.set({ nome: meuNome }).then(() => {
        document.getElementById('btn-choose-blue').style.display = 'none';
        document.getElementById('btn-choose-red').style.display = 'none';
        localStorage.setItem('caboDeGuerraSessao', JSON.stringify({ codigoSala: codigoSalaAtual, id: meuId, nome: meuNome, equipe: minhaEquipe }));
    });
}

function verificarReconexao() {
    const sessaoSalva = localStorage.getItem('caboDeGuerraSessao');
    if (sessaoSalva) {
        const dados = JSON.parse(sessaoSalva);
        db.ref('salas/' + dados.codigoSala).once('value').then(snapshot => {
            if (snapshot.exists()) {
                const sala = snapshot.val();
                if (sala.status === 'lobby' || sala.status === 'jogando') {
                    isProfessor = false;
                    codigoSalaAtual = dados.codigoSala;
                    meuId = dados.id;
                    meuNome = dados.nome;
                    minhaEquipe = dados.equipe;
                    questoesDaPartida = sala.questoes;
                    totalRodadas = sala.totalRodadas;
                    document.getElementById('display-room-code').innerText = codigoSalaAtual;
                    document.getElementById('btn-start-multiplayer').classList.add('hidden');
                    document.getElementById('btn-choose-blue').style.display = 'none';
                    document.getElementById('btn-choose-red').style.display = 'none';
                    iniciarEscutaLobby();
                    iniciarEscutaPartida();
                    if (sala.status === 'lobby') mudarTela(lobbyScreen);
                    else if (sala.status === 'jogando') {
                        rodadaAtualLocal = sala.rodadaAtual;
                        mudarTela(gameScreen);
                        renderizarRodada(sala.rodadaAtual, sala.questoes);
                    }
                } else localStorage.removeItem('caboDeGuerraSessao');
            } else localStorage.removeItem('caboDeGuerraSessao');
        });
    }
}
verificarReconexao();

function sairDaSala() {
    if (confirm("Tem certeza que deseja sair?")) {
        clearInterval(intervaloTimer);
        if (isProfessor) db.ref('salas/' + codigoSalaAtual).update({ status: 'cancelada' });
        else if (meuId && minhaEquipe) db.ref(`salas/${codigoSalaAtual}/jogadores/${minhaEquipe}/${meuId}`).remove();
        localStorage.removeItem('caboDeGuerraSessao');
        location.reload();
    }
}
document.getElementById('btn-leave-lobby').addEventListener('click', sairDaSala);
document.getElementById('btn-leave-game').addEventListener('click', sairDaSala);

// ==========================================
// 8. ESCUTAS E RENDERIZAÇÃO DO JOGO
// ==========================================
function iniciarEscutaLobby() {
    db.ref('salas/' + codigoSalaAtual + '/jogadores').on('value', (snapshot) => {
        const dados = snapshot.val() || { azul: {}, vermelha: {} };
        const azul = dados.azul ? Object.values(dados.azul) : [];
        const vermelha = dados.vermelha ? Object.values(dados.vermelha) : [];
        totalJogadores = azul.length + vermelha.length;
        if (minhaEquipe === 'azul') jogadoresNaMinhaEquipe = azul.length;
        if (minhaEquipe === 'vermelha') jogadoresNaMinhaEquipe = vermelha.length;
        document.getElementById('count-blue').innerText = azul.length;
        document.getElementById('count-red').innerText = vermelha.length;
        document.getElementById('list-blue').innerHTML = azul.map(j => `<li>${j.nome}</li>`).join('');
        document.getElementById('list-red').innerHTML = vermelha.map(j => `<li>${j.nome}</li>`).join('');
    });
}

document.getElementById('btn-start-multiplayer').addEventListener('click', () => {
    if (totalJogadores === 0) return alert("Aguarde pelo menos 1 jogador!");
    db.ref('salas/' + codigoSalaAtual).update({ status: 'jogando', rodadaAtual: 1 });
});

function iniciarEscutaPartida() {
    db.ref('salas/' + codigoSalaAtual).on('value', (snapshot) => {
        const sala = snapshot.val();
        if (!sala) return;
        if (sala.status === 'cancelada' && !isProfessor) {
            alert("O professor encerrou a sala.");
            localStorage.removeItem('caboDeGuerraSessao');
            location.reload();
            return;
        }
        if (sala.status === 'jogando' && sala.rodadaAtual !== rodadaAtualLocal) {
            rodadaAtualLocal = sala.rodadaAtual;
            mudarTela(gameScreen);
            document.getElementById('score-blue').innerText = sala.vitoriasAzul;
            document.getElementById('score-red').innerText = sala.vitoriasVermelha;
            atualizarCorda(sala.posicaoCorda);
            renderizarRodada(sala.rodadaAtual, sala.questoes);
        }
        if (sala.status === 'finalizado') finalizarPartidaVisual(sala.vencedor, sala.posicaoCorda);
    });

    db.ref('salas/' + codigoSalaAtual + '/respostasRodada').on('value', (snap) => {
        const res = snap.val();
        if (!res) return;
        const containerStatus = document.getElementById('team-status-container');
        const textoStatus = document.getElementById('team-status-text');
        if (containerStatus.style.display !== 'none') {
            if (isProfessor) {
                let totalRespondido = (res.respondidosAzul || 0) + (res.respondidosVermelha || 0);
                textoStatus.innerText = `${totalRespondido} de ${totalJogadores} alunos já responderam!`;
            } else {
                let qtdRespondidos = minhaEquipe === 'azul' ? res.respondidosAzul : res.respondidosVermelha;
                textoStatus.innerText = `${qtdRespondidos || 0} de ${jogadoresNaMinhaEquipe} colegas já responderam!`;
            }
        }
    });
}

const optionsDiv = document.getElementById('options');
const questionText = document.getElementById('question-text');
const roundInfo = document.getElementById('round-info');
const timerDisplay = document.getElementById('timer');

function renderizarRodada(numeroRodada, questoes) {
    if (numeroRodada > totalRodadas) return; 
    roundInfo.innerText = `Rodada ${numeroRodada} de ${totalRodadas}`;
    optionsDiv.innerHTML = ''; 
    document.getElementById('team-status-container').style.display = 'block';

    if (isProfessor) {
        questionText.innerHTML = `<strong>Aguardando respostas...</strong><br><br>Os alunos estão resolvendo as questões!`;
        document.getElementById('team-status-text').innerText = `0 de ${totalJogadores} alunos já responderam!`;
        iniciarCronometro(null);
    } else {
        document.getElementById('team-status-text').innerText = `0 de ${jogadoresNaMinhaEquipe} colegas já responderam!`;
        db.ref(`salas/${codigoSalaAtual}/jogadores/${minhaEquipe}`).once('value').then(snap => {
            const jogadores = snap.val() || {};
            const chaves = Object.keys(jogadores);
            let meuIndex = chaves.indexOf(meuId); 
            if (meuIndex === -1) meuIndex = 0;
            const indiceDaQuestao = ((numeroRodada - 1) * 10 + meuIndex) % questoes.length;
            const questao = questoes[indiceDaQuestao];
            questionText.innerHTML = questao.pergunta;
            questao.alternativas.forEach(alt => {
                const btn = document.createElement('button');
                btn.innerText = alt;
                btn.style.padding = "16px";
                btn.style.fontSize = "1.1rem";
                btn.style.fontWeight = "bold";
                btn.style.borderRadius = "10px";
                btn.style.border = "2px solid #dfe4ea";
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "#2f3542";
                btn.style.cursor = "pointer";
                btn.onclick = () => enviarResposta(alt, questao.resposta, btn);
                optionsDiv.appendChild(btn);
            });
            iniciarCronometro(questao.resposta);
        });
    }
}

function iniciarCronometro(respostaCorreta) {
    clearInterval(intervaloTimer);
    tempoRestante = 15; 
    timerDisplay.innerText = `⏱ ${tempoRestante}`;
    intervaloTimer = setInterval(() => {
        tempoRestante--;
        timerDisplay.innerText = `⏱ ${tempoRestante}`;
        if (isProfessor && tempoRestante > 0 && tempoRestante <= 3) somTick.play().catch(e => {});
        if (tempoRestante <= 0) {
            clearInterval(intervaloTimer);
            if (!isProfessor) bloquearBotoes(null, respostaCorreta);
            if (isProfessor) setTimeout(calcularFimDeRodada, 2000); 
        }
    }, 1000);
}

function enviarResposta(escolha, correta, btnClicado) {
    clearInterval(intervaloTimer);
    bloquearBotoes(btnClicado, correta);
    const acertou = (escolha === correta);
    const refRespostas = db.ref(`salas/${codigoSalaAtual}/respostasRodada`);
    if (minhaEquipe === 'azul') {
        if (acertou) refRespostas.child('acertosAzul').set(firebase.database.ServerValue.increment(1));
        refRespostas.child('respondidosAzul').set(firebase.database.ServerValue.increment(1));
    } else {
        if (acertou) refRespostas.child('acertosVermelha').set(firebase.database.ServerValue.increment(1));
        refRespostas.child('respondidosVermelha').set(firebase.database.ServerValue.increment(1));
    }
}

function bloquearBotoes(btnClicado, correta) {
    const botoes = optionsDiv.querySelectorAll('button');
    botoes.forEach(b => {
        b.disabled = true;
        b.style.opacity = "0.7";
        if (b.innerText === correta) { b.style.backgroundColor = "#2ed573"; b.style.color = "white"; b.style.borderColor = "#2ed573"; }
    });
    if (btnClicado && btnClicado.innerText !== correta) { btnClicado.style.backgroundColor = "#ff4757"; btnClicado.style.color = "white"; btnClicado.style.borderColor = "#ff4757"; }
}

function calcularFimDeRodada() {
    if (!isProfessor) return;
    db.ref('salas/' + codigoSalaAtual).once('value').then(snapshot => {
        const sala = snapshot.val();
        const res = sala.respostasRodada || {};
        const acertosA = res.acertosAzul || 0;
        const acertosV = res.acertosVermelha || 0;
        const respA = res.respondidosAzul || 0;
        const respV = res.respondidosVermelha || 0;
        const diferenca = acertosA - acertosV;
        
        const maxJogadoresPorEquipe = Math.max(
            sala.jogadores && sala.jogadores.azul ? Object.keys(sala.jogadores.azul).length : 0,
            sala.jogadores && sala.jogadores.vermelha ? Object.keys(sala.jogadores.vermelha).length : 0
        );
        let questoesUsadas = [];
        for(let i = 0; i < maxJogadoresPorEquipe; i++) {
            let idx = ((sala.rodadaAtual - 1) * 10 + i) % sala.questoes.length;
            if(sala.questoes[idx]) questoesUsadas.push(sala.questoes[idx].pergunta);
        }

        historicoRodadas.push({ rodada: sala.rodadaAtual, acertos: acertosA + acertosV, respostas: respA + respV, questoes: questoesUsadas });

        let novaPosicao = sala.posicaoCorda + diferenca;
        if (novaPosicao > 5) novaPosicao = 5;
        if (novaPosicao < -5) novaPosicao = -5;
        let statusPartida = 'jogando';
        let vencedor = null;

        if (novaPosicao >= 5) { statusPartida = 'finalizado'; vencedor = 'Equipe Azul'; }
        else if (novaPosicao <= -5) { statusPartida = 'finalizado'; vencedor = 'Equipe Vermelha'; }
        else if (sala.rodadaAtual >= sala.totalRodadas) { 
            statusPartida = 'finalizado'; 
            if (novaPosicao > 0) vencedor = 'Equipe Azul';
            else if (novaPosicao < 0) vencedor = 'Equipe Vermelha';
            else vencedor = 'Empate';
        }

        questionText.innerHTML = `<strong>Fim da Rodada!</strong><br><br>🔵 Azul: ${acertosA} | 🔴 Vermelho: ${acertosV}<br>`;
        if (diferenca !== 0) { document.querySelector('.tug-of-war-container').classList.add('shake-animation'); somPuxadaCorda.play().catch(e => {}); }
        atualizarCorda(novaPosicao);

        setTimeout(() => {
            document.querySelector('.tug-of-war-container').classList.remove('shake-animation');
            const updates = {
                posicaoCorda: novaPosicao, vitoriasAzul: sala.vitoriasAzul + acertosA, vitoriasVermelha: sala.vitoriasVermelha + acertosV,
                respostasRodada: { acertosAzul: 0, acertosVermelha: 0, respondidosAzul: 0, respondidosVermelha: 0 },
                status: statusPartida, vencedor: vencedor
            };
            if (statusPartida === 'jogando') updates.rodadaAtual = sala.rodadaAtual + 1; 
            db.ref('salas/' + codigoSalaAtual).update(updates);
        }, 3000);
    });
}

function atualizarCorda(posicao) {
    const porcentagem = 50 + (posicao * 8);
    document.getElementById('knot').style.left = `${porcentagem}%`;
}

function finalizarPartidaVisual(vencedor, posicaoCorda) {
    clearInterval(intervaloTimer);
    document.getElementById('team-status-container').style.display = 'none'; 
    roundInfo.innerText = "Fim de Jogo!";
    optionsDiv.innerHTML = '';
    timerDisplay.innerText = '';
    localStorage.removeItem('caboDeGuerraSessao');
    
    if (vencedor && vencedor !== 'Empate') { dispararConfetes(); if (isProfessor) somVitoria.play().catch(e => {}); }
    questionText.innerHTML = `<h2>🏆 ${vencedor === 'Empate' ? 'O jogo terminou empatado!' : 'A ' + vencedor + ' venceu!'}</h2>`;
    
    if (isProfessor) {
        const relatorioDiv = document.createElement('div');
        relatorioDiv.style.cssText = "margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 12px; text-align: left; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);";
        let htmlRelatorio = `<h3 style="margin-top:0; color:#2f3542; border-bottom: 2px solid #dfe4ea; padding-bottom: 10px;">📊 Relatório da Turma</h3><ul style="list-style:none; padding:0; margin:0;">`;
        historicoRodadas.forEach(rod => {
            let taxa = rod.respostas > 0 ? Math.round((rod.acertos / rod.respostas) * 100) : 0;
            let cor = taxa >= 70 ? '#2ed573' : (taxa >= 40 ? '#ffa502' : '#ff4757');
            let htmlQuestoes = rod.questoes.map(q => `<li style="margin-bottom: 5px;">${q}</li>`).join('');
            if (rod.questoes.length === 0) htmlQuestoes = "<li>Nenhuma questão foi enviada.</li>";
            htmlRelatorio += `
            <li style="margin-bottom:12px; font-size:16px; color: #57606f; background: white; padding: 12px; border-radius: 8px; border: 1px solid #dfe4ea;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>Rodada ${rod.rodada}:</strong> 
                    <div><span style="font-size: 14px;">${rod.acertos} de ${rod.respostas} acertos</span><span style="color: white; background: ${cor}; padding: 4px 10px; border-radius: 12px; font-size: 14px; margin-left: 10px; font-weight: bold;">${taxa}%</span></div>
                </div>
                <details style="margin-top: 10px; font-size: 14px;">
                    <summary style="cursor: pointer; color: #007bff; font-weight: bold; outline: none;">Ver questões trabalhadas</summary>
                    <ul style="margin-top: 8px; padding-left: 20px; color: #2f3542;">${htmlQuestoes}</ul>
                </details>
            </li>`;
        });
        htmlRelatorio += `</ul>`;
        relatorioDiv.innerHTML = htmlRelatorio;
        optionsDiv.appendChild(relatorioDiv);
        const btnVoltar = document.createElement('button');
        btnVoltar.innerText = "Voltar ao Menu Principal";
        btnVoltar.style.cssText = "margin-top: 20px; padding: 15px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; background-color: #57606f; color: white; border: none; width: 100%;";
        btnVoltar.onclick = () => location.reload(); 
        optionsDiv.appendChild(btnVoltar);
    }
}

function dispararConfetes() {
    const emojis = ['🎉', '✨', '🎊', '🏆'];
    for(let i = 0; i < 40; i++) {
        const confete = document.createElement('div');
        confete.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        confete.style.cssText = `position: fixed; left: ${Math.random() * 100}vw; top: -50px; font-size: ${Math.random() * 20 + 15}px; z-index: 9999; pointer-events: none; transition: top 3s linear, left 3s ease-in-out;`;
        document.body.appendChild(confete);
        setTimeout(() => { confete.style.top = '100vh'; confete.style.left = (Math.random() * 100) + 'vw'; }, 50);
        setTimeout(() => confete.remove(), 3000);
    }
}