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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const somTick = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const somPuxadaCorda = new Audio('https://actions.google.com/sounds/v1/sports/slide_whistle_to_drum.ogg');
const somVitoria = new Audio('https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg');
somVitoria.volume = 0.6;

// --- VARIÁVEIS DE MULTIPLAYER ---
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

// ==========================================
// 2. ELEMENTOS DO DOM
// ==========================================
const roleScreen = document.getElementById('role-screen');
const studentScreen = document.getElementById('student-screen');
const setupScreen = document.getElementById('setup-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const gameScreen = document.getElementById('game-screen');

document.getElementById('btn-show-student').onclick = () => mudarTela(studentScreen);
document.getElementById('btn-show-teacher').onclick = () => mudarTela(setupScreen);
document.getElementById('btn-back-role-1').onclick = () => mudarTela(roleScreen);
document.getElementById('btn-back-role-2').onclick = () => mudarTela(roleScreen);

function mudarTela(telaAtiva) {
    roleScreen.classList.add('hidden');
    studentScreen.classList.add('hidden');
    setupScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    telaAtiva.classList.remove('hidden');
}

// ==========================================
// 3. MENU DE CONFIGURAÇÃO (PROFESSOR)
// ==========================================
const selSubject = document.getElementById('sel-subject');
const selTopic = document.getElementById('sel-topic');
const selDifficulty = document.getElementById('sel-difficulty');
const selRounds = document.getElementById('sel-rounds');

function carregarMenu() {
    popularSelect(selSubject, Object.keys(bancoDeQuestoes));
    atualizarTopicos(); 
}
function atualizarTopicos() {
    popularSelect(selTopic, Object.keys(bancoDeQuestoes[selSubject.value]));
    atualizarDificuldades();
}
function atualizarDificuldades() {
    popularSelect(selDifficulty, Object.keys(bancoDeQuestoes[selSubject.value][selTopic.value]));
}
function popularSelect(el, opcoes) {
    el.innerHTML = '';
    opcoes.forEach(op => el.innerHTML += `<option value="${op}">${op}</option>`);
}

selSubject.addEventListener('change', atualizarTopicos);
selTopic.addEventListener('change', atualizarDificuldades);
carregarMenu();

document.getElementById('btn-create-room').addEventListener('click', () => {
    isProfessor = true;
    totalRodadas = parseInt(selRounds.value);
    historicoRodadas = []; 
    
    const poolDeQuestoes = bancoDeQuestoes[selSubject.value][selTopic.value][selDifficulty.value];
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
// 4. LÓGICA DO ALUNO (ENTRAR E RECONECTAR)
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
        
        localStorage.setItem('caboDeGuerraSessao', JSON.stringify({
            codigoSala: codigoSalaAtual,
            id: meuId,
            nome: meuNome,
            equipe: minhaEquipe
        }));
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

                    if (sala.status === 'lobby') {
                        mudarTela(lobbyScreen);
                    } else if (sala.status === 'jogando') {
                        rodadaAtualLocal = sala.rodadaAtual;
                        mudarTela(gameScreen);
                        renderizarRodada(sala.rodadaAtual, sala.questoes);
                    }
                } else {
                    localStorage.removeItem('caboDeGuerraSessao');
                }
            } else {
                localStorage.removeItem('caboDeGuerraSessao');
            }
        });
    }
}
verificarReconexao();

