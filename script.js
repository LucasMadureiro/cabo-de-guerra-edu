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

// Diferença entre o relógio deste dispositivo e o relógio do servidor Firebase.
// Usado para que o cronômetro da rodada seja o MESMO para todos (professor e alunos),
// em vez de cada aparelho contar 15s por conta própria (o que dessincroniza fácil).
let serverTimeOffset = 0;
db.ref('.info/serverTimeOffset').on('value', (snap) => {
    serverTimeOffset = snap.val() || 0;
});

// Sons gerados localmente via Web Audio API, em vez de arquivos hospedados em
// URLs externas (que fogem do nosso controle e podem sair do ar). Os navegadores
// exigem que áudio comece depois de uma interação do usuário — como o app já
// depende de vários cliques antes de qualquer som tocar, isso funciona sem
// configuração extra.
let audioCtx = null;
function getAudioCtx() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null; // navegador muito antigo sem suporte
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
}

function tocarTom(frequencia, duracaoMs, tipoOnda, volume) {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const oscilador = ctx.createOscillator();
        const ganho = ctx.createGain();
        oscilador.type = tipoOnda || 'sine';
        oscilador.frequency.value = frequencia;
        const agora = ctx.currentTime;
        const vol = volume !== undefined ? volume : 0.15;
        ganho.gain.setValueAtTime(vol, agora);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracaoMs / 1000);
        oscilador.connect(ganho);
        ganho.connect(ctx.destination);
        oscilador.start(agora);
        oscilador.stop(agora + duracaoMs / 1000);
    } catch (e) { /* dispositivo sem suporte a áudio: fica mudo, sem quebrar o jogo */ }
}

function tocarSomTick() {
    tocarTom(880, 120, 'square', 0.12);
}

function tocarSomPuxadaCorda() {
    // Efeito de "puxão": um tom que desliza rapidamente de agudo para grave
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const oscilador = ctx.createOscillator();
        const ganho = ctx.createGain();
        oscilador.type = 'sawtooth';
        const agora = ctx.currentTime;
        oscilador.frequency.setValueAtTime(600, agora);
        oscilador.frequency.exponentialRampToValueAtTime(150, agora + 0.4);
        ganho.gain.setValueAtTime(0.15, agora);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + 0.4);
        oscilador.connect(ganho);
        ganho.connect(ctx.destination);
        oscilador.start(agora);
        oscilador.stop(agora + 0.4);
    } catch (e) {}
}

function tocarSomVitoria() {
    // Pequena fanfarra: sequência de notas ascendentes (Dó-Mi-Sol-Dó)
    const notas = [523.25, 659.25, 783.99, 1046.5];
    notas.forEach((freq, i) => {
        setTimeout(() => tocarTom(freq, 220, 'triangle', 0.18), i * 150);
    });
}

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
const DURACAO_RODADA_MS = 15000; // 15 segundos por rodada
let refMeuJogador = null; // referência Firebase do meu nó de jogador (usada para onDisconnect)
let jogoJaFinalizadoLocalmente = false; // evita repetir confete/som/relatório se o listener disparar de novo

// Qualquer texto que venha de um campo digitado por aluno/professor (nome, pergunta,
// disciplina, assunto...) precisa passar por aqui antes de ser inserido via innerHTML.
// Sem isso, alguém poderia digitar algo como <img src=x onerror="..."> como "nome" e
// esse código executaria na tela de todo mundo que está olhando o lobby/pergunta.
function escapeHTML(texto) {
    if (texto === undefined || texto === null) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Compara ignorando maiúsculas/minúsculas e espaços nas pontas; se encontrar uma
// categoria já existente equivalente ao que foi digitado, devolve a grafia
// ORIGINAL já usada no banco (em vez do texto recém-digitado), para não criar
// "Matemática" e "matemática" como duas categorias diferentes por acidente.
function normalizarCategoria(valorDigitado, valoresExistentes) {
    const digitadoLimpo = valorDigitado.trim();
    const encontrado = valoresExistentes.find(v => v.trim().toLowerCase() === digitadoLimpo.toLowerCase());
    return encontrado || digitadoLimpo;
}

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

document.getElementById('btn-show-student').onclick = () => {
    document.getElementById('team-selection').style.display = 'none'; 
    document.getElementById('btn-join-room').style.display = 'block'; 
    mudarTela(studentScreen);
};

document.getElementById('btn-show-teacher').onclick = () => mudarTela(setupScreen);
document.getElementById('btn-back-role-1').onclick = () => mudarTela(roleScreen);
document.getElementById('btn-back-role-2').onclick = () => mudarTela(roleScreen);

// ==========================================
// 3. SINCRONIZAÇÃO DO BANCO DE QUESTÕES
// ==========================================
db.ref('questoes_comunidade').on('value', (snapshot) => {
    rawQuestoesNuvem = snapshot.val() || {};
    bancoDeQuestoes = JSON.parse(JSON.stringify(questoesBaseLocais)); 
    Object.keys(rawQuestoesNuvem).forEach(id => {
        const q = rawQuestoesNuvem[id];
        if (!bancoDeQuestoes[q.disciplina]) bancoDeQuestoes[q.disciplina] = {};
        if (!bancoDeQuestoes[q.disciplina][q.assunto]) bancoDeQuestoes[q.disciplina][q.assunto] = {};
        if (!bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade]) bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade] = [];
        bancoDeQuestoes[q.disciplina][q.assunto][q.dificuldade].push(q);
    });
    carregarMenuConfiguracao();
    renderizarListaDeQuestoes();
    atualizarDatalistsCategorias();
});

