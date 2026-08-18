# Cabo de Guerra Educacional #

Um jogo multiplayer em tempo real projetado para transformar o ambiente de sala de aula, gamificando revisões de conteúdo por meio de uma competição saudável e engajadora. 

O sistema permite que o professor crie salas virtuais, gerencie questões na nuvem e acompanhe o desempenho da turma, enquanto os alunos respondem a perguntas nos próprios celulares para puxar a "corda" virtual para sua equipe.

Acesso: https://lucasmadureiro.github.io/cabo-de-guerra-edu/

## Principais Funcionalidades ##

*   **Multiplayer em Tempo Real:** Sincronização instantânea de respostas, placar e animações da corda entre o painel do professor e os dispositivos dos alunos, utilizando arquitetura orientada a eventos.
*   **Design Pedagógico e Anti-Cola:** O sistema distribui perguntas diferentes para membros da mesma equipe dentro da mesma rodada, dificultando a cópia e garantindo que o progresso seja fruto do conhecimento do grupo.
*   **Gerenciamento de Questões na Nuvem:** Uma interface dedicada (CRUD) para o professor criar, editar e excluir questões diretamente na nuvem, organizadas hierarquicamente por *Disciplina > Assunto > Dificuldade*.
*   **Tolerância a Falhas (Auto-Reconnect):** Sistema de cache inteligente com `localStorage` que reconecta alunos automaticamente à partida em andamento caso a internet caia ou o navegador seja fechado acidentalmente.
*   **Relatório de Desempenho:** Ao final da partida, o professor recebe um relatório expandível (estilo sanfona) detalhando a taxa de acerto por rodada e as exatas questões que foram enviadas aos alunos.

## Tecnologias Utilizadas ##

Este projeto foi construído com foco em leveza, responsividade e execução diretamente no navegador, sem necessidade de servidores complexos.

*   **HTML5 & CSS3:** Estrutura semântica e interface mobile-first com design em cards.
*   **JavaScript (Vanilla):** Lógica de estado do jogo, manipulação do DOM e controle de tempo.
*   **Firebase Realtime Database:** Backend como serviço (BaaS) para comunicação WebSocket, persistência do banco de questões global e sincronização de salas virtuais.

## Como Executar e Hospedar ##

### Rodando Localmente
1. Clone este repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. Não é necessário instalar dependências via terminal (o Firebase é importado via CDN).

### Deploy na Nuvem (Recomendado)
Para aplicar o jogo na prática com os alunos via 4G ou Wi-Fi, hospede os arquivos em um servidor público. O **GitHub Pages** é a escolha natural e gratuita para este tipo de repositório web estático, mantendo o mesmo fluxo prático de publicação utilizado no lançamento de ferramentas como geradores de horários acadêmicos.
Basta ativar o Pages nas configurações do seu repositório apontando para a branch principal.

## Como Usar na Sala de Aula ##

O jogo é uma excelente ferramenta prática para validação de aprendizado, sendo perfeito para o encerramento de um plano de aula estruturado de Pensamento Computacional, Lógica ou Matemática.

1. **O Professor** acessa o site pelo notebook, seleciona as configurações da partida (disciplina, rodadas) e projeta o código gerado no quadro.
2. **Os Alunos** acessam o site pelo celular, escolhem a Equipe Azul ou Vermelha e inserem o código da sala.
3. A cada rodada, os alunos têm 15 segundos para responder. Cada acerto puxa o nó da corda para o lado da equipe correspondente.
4. O áudio do jogo fica focado no dispositivo do professor (projetor/caixa de som da sala), mantendo o feedback individual nos celulares silencioso para preservar o conforto dos alunos em caso de erro.

## Autor ##

**Lucas Madureiro Matias**  
Graduando em Licenciatura em Computação | Universidade Federal Rural de Pernambuco (UFRPE)
