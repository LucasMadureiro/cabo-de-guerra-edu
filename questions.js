// questions.js

// 1. Estrutura vazia inicial
const bancoDeQuestoes = {
    "Matemática": {
        "Adição": { "Fácil": [], "Médio": [], "Difícil": [] },
        "Subtração": { "Fácil": [], "Médio": [], "Difícil": [] },
        "Multiplicação": { "Fácil": [], "Médio": [], "Difícil": [] },
        "Divisão": { "Fácil": [], "Médio": [], "Difícil": [] },
        "Equação": { "Fácil": [], "Médio": [], "Difícil": [] }
    }
};

// 2. Funções auxiliares para matemática
// Gera número aleatório entre min e max
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gera 3 alternativas incorretas próximas ao valor correto
function gerarAlternativas(correta, variacao) {
    let alts = new Set([correta.toString()]);
    let tentativas = 0;
    
    while(alts.size < 4 && tentativas < 100) {
        // Cria uma pegadinha somando ou subtraindo um valor aleatório
        let erro = correta + rand(-variacao, variacao);
        if(erro !== correta && erro >= 0) { // Evita alternativas negativas para facilitar
            alts.add(erro.toString());
        }
        tentativas++;
    }
    
    // Garantia de segurança (caso não gere 4 alternativas, ele força a criação)
    let extra = 1;
    while(alts.size < 4) {
        if (!alts.has((correta + extra).toString())) alts.add((correta + extra).toString());
        extra++;
    }
    
    // Embaralha as alternativas para a correta não ficar sempre no mesmo lugar
    return Array.from(alts).sort(() => Math.random() - 0.5);
}

// 3. O GERADOR: Cria 50 questões para CADA dificuldade de CADA conteúdo
const QUANTIDADE = 50;