// Sugere, via autocomplete, as disciplinas e assuntos que já existem no banco.
// Reduz a chance de alguém digitar "Matemática" hoje e "matemática" amanhã.
function atualizarDatalistsCategorias() {
    const datalistDisciplinas = document.getElementById('datalist-disciplinas');
    const datalistAssuntos = document.getElementById('datalist-assuntos');
    if (!datalistDisciplinas || !datalistAssuntos) return;

    const disciplinas = Object.keys(bancoDeQuestoes);
    const assuntosUnicos = new Set();
    disciplinas.forEach(d => Object.keys(bancoDeQuestoes[d]).forEach(a => assuntosUnicos.add(a)));

    datalistDisciplinas.innerHTML = disciplinas.map(d => `<option value="${escapeHTML(d)}">`).join('');
    datalistAssuntos.innerHTML = Array.from(assuntosUnicos).map(a => `<option value="${escapeHTML(a)}">`).join('');
}

// ==========================================
// 4. MENU DO PROFESSOR (CRIAR SALA)
// ==========================================
const selSubject = document.getElementById('sel-subject');
const selTopic = document.getElementById('sel-topic');
const selDifficulty = document.getElementById('sel-difficulty');
const selRounds = document.getElementById('sel-rounds');

function carregarMenuConfiguracao() {
    // Guarda a seleção atual do professor ANTES de repopular. O listener do banco
    // na nuvem é "ao vivo" — se alguém cadastrar/editar uma questão enquanto o
    // professor está nesta tela, os selects seriam recriados do zero e voltariam
    // pro primeiro item da lista, silenciosamente trocando o que ele tinha escolhido.
    const subjectAnterior = selSubject.value;
    const topicAnterior = selTopic.value;
    const difficultyAnterior = selDifficulty.value;

    if (Object.keys(bancoDeQuestoes).length === 0) {
        selSubject.innerHTML = '<option value="">Banco vazio</option>';
        selTopic.innerHTML = '';
        selDifficulty.innerHTML = '';
        return;
    }

    popularSelect(selSubject, Object.keys(bancoDeQuestoes));
    if (bancoDeQuestoes[subjectAnterior]) selSubject.value = subjectAnterior;

    const subjectAtual = selSubject.value;
    popularSelect(selTopic, Object.keys(bancoDeQuestoes[subjectAtual]));
    if (bancoDeQuestoes[subjectAtual][topicAnterior]) selTopic.value = topicAnterior;

    const topicAtual = selTopic.value;
    popularSelect(selDifficulty, Object.keys(bancoDeQuestoes[subjectAtual][topicAtual]));
    if (bancoDeQuestoes[subjectAtual][topicAtual][difficultyAnterior]) selDifficulty.value = difficultyAnterior;
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
    opcoes.forEach(op => el.innerHTML += `<option value="${escapeHTML(op)}">${escapeHTML(op)}</option>`);
}

selSubject.addEventListener('change', atualizarTopicos);
selTopic.addEventListener('change', atualizarDificuldades);

// ==========================================
// 5. CRUD DE QUESTÕES 
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

