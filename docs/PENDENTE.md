# O que falta

Lista do que ainda precisa ser feito no Encaixe. O Knapsack fracionário, os formulários e a animação passo a passo já estão prontos. Faltam duas partes: uma de algoritmo e uma visual.

## 1. Comparar critérios gulosos

**Objetivo**: mostrar na tela por que ordenar pela razão prioridade/minuto é a escolha certa, comparando com outros critérios gulosos para as mesmas tarefas.

**Onde**:

- Algoritmo: `src/lib/knapsack/fractional.ts`
- Tela: novo componente, por exemplo `src/components/CompareCriteria.tsx`, usado em `src/components/Planner.tsx`

Checklist:

- [ ] Em `fractional.ts`, deixar a função de ordenação configurável. Hoje ela é fixa em `compareByRatio`. Sugestão: `solveFractional(tasks, capacity, criterion)` com `criterion` sendo `"ratio"` (padrão atual), `"priority"` (maior prioridade primeiro) ou `"shortest"` (tarefa mais curta primeiro).
- [ ] Ajustar as mensagens dos passos `ratios` e `sort` para citar o critério usado.
- [ ] Na tela, rodar os três critérios e mostrar um cartão por critério com a `DayBar` (`src/components/DayBar.tsx`) e o valor total.
- [ ] Destacar o critério vencedor. Pela teoria, a razão sempre empata ou ganha.
- [ ] Um texto curto explicando o argumento de troca: trocar um minuto de uma tarefa de razão maior por um minuto de uma tarefa de razão menor nunca aumenta o valor.

Para conferir, no exemplo (botão "Carregar exemplo", 5h30 livres):

| Critério | Valor esperado |
| -------- | -------------- |
| Razão (atual) | 27 (Slides, E-mails, Grafos e 80% do Projeto) |
| Maior prioridade | 26 (Projeto, Grafos e Slides) |
| Mais curta | 22,75 (E-mails, Slides, Livro, Academia e 75% de Grafos) |

Usem esses valores para conferir a implementação.

## 2. Agenda com horários

**Objetivo**: transformar o resultado em uma agenda de verdade, com horário de início e fim de cada tarefa.

**Onde**: `src/components/DayCard.tsx`, `src/components/ResultSummary.tsx` e um novo componente, por exemplo `src/components/Timeline.tsx`.

Checklist:

- [ ] Adicionar em `DayCard` um campo "Começo do dia" (`<input type="time">`, padrão 08:00) e guardar o valor num estado em `Planner`.
- [ ] A partir de `result.allocations` (já vem na ordem em que o algoritmo escolheu), calcular início e fim de cada tarefa. A tarefa parcial usa `allocation.minutes`, não a duração inteira.
- [ ] Criar a `Timeline`: lista vertical com o horário à esquerda e um bloco da cor da tarefa (`colorOf(id)`) com altura proporcional à duração.
- [ ] Mostrar a `Timeline` no último passo da animação (`step.kind === "done"`), junto do `ResultSummary`.
- [ ] (Opcional) Botão para copiar a agenda como texto, no formato `08:00 - 09:00 Revisar slides de PA`.

## Como testar

1. `npm install` e `npm run dev`.
2. Clique em "Carregar exemplo" e depois em "Rodar algoritmo".
3. O passo a passo esperado do exemplo está no README, na seção "Exemplo".