// ==========================================
// 5. ESCUTAS MULTIPLAYER (LOBBY E JOGO)
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
    const salaRef = db.ref('salas/' + codigoSalaAtual);
    
    salaRef.on('value', (snapshot) => {
        const sala = snapshot.val();
        if (!sala) return;

        if (sala.status === 'jogando' && sala.rodadaAtual !== rodadaAtualLocal) {
            rodadaAtualLocal = sala.rodadaAtual;
            mudarTela(gameScreen);
            
            document.getElementById('score-blue').innerText = sala.vitoriasAzul;
            document.getElementById('score-red').innerText = sala.vitoriasVermelha;
            
            atualizarCorda(sala.posicaoCorda);
            renderizarRodada(sala.rodadaAtual, sala.questoes);
        }
        
        if (sala.status === 'finalizado') {
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

// ==========================================
// 6. RENDERIZAÇÃO DA ARENA E RESPOSTAS
// ==========================================
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
                btn.style.transition = "all 0.2s";
                
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
        
        if (isProfessor && tempoRestante > 0 && tempoRestante <= 3) {
            somTick.play().catch(e => {});
        }
        
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
        if (b.innerText === correta) {
            b.style.backgroundColor = "#2ed573"; 
            b.style.color = "white";
            b.style.borderColor = "#2ed573";
        }
    });
    if (btnClicado && btnClicado.innerText !== correta) {
        btnClicado.style.backgroundColor = "#ff4757"; 
        btnClicado.style.color = "white";
        btnClicado.style.borderColor = "#ff4757";
    }
}

// ==========================================
// 7. O PROFESSOR (JUIZ) CALCULA O RESULTADO
// ==========================================
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
        
        // NOVIDADE: Descobrindo quais questões exatas foram enviadas para os alunos nesta rodada
        const maxJogadoresPorEquipe = Math.max(
            sala.jogadores && sala.jogadores.azul ? Object.keys(sala.jogadores.azul).length : 0,
            sala.jogadores && sala.jogadores.vermelha ? Object.keys(sala.jogadores.vermelha).length : 0
        );
        
        let questoesUsadas = [];
        for(let i = 0; i < maxJogadoresPorEquipe; i++) {
            let idx = ((sala.rodadaAtual - 1) * 10 + i) % sala.questoes.length;
            if(sala.questoes[idx]) {
                questoesUsadas.push(sala.questoes[idx].pergunta);
            }
        }

        historicoRodadas.push({
            rodada: sala.rodadaAtual,
            acertos: acertosA + acertosV,
            respostas: respA + respV,
            questoes: questoesUsadas
        });

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
        
        if (diferenca !== 0) {
            document.querySelector('.tug-of-war-container').classList.add('shake-animation');
            somPuxadaCorda.play().catch(e => {});
        }
        
        atualizarCorda(novaPosicao);

        setTimeout(() => {
            document.querySelector('.tug-of-war-container').classList.remove('shake-animation');
            
            const updates = {
                posicaoCorda: novaPosicao,
                vitoriasAzul: sala.vitoriasAzul + acertosA,
                vitoriasVermelha: sala.vitoriasVermelha + acertosV,
                respostasRodada: { acertosAzul: 0, acertosVermelha: 0, respondidosAzul: 0, respondidosVermelha: 0 },
                status: statusPartida,
                vencedor: vencedor
            };
            
            if (statusPartida === 'jogando') {
                updates.rodadaAtual = sala.rodadaAtual + 1; 
            }
            
            db.ref('salas/' + codigoSalaAtual).update(updates);
        }, 3000);
    });
}

function atualizarCorda(posicao) {
    const porcentagem = 50 + (posicao * 8);
    document.getElementById('knot').style.left = `${porcentagem}%`;
}