for (let i = 0; i < QUANTIDADE; i++) {
    
    // ==========================================
    // ADIÇÃO
    // ==========================================
    // Fácil (1 a 20)
    let aF = rand(1, 20), bF = rand(1, 20);
    bancoDeQuestoes["Matemática"]["Adição"]["Fácil"].push({
        pergunta: `Quanto é ${aF} + ${bF}?`, resposta: (aF + bF).toString(), alternativas: gerarAlternativas(aF + bF, 10)
    });

    // Médio (20 a 100)
    let aM = rand(20, 100), bM = rand(20, 100);
    bancoDeQuestoes["Matemática"]["Adição"]["Médio"].push({
        pergunta: `Quanto é ${aM} + ${bM}?`, resposta: (aM + bM).toString(), alternativas: gerarAlternativas(aM + bM, 20)
    });

    // Difícil (100 a 999)
    let aD = rand(100, 999), bD = rand(100, 999);
    bancoDeQuestoes["Matemática"]["Adição"]["Difícil"].push({
        pergunta: `Quanto é ${aD} + ${bD}?`, resposta: (aD + bD).toString(), alternativas: gerarAlternativas(aD + bD, 50)
    });


    // ==========================================
    // SUBTRAÇÃO (Garantindo que o 1º número seja maior)
    // ==========================================
    let sA_F = rand(10, 30), sB_F = rand(1, sA_F);
    bancoDeQuestoes["Matemática"]["Subtração"]["Fácil"].push({
        pergunta: `Quanto é ${sA_F} - ${sB_F}?`, resposta: (sA_F - sB_F).toString(), alternativas: gerarAlternativas(sA_F - sB_F, 10)
    });

    let sA_M = rand(50, 200), sB_M = rand(10, sA_M);
    bancoDeQuestoes["Matemática"]["Subtração"]["Médio"].push({
        pergunta: `Quanto é ${sA_M} - ${sB_M}?`, resposta: (sA_M - sB_M).toString(), alternativas: gerarAlternativas(sA_M - sB_M, 20)
    });

    let sA_D = rand(300, 1500), sB_D = rand(50, sA_D);
    bancoDeQuestoes["Matemática"]["Subtração"]["Difícil"].push({
        pergunta: `Quanto é ${sA_D} - ${sB_D}?`, resposta: (sA_D - sB_D).toString(), alternativas: gerarAlternativas(sA_D - sB_D, 50)
    });


    // ==========================================
    // MULTIPLICAÇÃO
    // ==========================================
    let mF1 = rand(2, 10), mF2 = rand(2, 10);
    bancoDeQuestoes["Matemática"]["Multiplicação"]["Fácil"].push({
        pergunta: `Quanto é ${mF1} × ${mF2}?`, resposta: (mF1 * mF2).toString(), alternativas: gerarAlternativas(mF1 * mF2, 15)
    });

    let mM1 = rand(5, 15), mM2 = rand(5, 15);
    bancoDeQuestoes["Matemática"]["Multiplicação"]["Médio"].push({
        pergunta: `Quanto é ${mM1} × ${mM2}?`, resposta: (mM1 * mM2).toString(), alternativas: gerarAlternativas(mM1 * mM2, 30)
    });

    let mD1 = rand(11, 30), mD2 = rand(11, 30);
    bancoDeQuestoes["Matemática"]["Multiplicação"]["Difícil"].push({
        pergunta: `Quanto é ${mD1} × ${mD2}?`, resposta: (mD1 * mD2).toString(), alternativas: gerarAlternativas(mD1 * mD2, 100)
    });


    // ==========================================
    // DIVISÃO (Criando a partir da multiplicação para dar número inteiro)
    // ==========================================
    // Fácil (Resultados e divisores de 2 a 10)
    let dF_res = rand(2, 10), dF_div = rand(2, 10);
    let dF_total = dF_res * dF_div;
    bancoDeQuestoes["Matemática"]["Divisão"]["Fácil"].push({
        pergunta: `Quanto é ${dF_total} ÷ ${dF_div}?`, resposta: dF_res.toString(), alternativas: gerarAlternativas(dF_res, 5)
    });

    // Médio (Resultados de 2 a 20, divisores de 5 a 15)
    let dM_res = rand(2, 20), dM_div = rand(5, 15);
    let dM_total = dM_res * dM_div;
    bancoDeQuestoes["Matemática"]["Divisão"]["Médio"].push({
        pergunta: `Quanto é ${dM_total} ÷ ${dM_div}?`, resposta: dM_res.toString(), alternativas: gerarAlternativas(dM_res, 10)
    });

    // Difícil (Resultados de 11 a 50, divisores de 11 a 30)
    let dD_res = rand(11, 50), dD_div = rand(11, 30);
    let dD_total = dD_res * dD_div;
    bancoDeQuestoes["Matemática"]["Divisão"]["Difícil"].push({
        pergunta: `Quanto é ${dD_total} ÷ ${dD_div}?`, resposta: dD_res.toString(), alternativas: gerarAlternativas(dD_res, 20)
    });


    // ==========================================
    // EQUAÇÃO (Descubra o valor de X)
    // ==========================================
    // Fácil: x + a = b
    let eqF_x = rand(1, 20), eqF_a = rand(1, 20);
    let eqF_b = eqF_x + eqF_a;
    bancoDeQuestoes["Matemática"]["Equação"]["Fácil"].push({
        pergunta: `Qual o valor de 'x' em: x + ${eqF_a} = ${eqF_b}?`, resposta: eqF_x.toString(), alternativas: gerarAlternativas(eqF_x, 8)
    });

    // Médio: a * x = b
    let eqM_x = rand(2, 15), eqM_a = rand(2, 10);
    let eqM_b = eqM_a * eqM_x;
    bancoDeQuestoes["Matemática"]["Equação"]["Médio"].push({
        pergunta: `Qual o valor de 'x' em: ${eqM_a}x = ${eqM_b}?`, resposta: eqM_x.toString(), alternativas: gerarAlternativas(eqM_x, 10)
    });

    // Difícil: a * x + b = c
    let eqD_x = rand(2, 20), eqD_a = rand(2, 12), eqD_b = rand(1, 20);
    let eqD_c = (eqD_a * eqD_x) + eqD_b;
    bancoDeQuestoes["Matemática"]["Equação"]["Difícil"].push({
        pergunta: `Qual o valor de 'x' em: ${eqD_a}x + ${eqD_b} = ${eqD_c}?`, resposta: eqD_x.toString(), alternativas: gerarAlternativas(eqD_x, 15)
    });
}