function renderizarListaDeQuestoes() {
    const container = document.getElementById('questions-list-container');
    container.innerHTML = '';
    
    if (Object.keys(rawQuestoesNuvem).length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--ink-soft); font-weight: 600; font-size: 16px;">Você ainda não adicionou nenhuma questão na nuvem.</p>';
        return;
    }

    const agrupado = {};
    Object.keys(rawQuestoesNuvem).forEach(id => {
        const q = rawQuestoesNuvem[id];
        if (!agrupado[q.disciplina]) agrupado[q.disciplina] = {};
        if (!agrupado[q.disciplina][q.assunto]) agrupado[q.disciplina][q.assunto] = {};
        if (!agrupado[q.disciplina][q.assunto][q.dificuldade]) agrupado[q.disciplina][q.assunto][q.dificuldade] = [];
        agrupado[q.disciplina][q.assunto][q.dificuldade].push({ id: id, ...q });
    });

    let html = '';
    for (const disc in agrupado) {
        html += `
        <details style="margin-bottom: 10px; background: var(--paper); border-radius: var(--radius-md); border: 1px solid var(--line);">
            <summary style="font-family: var(--font-display); font-weight: 700; font-size: 18px; cursor: pointer; color: var(--ink); padding: 12px;">📚 ${escapeHTML(disc)}</summary>
            <div style="padding: 0 12px 12px 12px;">`;
        for (const ass in agrupado[disc]) {
            html += `
            <details style="margin-bottom: 8px; background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--line);">
                <summary style="font-family: var(--font-display); font-weight: 700; font-size: 16px; cursor: pointer; color: var(--info); padding: 10px;">📑 ${escapeHTML(ass)}</summary>
                <div style="padding: 0 10px 10px 10px;">`;
            for (const dif in agrupado[disc][ass]) {
                let corDif = dif === "Fácil" ? "var(--turf)" : (dif === "Média" ? "var(--amber-deep)" : "var(--red)");
                let iconeDif = dif === "Fácil" ? "🟢" : (dif === "Média" ? "🟡" : "🔴");
                html += `
                <details style="margin-bottom: 8px; background: var(--paper); border-radius: var(--radius-sm); border: 1px solid var(--line); border-left: 4px solid ${corDif};">
                    <summary style="font-weight: 700; font-size: 14px; cursor: pointer; color: var(--ink-soft); padding: 8px;">${iconeDif} ${escapeHTML(dif)}</summary>
                    <div style="padding: 10px; display: flex; flex-direction: column; gap: 10px;">`;
                agrupado[disc][ass][dif].forEach(q => {
                    html += `
                        <div style="background: var(--surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
                            <div style="font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 10px;"><strong>Q:</strong> ${escapeHTML(q.pergunta)}</div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="editarQuestao('${q.id}')" class="btn btn-blue" style="padding: 6px 12px; font-size: 0.85rem; flex: 1;">✏️ Editar</button>
                                <button onclick="deletarQuestao('${q.id}')" class="btn btn-red" style="padding: 6px 12px; font-size: 0.85rem; flex: 1;">🗑️ Excluir</button>
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
    let disc = document.getElementById('new-subject').value.trim();
    let assunto = document.getElementById('new-topic').value.trim();
    const dif = document.getElementById('new-difficulty').value;
    const perg = document.getElementById('new-question').value.trim();
    const alts = [
        document.getElementById('new-alt-1').value.trim(),
        document.getElementById('new-alt-2').value.trim(),
        document.getElementById('new-alt-3').value.trim(),
        document.getElementById('new-alt-4').value.trim()
    ];
    const indiceCorreta = parseInt(document.getElementById('new-correct-alt').value) - 1;

    if (!disc || !assunto || !perg || !alts[0] || !alts[1] || !alts[2] || !alts[3]) return alert("Preencha todos os campos!");

    // Se já existir uma categoria com o mesmo nome mas escrita diferente
    // ("Matemática" vs "matemática" vs " Matemática "), reaproveita a grafia já
    // usada em vez de criar uma categoria nova sem querer, fragmentando o banco.
    disc = normalizarCategoria(disc, Object.keys(bancoDeQuestoes));
    assunto = normalizarCategoria(assunto, bancoDeQuestoes[disc] ? Object.keys(bancoDeQuestoes[disc]) : []);

    const questaoData = { disciplina: disc, assunto: assunto, dificuldade: dif, pergunta: perg, alternativas: alts, resposta: alts[indiceCorreta] };

    if (idQuestaoEmEdicao) {
        db.ref('questoes_comunidade/' + idQuestaoEmEdicao).update(questaoData)
            .then(() => mudarTela(manageQuestionsScreen))
            .catch((erro) => {
                console.error('Erro ao atualizar questão:', erro);
                alert('Não foi possível salvar a questão. Verifique sua conexão e tente novamente.');
            });
    } else {
        db.ref('questoes_comunidade').push(questaoData)
            .then(() => mudarTela(manageQuestionsScreen))
            .catch((erro) => {
                console.error('Erro ao criar questão:', erro);
                alert('Não foi possível salvar a questão. Verifique sua conexão e tente novamente.');
            });
    }
});

// ==========================================
// 6. INICIAR SALA (PROFESSOR)
// ==========================================
let criandoSala = false; // guarda contra duplo clique criando 2 salas

// Gera um código de 6 dígitos e confere no Firebase se já existe uma sala com
// esse código antes de usar. Com 900 mil combinações a chance de colisão é
// baixíssima, mas sem essa checagem uma coincidência simplesmente sobrescreveria
// uma sala já em andamento sem avisar ninguém.
function gerarCodigoSalaUnico(tentativasRestantes) {
    if (tentativasRestantes === undefined) tentativasRestantes = 5;
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    return db.ref('salas/' + codigo).once('value').then(snap => {
        if (snap.exists() && tentativasRestantes > 0) {
            return gerarCodigoSalaUnico(tentativasRestantes - 1);
        }
        return codigo;
    });
}

document.getElementById('btn-create-room').addEventListener('click', () => {
    if (criandoSala) return;
    if (Object.keys(bancoDeQuestoes).length === 0) return alert("Crie pelo menos uma questão no banco antes de abrir a sala!");
    
    isProfessor = true;
    totalRodadas = parseInt(selRounds.value);
    historicoRodadas = []; 
    
    const poolDeQuestoes = bancoDeQuestoes[selSubject.value][selTopic.value][selDifficulty.value];
    if(!poolDeQuestoes || poolDeQuestoes.length === 0) return alert("Não há questões nesta categoria.");
    
    criandoSala = true; // só trava o botão depois que passou por todas as validações
    questoesDaPartida = [...poolDeQuestoes].sort(() => Math.random() - 0.5);

    gerarCodigoSalaUnico().then((codigo) => {
        codigoSalaAtual = codigo;

        // IMPORTANTE: separamos a pergunta (pública, todo mundo pode ver) do gabarito
        // (privado, só é consultado quando o próprio aluno precisa responder AQUELA questão).
        // Antes, o array "questoes" ia inteiro para o navegador de todos os alunos, com a
        // resposta certa de TODAS as perguntas da partida junto — bastava abrir o DevTools
        // para ver o gabarito completo antes mesmo de jogar.
        const questoesPublicas = questoesDaPartida.map(q => ({ pergunta: q.pergunta, alternativas: q.alternativas }));
        const gabarito = questoesDaPartida.map(q => q.resposta);

        const refSala = db.ref('salas/' + codigoSalaAtual);
        refSala.set({
            status: 'lobby',
            questoes: questoesPublicas,
            gabarito: gabarito,
            totalRodadas: totalRodadas,
            posicaoCorda: 0,
            rodadaAtual: 0,
            vitoriasAzul: 0,
            vitoriasVermelha: 0,
            jogadores: { azul: {}, vermelha: {} },
            respostasRodada: { acertosAzul: 0, acertosVermelha: 0, respondidosAzul: 0, respondidosVermelha: 0 },
            processandoFimRodada: false
        }).then(() => {
            // Se o professor fechar a aba/cair da internet, a sala é encerrada automaticamente
            // em vez de ficar "viva" para sempre esperando alunos que nunca mais vão jogar.
            refSala.onDisconnect().update({ status: 'cancelada' });

            document.getElementById('display-room-code').innerText = codigoSalaAtual;
            document.getElementById('btn-start-multiplayer').classList.remove('hidden');
            mudarTela(lobbyScreen);
            iniciarEscutaLobby(); 
            iniciarEscutaPartida(); 
        }).catch((erro) => {
            // Se a escrita falhar (sem internet, etc.), destrava o botão em vez de
            // deixar o professor preso sem poder tentar de novo.
            criandoSala = false;
            console.error('Erro ao criar sala:', erro);
            alert('Não foi possível criar a sala. Verifique sua conexão e tente novamente.');
        });
    }).catch((erro) => {
        criandoSala = false;
        console.error('Erro ao gerar código da sala:', erro);
        alert('Não foi possível criar a sala. Verifique sua conexão e tente novamente.');
    });
});

// ==========================================
// 7. LÓGICA DO ALUNO
// ==========================================
document.getElementById('btn-join-room').addEventListener('click', () => {
    const nomeInput = document.getElementById('input-student-name').value.trim();
    const codigoInput = document.getElementById('input-room-code').value.trim();
    if (!nomeInput || !codigoInput) return alert("Preencha nome e código!");

    // O código digitado vira parte do caminho no Firebase (ex: "salas/123456").
    // Sem essa checagem, algo como "12/34" seria interpretado como um caminho
    // aninhado em vez de um código de sala inválido — e caracteres como . # $ [ ]
    // não são permitidos em chaves do Firebase e podem gerar erro.
    if (!/^\d{6}$/.test(codigoInput)) return alert("O código da sala deve ter exatamente 6 números.");

    db.ref('salas/' + codigoInput).once('value').then((snapshot) => {
        if (snapshot.exists() && snapshot.val().status === 'lobby') {
            isProfessor = false;
            meuNome = nomeInput;
            codigoSalaAtual = codigoInput;
            questoesDaPartida = snapshot.val().questoes;
            totalRodadas = snapshot.val().totalRodadas;
            
            document.getElementById('btn-join-room').style.display = 'none';
            document.getElementById('team-selection').style.display = 'flex';
        } else {
            alert("Sala não encontrada ou partida já iniciada!");
        }
    }).catch((erro) => {
        console.error('Erro ao buscar sala:', erro);
        alert('Não foi possível buscar a sala. Verifique sua conexão e tente novamente.');
    });
});

document.getElementById('btn-choose-blue').onclick = () => entrarNaEquipe('azul');
document.getElementById('btn-choose-red').onclick = () => entrarNaEquipe('vermelha');

let entrandoNaEquipe = false; // guarda contra duplo clique cadastrando o aluno 2x

// Se já existir alguém com o mesmo nome na sala (comum em turmas com colegas
// de mesmo primeiro nome), gera algo como "João (2)" em vez de deixar dois
// jogadores com o nome idêntico no placar — o que confundiria o professor na
// hora de conferir quem respondeu o quê.
function gerarNomeUnico(nomeDesejado, nomesExistentes) {
    const existentesLower = nomesExistentes.map(n => (n || '').trim().toLowerCase());
    if (!existentesLower.includes(nomeDesejado.trim().toLowerCase())) return nomeDesejado;
    let contador = 2;
    let candidato = `${nomeDesejado} (${contador})`;
    while (existentesLower.includes(candidato.toLowerCase())) {
        contador++;
        candidato = `${nomeDesejado} (${contador})`;
    }
    return candidato;
}

function entrarNaEquipe(equipe) {
    if (entrandoNaEquipe) return;
    entrandoNaEquipe = true;
    minhaEquipe = equipe;

    db.ref(`salas/${codigoSalaAtual}/jogadores`).once('value').then((snapJogadores) => {
        const dadosJogadores = snapJogadores.val() || {};
        const nomesExistentes = [
            ...(dadosJogadores.azul ? Object.values(dadosJogadores.azul).map(j => j.nome) : []),
            ...(dadosJogadores.vermelha ? Object.values(dadosJogadores.vermelha).map(j => j.nome) : [])
        ];
        meuNome = gerarNomeUnico(meuNome, nomesExistentes);

        const refJogador = db.ref(`salas/${codigoSalaAtual}/jogadores/${equipe}`).push();
        meuId = refJogador.key; 
        refMeuJogador = refJogador;
        refJogador.set({ nome: meuNome }).then(() => {
            // Se este aluno fechar a aba ou perder a conexão, ele some da lista de jogadores
            // automaticamente (antes, ficava "fantasma" na sala para sempre).
            refJogador.onDisconnect().remove();

            localStorage.setItem('caboDeGuerraSessao', JSON.stringify({ codigoSala: codigoSalaAtual, id: meuId, nome: meuNome, equipe: minhaEquipe }));
            
            document.getElementById('display-room-code').innerText = codigoSalaAtual;
            document.getElementById('btn-start-multiplayer').classList.add('hidden');
            mudarTela(lobbyScreen);
            iniciarEscutaLobby();
            iniciarEscutaPartida();
        }).catch((erro) => {
            // Mesma lógica: destrava o botão se a escrita falhar, em vez de deixar
            // o aluno preso sem conseguir escolher uma equipe.
            entrandoNaEquipe = false;
            console.error('Erro ao entrar na equipe:', erro);
            alert('Não foi possível entrar na equipe. Verifique sua conexão e tente novamente.');
        });
    }).catch((erro) => {
        entrandoNaEquipe = false;
        console.error('Erro ao verificar jogadores da sala:', erro);
        alert('Não foi possível entrar na equipe. Verifique sua conexão e tente novamente.');
    });
}

function verificarReconexao() {
    const sessaoSalva = localStorage.getItem('caboDeGuerraSessao');
    if (sessaoSalva) {
        const dados = JSON.parse(sessaoSalva);
        db.ref('salas/' + dados.codigoSala).once('value').then(snapshot => {
            if (snapshot.exists()) {
                const sala = snapshot.val();

                // Confere se o jogador AINDA existe de fato dentro da sala.
                // Sem isso, uma sessão salva no localStorage que aponta para um
                // jogador já removido (por exemplo, por uma queda de conexão
                // anterior que disparou o onDisconnect) seria tratada como válida,
                // e o aluno cairia numa tela de jogo "quebrada": sem contar para
                // o time, sem receber a pergunta certa (sempre cai no índice 0).
                const jogadorAindaExiste = !!(sala.jogadores && sala.jogadores[dados.equipe] && sala.jogadores[dados.equipe][dados.id]);

                if ((sala.status === 'lobby' || sala.status === 'jogando') && jogadorAindaExiste) {
                    isProfessor = false;
                    codigoSalaAtual = dados.codigoSala;
                    meuId = dados.id;
                    meuNome = dados.nome;
                    minhaEquipe = dados.equipe;

                    // onDisconnect não sobrevive a um F5 — precisa ser registrado de novo
                    // a cada reconexão do aluno.
                    refMeuJogador = db.ref(`salas/${dados.codigoSala}/jogadores/${dados.equipe}/${dados.id}`);
                    refMeuJogador.onDisconnect().remove();

                    questoesDaPartida = sala.questoes;
                    totalRodadas = sala.totalRodadas;
                    document.getElementById('display-room-code').innerText = codigoSalaAtual;
                    document.getElementById('btn-start-multiplayer').classList.add('hidden');
                    iniciarEscutaLobby();
                    iniciarEscutaPartida();
                    if (sala.status === 'lobby') mudarTela(lobbyScreen);
                    else if (sala.status === 'jogando') {
                        rodadaAtualLocal = sala.rodadaAtual;
                        mudarTela(gameScreen);
                        renderizarRodada(sala.rodadaAtual, sala.questoes, sala.tempoFimRodada);
                    }
                } else localStorage.removeItem('caboDeGuerraSessao');
            } else localStorage.removeItem('caboDeGuerraSessao');
        }).catch((erro) => {
            // Falha de rede ao verificar: não apaga a sessão salva, só desiste
            // silenciosamente por agora — tenta de novo no próximo carregamento.
            console.error('Erro ao verificar reconexão:', erro);
        });
    }
}
verificarReconexao();

function sairDaSala() {
    if (confirm("Tem certeza que deseja sair?")) {
        clearInterval(intervaloTimer);
        if (isProfessor) {
            db.ref('salas/' + codigoSalaAtual).onDisconnect().cancel();
            db.ref('salas/' + codigoSalaAtual).update({ status: 'cancelada' });
        } else if (meuId && minhaEquipe) {
            if (refMeuJogador) refMeuJogador.onDisconnect().cancel();
            db.ref(`salas/${codigoSalaAtual}/jogadores/${minhaEquipe}/${meuId}`).remove();
        }
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
        document.getElementById('list-blue').innerHTML = azul.map(j => `<li>${escapeHTML(j.nome)}</li>`).join('');
        document.getElementById('list-red').innerHTML = vermelha.map(j => `<li>${escapeHTML(j.nome)}</li>`).join('');
    });
}

document.getElementById('btn-start-multiplayer').addEventListener('click', () => {
    if (totalJogadores === 0) return alert("Aguarde pelo menos 1 jogador!");
    db.ref('salas/' + codigoSalaAtual).update({
        status: 'jogando',
        rodadaAtual: 1,
        tempoFimRodada: Date.now() + serverTimeOffset + DURACAO_RODADA_MS
    });
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
            renderizarRodada(sala.rodadaAtual, sala.questoes, sala.tempoFimRodada);
        }
        if (sala.status === 'finalizado' && !jogoJaFinalizadoLocalmente) {
            jogoJaFinalizadoLocalmente = true;
            finalizarPartidaVisual(sala.vencedor, sala.posicaoCorda);
        }
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

function renderizarRodada(numeroRodada, questoes, tempoFimRodada) {
    if (numeroRodada > totalRodadas) return; 
    roundInfo.innerText = `Rodada ${numeroRodada} de ${totalRodadas}`;
    optionsDiv.innerHTML = ''; 
    document.getElementById('team-status-container').style.display = 'block';

    if (isProfessor) {
        questionText.innerHTML = `<strong>Aguardando respostas...</strong><br><br>Os alunos estão resolvendo as questões!`;
        document.getElementById('team-status-text').innerText = `0 de ${totalJogadores} alunos já responderam!`;
        iniciarCronometro(null, tempoFimRodada);
    } else {
        document.getElementById('team-status-text').innerText = `0 de ${jogadoresNaMinhaEquipe} colegas já responderam!`;

        // Guarda contra respostas duplicadas: se o aluno já respondeu esta rodada
        // (por exemplo, deu F5 depois de responder), não deixamos ele responder de novo.
        // Isso é checado no Firebase, então sobrevive a um refresh da página.
        db.ref(`salas/${codigoSalaAtual}/respostasRodada/jogadoresRespondidos/${meuId}`).once('value').then(snapJaRespondeu => {
            if (snapJaRespondeu.exists()) {
                questionText.innerHTML = `<strong>Você já respondeu esta rodada.</strong><br><br>Aguardando os colegas...`;
                timerDisplay.innerText = '';
                return;
            }

            // Guarda contra "responder depois do tempo": se o aluno reconectar já
            // depois do fim da rodada, mostramos que o tempo acabou em vez de deixar
            // ele clicar em uma alternativa fora do prazo.
            if (tempoFimRodada && (Date.now() + serverTimeOffset) >= tempoFimRodada) {
                questionText.innerHTML = `<strong>O tempo desta rodada acabou.</strong><br><br>Aguardando o resultado...`;
                timerDisplay.innerText = '⏱ 0';
                return;
            }

            db.ref(`salas/${codigoSalaAtual}/jogadores/${minhaEquipe}`).once('value').then(snap => {
                const jogadores = snap.val() || {};
                const chaves = Object.keys(jogadores);
                let meuIndex = chaves.indexOf(meuId); 
                if (meuIndex === -1) meuIndex = 0;
                
                const indiceDaQuestao = ((numeroRodada - 1) + meuIndex) % questoes.length;
                const questao = questoes[indiceDaQuestao];
                questionText.innerHTML = escapeHTML(questao.pergunta);

                // A resposta certa NÃO vem mais dentro do pacote de perguntas da partida.
                // Buscamos só o gabarito da questão específica deste aluno, agora que ele
                // realmente vai responder — em vez de todo mundo já ter todas as respostas
                // desde o início da partida.
                db.ref(`salas/${codigoSalaAtual}/gabarito/${indiceDaQuestao}`).once('value').then(snapGabarito => {
                    const respostaCorreta = snapGabarito.val();

                    questao.alternativas.forEach((alt, indiceAlt) => {
                        const btn = document.createElement('button');
                        btn.className = 'answer-tile';
                        btn.dataset.answer = alt; // usado para comparação confiável em bloquearBotoes,
                                                   // independente do que é exibido visualmente no botão

                        const badge = document.createElement('span');
                        badge.className = 'answer-tile-badge';
                        badge.textContent = String.fromCharCode(65 + indiceAlt); // A, B, C, D

                        const label = document.createElement('span');
                        label.className = 'answer-tile-label';
                        label.textContent = alt; // textContent, não innerHTML: nunca interpreta como HTML

                        btn.appendChild(badge);
                        btn.appendChild(label);
                        btn.onclick = () => enviarResposta(alt, respostaCorreta, btn);
                        optionsDiv.appendChild(btn);
                    });
                    iniciarCronometro(respostaCorreta, tempoFimRodada);
                });
            });
        });
    }
}

function iniciarCronometro(respostaCorreta, tempoFimRodada) {
    clearInterval(intervaloTimer);

    // Todo mundo (professor e alunos) conta a partir do MESMO instante final,
    // corrigido pelo offset de relógio do servidor. Isso evita que o timer
    // dessincronize por causa de aba em segundo plano, celular mais lento, etc.
    // Se por algum motivo não recebemos o timestamp, caímos para a contagem local antiga.
    const fimRodadaMs = tempoFimRodada || (Date.now() + serverTimeOffset + DURACAO_RODADA_MS);

    function calcularTempoRestante() {
        const agora = Date.now() + serverTimeOffset;
        return Math.max(0, Math.ceil((fimRodadaMs - agora) / 1000));
    }

    tempoRestante = calcularTempoRestante();
    timerDisplay.innerText = `⏱ ${tempoRestante}`;
    timerDisplay.classList.toggle('timer-urgente', tempoRestante > 0 && tempoRestante <= 3);

    intervaloTimer = setInterval(() => {
        tempoRestante = calcularTempoRestante();
        timerDisplay.innerText = `⏱ ${tempoRestante}`;
        timerDisplay.classList.toggle('timer-urgente', tempoRestante > 0 && tempoRestante <= 3);
        if (isProfessor && tempoRestante > 0 && tempoRestante <= 3) tocarSomTick();
        if (tempoRestante <= 0) {
            clearInterval(intervaloTimer);
            if (!isProfessor) bloquearBotoes(null, respostaCorreta);
            // Antes, só a aba do professor podia fechar a rodada. Se ela ficasse
            // muito tempo em segundo plano, o jogo podia travar esperando um
            // callback que demorava a disparar. Agora QUALQUER cliente (professor
            // ou aluno) que perceber que o tempo acabou tenta fechar a rodada —
            // a trava dentro de calcularFimDeRodada garante que só um deles
            // realmente processe o resultado, mesmo que vários tentem juntos.
            setTimeout(calcularFimDeRodada, 2000);
        }
    }, 1000);
}

function enviarResposta(escolha, correta, btnClicado) {
    clearInterval(intervaloTimer);
    bloquearBotoes(btnClicado, correta);
    const acertou = (escolha === correta);
    const refRespostas = db.ref(`salas/${codigoSalaAtual}/respostasRodada`);
    // Marca este aluno como "já respondeu" para não permitir responder de novo
    // se ele der refresh na página durante a mesma rodada.
    refRespostas.child(`jogadoresRespondidos/${meuId}`).set(true);
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
        // Comparamos por data-answer (o valor real da alternativa), não por
        // innerText — agora que o botão também tem um selo de letra (A/B/C/D)
        // dentro dele, innerText incluiria esse selo e nunca bateria certo.
        if (b.dataset.answer === correta) b.classList.add('answer-tile-correct');
    });
    if (btnClicado && btnClicado.dataset.answer !== correta) btnClicado.classList.add('answer-tile-incorrect');
}

function calcularFimDeRodada() {
    // Trava atômica: só o primeiro cliente que conseguir marcar "processando = true"
    // (professor ou aluno, tanto faz) segue em frente. Os demais desistem sem
    // fazer nada, evitando que a mesma rodada seja fechada duas vezes.
    const refTrava = db.ref('salas/' + codigoSalaAtual + '/processandoFimRodada');
    refTrava.transaction((atual) => {
        if (atual) return; // alguém já está processando esta rodada
        return true;
    }).then((resultado) => {
        if (!resultado.committed) return; // não conseguiu a trava — outro cliente já está cuidando disso
        processarFimDeRodada();
    }).catch((erro) => {
        console.error('Erro ao tentar fechar a rodada:', erro);
    });
}

function processarFimDeRodada() {
    db.ref('salas/' + codigoSalaAtual).once('value').then(snapshot => {
        const sala = snapshot.val();
        // Se a sala não existe mais, ou a rodada já não está mais "jogando"
        // (outro cliente já fechou antes da nossa trava ser confirmada, num
        // instante de corrida bem apertado), não há nada a fazer.
        if (!sala || sala.status !== 'jogando') return;
        const res = sala.respostasRodada || {};
        const acertosA = res.acertosAzul || 0;
        const acertosV = res.acertosVermelha || 0;
        const respA = res.respondidosAzul || 0;
        const respV = res.respondidosVermelha || 0;

        // Antes a corda se movia pela diferença BRUTA de acertos, o que dava vantagem
        // estrutural ao time com mais alunos (mais gente respondendo = mais acertos
        // absolutos, mesmo com desempenho proporcional pior). Agora usamos a TAXA de
        // acerto de cada time, que é justa independente do tamanho das equipes.
        const taxaAzul = respA > 0 ? acertosA / respA : 0;
        const taxaVermelha = respV > 0 ? acertosV / respV : 0;
        const ESCALA_MOVIMENTO_CORDA = 2; // ajuste fino: quanto a corda se move por rodada
        const diferenca = (taxaAzul - taxaVermelha) * ESCALA_MOVIMENTO_CORDA;
        
        const maxJogadoresPorEquipe = Math.max(
            sala.jogadores && sala.jogadores.azul ? Object.keys(sala.jogadores.azul).length : 0,
            sala.jogadores && sala.jogadores.vermelha ? Object.keys(sala.jogadores.vermelha).length : 0
        );
        let questoesUsadas = [];
        for(let i = 0; i < maxJogadoresPorEquipe; i++) {
            // CORREÇÃO AQUI: Removemos o * 10 para acompanhar a correção do aluno
            let idx = ((sala.rodadaAtual - 1) + i) % sala.questoes.length;
            if(sala.questoes[idx]) {
                let p = sala.questoes[idx].pergunta;
                if(!questoesUsadas.includes(p)) questoesUsadas.push(p);
            }
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
        if (diferenca !== 0) { document.querySelector('.tug-of-war-container').classList.add('shake-animation'); tocarSomPuxadaCorda(); }
        atualizarCorda(novaPosicao);

        setTimeout(() => {
            document.querySelector('.tug-of-war-container').classList.remove('shake-animation');
            const updates = {
                posicaoCorda: novaPosicao, vitoriasAzul: sala.vitoriasAzul + acertosA, vitoriasVermelha: sala.vitoriasVermelha + acertosV,
                respostasRodada: { acertosAzul: 0, acertosVermelha: 0, respondidosAzul: 0, respondidosVermelha: 0 },
                status: statusPartida, vencedor: vencedor,
                processandoFimRodada: false
            };
            if (statusPartida === 'jogando') {
                updates.rodadaAtual = sala.rodadaAtual + 1;
                updates.tempoFimRodada = Date.now() + serverTimeOffset + DURACAO_RODADA_MS;
            }
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
    // O jogo terminou normalmente — cancela os gatilhos de onDisconnect para que
    // fechar a aba agora não tente "cancelar" uma sala ou remover um jogador
    // de uma partida que já acabou de verdade.
    if (isProfessor) db.ref('salas/' + codigoSalaAtual).onDisconnect().cancel();
    else if (refMeuJogador) refMeuJogador.onDisconnect().cancel();
    document.getElementById('team-status-container').style.display = 'none'; 
    roundInfo.innerText = "Fim de Jogo!";
    optionsDiv.innerHTML = '';
    timerDisplay.innerText = '';
    localStorage.removeItem('caboDeGuerraSessao');
    
    if (vencedor && vencedor !== 'Empate') { dispararConfetes(); if (isProfessor) tocarSomVitoria(); }
    questionText.innerHTML = `<h2 style="margin:0;">🏆 ${vencedor === 'Empate' ? 'O jogo terminou empatado!' : 'A ' + vencedor + ' venceu!'}</h2>`;
    
    if (isProfessor) {
        const relatorioDiv = document.createElement('div');
        relatorioDiv.style.cssText = "margin-top: 20px; padding: 20px; background-color: var(--paper); border-radius: var(--radius-md); text-align: left;";
        let htmlRelatorio = `<h3 style="margin-top:0; color: var(--ink); border-bottom: 2px solid var(--line); padding-bottom: 10px;">📊 Relatório da Turma</h3><ul style="list-style:none; padding:0; margin:0;">`;
        historicoRodadas.forEach(rod => {
            let taxa = rod.respostas > 0 ? Math.round((rod.acertos / rod.respostas) * 100) : 0;
            let cor = taxa >= 70 ? 'var(--turf)' : (taxa >= 40 ? 'var(--amber-deep)' : 'var(--red)');
            let htmlQuestoes = rod.questoes.map(q => `<li style="margin-bottom: 5px;">${escapeHTML(q)}</li>`).join('');
            if (rod.questoes.length === 0) htmlQuestoes = "<li>Nenhuma questão foi enviada.</li>";
            htmlRelatorio += `
            <li style="margin-bottom:12px; font-size:16px; color: var(--ink-soft); font-weight: 600; background: var(--surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--ink);">Rodada ${rod.rodada}:</strong> 
                    <div><span style="font-size: 14px;">${rod.acertos} de ${rod.respostas} acertos</span><span style="color: white; background: ${cor}; padding: 4px 10px; border-radius: var(--radius-pill); font-size: 14px; margin-left: 10px; font-family: var(--font-display); font-weight: 700;">${taxa}%</span></div>
                </div>
                <details style="margin-top: 10px; font-size: 14px;">
                    <summary style="cursor: pointer; color: var(--info); font-weight: 700;">Ver questões trabalhadas</summary>
                    <ul style="margin-top: 8px; padding-left: 20px; color: var(--ink);">${htmlQuestoes}</ul>
                </details>
            </li>`;
        });
        htmlRelatorio += `</ul>`;
        relatorioDiv.innerHTML = htmlRelatorio;
        optionsDiv.appendChild(relatorioDiv);
        const btnVoltar = document.createElement('button');
        btnVoltar.innerText = "Voltar ao Menu Principal";
        btnVoltar.className = 'btn btn-slate btn-block';
        btnVoltar.style.marginTop = '20px';
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