// ==========================================
// 8. TELA FINAL E RELATÓRIO
// ==========================================
function finalizarPartidaVisual(vencedor, posicaoCorda) {
    clearInterval(intervaloTimer);
    document.getElementById('team-status-container').style.display = 'none'; 
    roundInfo.innerText = "Fim de Jogo!";
    optionsDiv.innerHTML = '';
    timerDisplay.innerText = '';
    
    localStorage.removeItem('caboDeGuerraSessao');
    
    if (vencedor && vencedor !== 'Empate') {
        dispararConfetes();
        if (isProfessor) {
            somVitoria.play().catch(e => {}); 
        }
    }
    
    questionText.innerHTML = `<h2>🏆 ${vencedor === 'Empate' ? 'O jogo terminou empatado!' : 'A ' + vencedor + ' venceu!'}</h2>`;
    
    // NOVIDADE: O Professor agora pode ver as questões exatas que caíram em cada rodada
    if (isProfessor) {
        const relatorioDiv = document.createElement('div');
        relatorioDiv.style.marginTop = "20px";
        relatorioDiv.style.padding = "20px";
        relatorioDiv.style.backgroundColor = "#f8f9fa";
        relatorioDiv.style.borderRadius = "12px";
        relatorioDiv.style.textAlign = "left";
        relatorioDiv.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05)";
        
        let htmlRelatorio = `<h3 style="margin-top:0; color:#2f3542; border-bottom: 2px solid #dfe4ea; padding-bottom: 10px;">📊 Relatório da Turma</h3>`;
        htmlRelatorio += `<ul style="list-style:none; padding:0; margin:0;">`;
        
        historicoRodadas.forEach(rod => {
            let taxa = rod.respostas > 0 ? Math.round((rod.acertos / rod.respostas) * 100) : 0;
            let cor = taxa >= 70 ? '#2ed573' : (taxa >= 40 ? '#ffa502' : '#ff4757');
            
            // Monta os itens da lista de questões
            let htmlQuestoes = rod.questoes.map(q => `<li style="margin-bottom: 5px;">${q}</li>`).join('');
            if (rod.questoes.length === 0) htmlQuestoes = "<li>Nenhuma questão foi enviada.</li>";
            
            htmlRelatorio += `
            <li style="margin-bottom:12px; font-size:16px; color: #57606f; background: white; padding: 12px; border-radius: 8px; border: 1px solid #dfe4ea;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>Rodada ${rod.rodada}:</strong> 
                    <div>
                        <span style="font-size: 14px;">${rod.acertos} de ${rod.respostas} acertos</span>
                        <span style="color: white; background: ${cor}; padding: 4px 10px; border-radius: 12px; font-size: 14px; margin-left: 10px; font-weight: bold;">${taxa}%</span>
                    </div>
                </div>
                <details style="margin-top: 10px; font-size: 14px;">
                    <summary style="cursor: pointer; color: #007bff; font-weight: bold; outline: none;">Ver questões trabalhadas</summary>
                    <ul style="margin-top: 8px; padding-left: 20px; color: #2f3542;">
                        ${htmlQuestoes}
                    </ul>
                </details>
            </li>`;
        });
        
        htmlRelatorio += `</ul>`;
        relatorioDiv.innerHTML = htmlRelatorio;
        optionsDiv.appendChild(relatorioDiv);

        const btnVoltar = document.createElement('button');
        btnVoltar.innerText = "Voltar ao Menu Principal";
        btnVoltar.style.marginTop = "20px"; 
        btnVoltar.style.padding = "15px";
        btnVoltar.style.fontSize = "16px";
        btnVoltar.style.fontWeight = "bold";
        btnVoltar.style.borderRadius = "8px";
        btnVoltar.style.cursor = "pointer";
        btnVoltar.style.backgroundColor = "#57606f";
        btnVoltar.style.color = "white";
        btnVoltar.style.border = "none";
        btnVoltar.style.width = "100%";
        btnVoltar.onclick = () => location.reload(); 
        optionsDiv.appendChild(btnVoltar);
    }
}

function dispararConfetes() {
    const emojis = ['🎉', '✨', '🎊', '🏆'];
    for(let i = 0; i < 40; i++) {
        const confete = document.createElement('div');
        confete.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        confete.style.position = 'fixed';
        confete.style.left = Math.random() * 100 + 'vw';
        confete.style.top = '-50px';
        confete.style.fontSize = (Math.random() * 20 + 15) + 'px';
        confete.style.zIndex = '9999';
        confete.style.pointerEvents = 'none';
        confete.style.transition = 'top 3s linear, left 3s ease-in-out';
        document.body.appendChild(confete);
        setTimeout(() => { confete.style.top = '100vh'; confete.style.left = (Math.random() * 100) + 'vw'; }, 50);
        setTimeout(() => confete.remove(), 3000);
    }
}