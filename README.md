# Encaixe

**Número da Lista**: G25<br>
**Conteúdo da Disciplina**: Algoritmos Gulosos (Greedy)<br>

## Alunos

| Matrícula | Aluno |
| --------- | ----- |
| 232027494 | Júlia Santana Campos |
| xx/xxxxxxx | Nome do aluno 2 |

## Sobre

O Encaixe é um planejador de tarefas para um único dia. A pessoa escolhe o dia, informa quanto tempo tem livre (ou reservado) para trabalhar e cadastra as tarefas que gostaria de fazer. Cada tarefa tem um nome, uma duração em horas e minutos e uma prioridade de 1 a 10, em que o número maior indica a tarefa mais urgente.

Quase sempre a soma das tarefas passa do tempo disponível. Decidir o que entra no dia é uma instância do **problema da mochila (Knapsack)**:

| Mochila | Encaixe |
| ------- | ------- |
| Capacidade da mochila | Tempo livre no dia, em minutos |
| Item | Tarefa |
| Peso do item | Duração da tarefa, em minutos |
| Valor do item | Prioridade da tarefa (1 a 10) |
| Objetivo | Maximizar a soma das prioridades sem passar do tempo livre |

O app resolve o problema com o **Knapsack fracionário**, um algoritmo guloso, e mostra cada passo na tela com controles de reproduzir, pausar, avançar e voltar. Na versão fracionária uma tarefa pode ser feita em parte: se sobram 40 minutos e a próxima tarefa leva 1 hora, o algoritmo sugere fazer 67% dela.

## Como usar

1. **Escolha o dia**: selecione a data e o tempo livre (horas e minutos). Esse tempo é a capacidade da mochila.
2. **Liste as tarefas**: preencha nome, duração e prioridade e clique em "Adicionar tarefa". O botão "Carregar exemplo" preenche um dia pronto para testar.
3. **Rode o algoritmo**: clique em "Rodar algoritmo".
4. **Acompanhe o passo a passo**: use "Reproduzir" para animar ou "Avançar" e "Voltar" para ir no seu ritmo. A barra "Seu dia" mostra o tempo sendo ocupado. No último passo aparece a agenda sugerida, com as tarefas que ficaram para outro dia.

## O algoritmo

### Knapsack

Arquivo: [`src/lib/knapsack/fractional.ts`](src/lib/knapsack/fractional.ts)

A ideia gulosa é gastar cada minuto na tarefa que entrega mais prioridade por minuto.

```
para cada tarefa t:
    razao[t] = prioridade[t] / minutos[t]

ordenar tarefas pela razao, da maior para a menor
restante = capacidade

para cada tarefa t na ordem:
    se minutos[t] <= restante:
        pega t inteira
        restante -= minutos[t]
    senao:
        pega a fracao restante / minutos[t] de t
        restante = 0
```

Em caso de empate na razão, vence a tarefa com prioridade maior e, depois, a mais curta.

**Complexidade**: O(n log n), por causa da ordenação. O laço de preenchimento é O(n).

**Passos mostrados na tela**:

| Passo | O que acontece |
| ----- | -------------- |
| `start` | Mostra a capacidade e quantas tarefas existem |
| `ratios` | Preenche a coluna "Prioridade / min" |
| `sort` | Reordena a tabela pela razão |
| `consider` | Destaca a tarefa analisada |
| `take-full` | A tarefa entra inteira e aparece na barra do dia |
| `take-partial` | Só uma fração entra (bloco listrado na barra) |
| `skip` | Não sobrou tempo, a tarefa fica de fora |
| `done` | Mostra a agenda final e o valor total |


### Exemplo

O botão "Carregar exemplo" monta este dia com **5h30 livres** e **8h30 de tarefas**:

| Tarefa | Duração | Prioridade | Prioridade / min |
| ------ | ------- | ---------- | ---------------- |
| Lista de exercícios de grafos | 2h | 9 | 0,0750 |
| Revisar slides de PA | 1h | 7 | 0,1167 |
| Academia | 1h30 | 4 | 0,0444 |
| Responder e-mails | 30min | 3 | 0,1000 |
| Projeto da disciplina | 2h30 | 10 | 0,0667 |
| Ler um capítulo do livro | 1h | 2 | 0,0333 |

Ordem pela razão: Slides, E-mails, Grafos, Projeto, Academia, Livro.

| Passo | Tarefa | Entra | Tempo restante | Valor acumulado |
| ----- | ------ | ----- | -------------- | --------------- |
| 1 | Revisar slides de PA | 100% (1h) | 4h30 | 7 |
| 2 | Responder e-mails | 100% (30min) | 4h | 10 |
| 3 | Lista de exercícios de grafos | 100% (2h) | 2h | 19 |
| 4 | Projeto da disciplina | 80% (2h) | 0 | 27 |
| 5 | Academia | 0% | 0 | 27 |
| 6 | Ler um capítulo do livro | 0% | 0 | 27 |

Valor total: **27**, com as 5h30 ocupadas.

## Tecnologias

- [Next.js 15](https://nextjs.org/) com App Router
- React 19 e TypeScript
- Tailwind CSS 4
- Fonte Plus Jakarta Sans (via `next/font`)

Não há backend nem banco de dados. O algoritmo roda no navegador, numa função pura que recebe as tarefas e devolve o resultado junto com a lista de passos.

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx            # fonte, metadados e HTML base
│   ├── page.tsx              # página inicial
│   ├── globals.css           # tokens de cor e tema do Tailwind
│   └── icon.svg              # favicon
├── components/
│   ├── Planner.tsx           # estado da tela e orquestração
│   ├── DayCard.tsx           # passo 1: dia e tempo livre
│   ├── TaskForm.tsx          # passo 2: formulário de tarefa
│   ├── TaskList.tsx          # passo 2: lista de tarefas cadastradas
│   ├── StepControls.tsx      # reproduzir, pausar, avançar, voltar, velocidade
│   ├── DayBar.tsx            # a "mochila": barra do dia sendo ocupada
│   ├── FractionalView.tsx    # visualização do guloso fracionário
│   ├── ResultSummary.tsx     # agenda final e valor total
│   ├── Header.tsx
│   └── ui.tsx                # Card, Button, Field
├── hooks/
│   └── useStepPlayer.ts      # controla o índice do passo atual e o autoplay
└── lib/
    ├── knapsack/
    │   ├── types.ts          # Task, Allocation
    │   ├── fractional.ts     # guloso fracionário + passos
    │   └── index.ts
    ├── example.ts            # dia de exemplo
    ├── priority.ts           # cores e rótulos de prioridade
    └── time.ts               # conversão e formatação de minutos
```

### Como a visualização funciona

O algoritmo não sabe nada de interface. Enquanto executa, ele grava um **passo** a cada decisão importante. Cada passo é uma foto do estado naquele momento: mensagem explicativa, tarefa em destaque, tempo restante, o que já entrou na mochila.

A tela só guarda qual é o passo atual (`useStepPlayer`) e desenha a foto correspondente. Por isso voltar um passo é trivial, e o algoritmo roda uma única vez, quando você clica em "Rodar algoritmo".

```
Tarefas + capacidade
        │
        ▼
solveFractional   (função pura)
        │
        ▼
{ resultado, steps[] }
        │
        ▼
useStepPlayer (índice atual, play/pause)
        │
        ▼
FractionalView desenha steps[índice]
```

## Identidade visual

| Token | Cor | Uso |
| ----- | --- | --- |
| `canvas` | `#FAF9F5` | Fundo da página |
| `surface` | `#FFFFFF` | Cartões |
| `ink` | `#1F2A37` | Texto principal |
| `brand-500` | `#2F8F7A` | Verde-água, cor da marca e botões |
| `accent-400` | `#F2B84B` | Âmbar, destaque do passo atual |
| `danger-500` | `#D9534F` | Prioridade alta (8 a 10) |

O logo (`public/logo.svg`) mostra blocos de tamanhos diferentes encaixados dentro de uma caixa, como tarefas ocupando o dia. O bloco em âmbar representa a tarefa que entrou só em parte.

Prioridades têm três faixas de cor: 1 a 4 "Tranquila" (verde), 5 a 7 "Importante" (âmbar) e 8 a 10 "Urgente" (vermelho claro).

## Instalação

**Linguagem**: TypeScript<br>
**Framework**: Next.js<br>

Pré-requisitos: Node.js 20 ou superior e npm.

```bash
git clone git@github.com:projeto-de-algoritmos-2026/G25_Greedy_PA-26.2.git
cd G25_Greedy_PA-26.2
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run build      # build de produção
npm run start      # serve o build
npm run typecheck  # checagem de tipos
```

## Status do projeto

O que falta está descrito em [`docs/PENDENTE.md`](docs/PENDENTE.md).

## Referências

- KLEINBERG, Jon; TARDOS, Éva. *Algorithm Design*. Pearson, 2005. Capítulo 4 (algoritmos gulosos).
- CORMEN, Thomas H. et al. *Introduction to Algorithms*. 3. ed. MIT Press, 2009. Seção 16.2 (fractional knapsack).

## Licença

[MIT](LICENSE)
