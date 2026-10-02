# Sobra Grana — Plano de Negócio (6 meses)

> Versão 0.1 · 2026-10-02 · Preço: **R$ 19,90/mês**
> Base: `docs/market-research/2026-09-25-meu-assessor.md` e `docs/sobragrana/ARCHITECTURE.md` §8–9.
> As premissas estão marcadas como **(P)**. Os números de mercado são aproximados, vêm de fontes públicas e precisam ser validados antes de entrar num pitch.

---

## 1. Resumo

| Item | Resposta |
|---|---|
| Mercado de entrada | **Autônomos de renda variável da classe C**: motoristas de app, entregadores, diaristas, MEIs, vendedores informais |
| Como vender | WhatsApp first: conteúdo curto (TikTok/Reels/Kwai), anúncio que abre conversa no WhatsApp, indicação premiada e parcerias com comunidades |
| Receita em 6 meses (base) | **~R$ 64 mil acumulados**, com **MRR de ~R$ 23 mil** no mês 6 (~1.140 pagantes) |
| Custo em 6 meses (base) | ~R$ 59 mil, sendo R$ 27 mil de marketing |
| Lucro (base) | Fica positivo no **mês 4**. Acumula **~R$ 5 mil** no mês 6 e segue em **~R$ 5,7 mil/mês** |
| Caixa necessário | **~R$ 10 mil**: pré-lançamento mais o pior mês acumulado, com folga |

O lucro não inclui pró-labore dos sócios. O desenvolvimento é feito por nós.

---

## 2. Qual mercado atacar

### 2.1 O tamanho (aproximado)
- A classe C é perto de **metade da população adulta** (IBGE/FGV).
- Cerca de **3 em cada 4 famílias têm dívidas**, e quase 3 em cada 10 estão com contas em atraso (CNC, pesquisa Peic).
- Mais de **70 milhões de brasileiros estão inadimplentes** (Serasa).
- **WhatsApp:** está em quase todo celular no Brasil.

| Camada | Definição | Ordem de grandeza |
|---|---|---|
| TAM | Adultos das classes C/D com smartphone e conta em banco | dezenas de milhões |
| SAM | Os que usam WhatsApp todo dia e topariam pagar por ajuda com dinheiro | milhões |
| SOM (6 meses) | Meta do cenário base | **~1.100 pagantes** |

### 2.2 Por que começar pelo autônomo de renda variável

| Critério | Autônomo (motorista, diarista, MEI) | Assalariado CLT | Família endividada |
|---|---|---|---|
| Dor diária ("quanto sobrou hoje?") | 🔥 Alta: a renda muda todo dia | Média | Alta |
| Já vive no WhatsApp para trabalhar | 🔥 Sim | Sim | Sim |
| Fácil de achar em grupo ou comunidade | 🔥 Sim: grupos de motoristas, associações, cooperativas | Difícil | Difícil |
| Paga R$ 19,90 se der resultado | Sim: é ferramenta de trabalho | Sim | Pouco caixa |
| Nosso MVP atende hoje | ✅ Gasto, receita, contas, resumo | ✅ | Parcial: falta o plano de dívidas (Fase 2) |

**Decisão (P):** entrar pelo autônomo de renda variável. Depois de validar a retenção, abrir para a família endividada com o modo "sair do vermelho" (Fase 2).

### 2.3 Concorrência e posicionamento

| Produto | Preço | Nosso ponto |
|---|---|---|
| Meu Assessor | 12x R$ 29,90, só anual | Somos **mensais, mais baratos e cancelam com uma mensagem** |
| Pierre | Grátis / R$ 39 / R$ 199 | O Pierre é app com Open Finance. Nós somos **só WhatsApp**, falando a língua do dia a dia |
| Planilha / caderninho | Grátis | Nós lembramos as contas e fazemos a conta sozinhos |

**Frase de posicionamento:** *"Manda um áudio dizendo o que gastou. No fim do mês sobra grana."*

---

## 3. Como vender

### 3.1 Funil
```
Vídeo/anúncio/indicação → clique "Falar no WhatsApp" → teste grátis de 7 dias
→ uso diário (registrar gasto por áudio) → no dia 7 vem o link do Pix Automático → pagante
```

### 3.2 Canais (em ordem de prioridade)

| # | Canal | Como | Custo (P) | Meta |
|---|---|---|---|---|
| 1 | Conteúdo orgânico | 1 vídeo/dia (TikTok, Reels, Kwai): "quanto um motorista de app precisa rodar pra pagar o aluguel" | Tempo | 30–50% dos testes |
| 2 | Indicação | Indicou e a pessoa pagou: **1 mês grátis para os dois** | R$ 19,90 por indicação paga | 20% dos novos pagantes |
| 3 | Anúncio clique-para-WhatsApp (Meta) | Público: motoristas, entregadores, MEI, 20–45 anos | **~R$ 7 por teste iniciado** | CAC pago ≤ R$ 40 |
| 4 | Comunidades e parcerias | Grupos de motoristas, associações, cooperativas, sindicatos. Comissão de **30% do 1º ano** | Variável | 2–3 parceiros no mês 3 |
| 5 | Micro-influenciadores de finanças populares | Permuta ou cupom com comissão | R$ 300–1.500 por ação | Testar 2 por mês |

### 3.3 Oferta
- **Mensal:** R$ 19,90 por Pix Automático, ou cartão.
- **Anual (P):** R$ 179 (sai R$ 14,92/mês). Ajuda o caixa e reduz cancelamento.
- **Garantia:** 7 dias grátis, sem pedir cartão.
- **Cancelamento:** basta mandar "cancelar".

---

## 4. Custos

### 4.1 Custo variável por pagante/mês (P)

| Item | R$ |
|---|---|
| IA (texto, áudio, foto; teto de US$ 0,50) | 2,75 |
| Mensagens ativas WhatsApp (~8/mês) | 0,50 |
| Taxa do Pix/cartão (Asaas) | 1,99 |
| Impostos (Simples Nacional, ~6%) | 1,19 |
| **Total** | **~6,40** |
| **Margem por pagante** | **~R$ 13,50 (68%)** |

Cada usuário em teste custa **~R$ 1** nos 7 dias.

### 4.2 Custo fixo mensal (P)

| Item | R$/mês |
|---|---|
| Supabase Pro + Vercel Pro | ~250 |
| Contador (ME no Simples) | ~350 |
| Domínio, e-mail, ferramentas | ~200 |
| **Total** | **~800** |

O número do WhatsApp (chip) e a verificação de empresa na Meta não têm custo relevante.

### 4.3 Antes de lançar (único, P)
- Abrir CNPJ, registrar domínio e marca no INPI, testes: **~R$ 2.500**.
- **Desenvolvimento:** faltam as stories SG-1.3 a SG-1.8, cerca de 6–8 semanas.

---

## 5. Previsão de 6 meses (a partir do lançamento)

### Premissas por cenário (P)

| | Conservador | **Base** | Otimista |
|---|---|---|---|
| Testes orgânicos/mês | 100 → 350 | 100 → 900 | 300 → 2.000 |
| Marketing/mês | R$ 1.000 | R$ 2.000 → 7.000 | R$ 3.000 → 10.000 |
| Custo por teste pago | R$ 10 | R$ 7 | R$ 5 |
| Teste → pagante | 15% | 20% | 25% |
| Cancelamento mensal (churn) | 12% | 10% | 8% |

### Cenário base (mês a mês)

| Mês | Testes | Pagantes | Receita | Custo total | Lucro | Acumulado |
|---|---|---|---|---|---|---|
| M1 | 386 | 77 | 1.532 | 3.679 | −2.147 | −2.147 |
| M2 | 679 | 205 | 4.079 | 5.791 | −1.712 | −3.858 |
| M3 | 971 | 379 | 7.542 | 8.197 | −655 | −4.513 |
| M4 | 1.264 | 594 | 11.821 | 10.866 | **+955** | −3.558 |
| M5 | 1.557 | 846 | 16.835 | 13.771 | +3.064 | −494 |
| M6 | 1.900 | 1.141 | 22.706 | 17.002 | **+5.703** | **+5.210** |

### Comparação dos cenários (6 meses)

| | Conservador | **Base** | Otimista |
|---|---|---|---|
| Pagantes no M6 | 229 | **1.141** | 3.200 |
| MRR no M6 | R$ 4,6 mil | **R$ 22,7 mil** | R$ 63,7 mil |
| Receita acumulada | R$ 14,9 mil | **R$ 64,5 mil** | R$ 181,7 mil |
| Custo acumulado | R$ 17,5 mil | **R$ 59,3 mil** | R$ 118,0 mil |
| Lucro acumulado | −R$ 2,6 mil | **+R$ 5,2 mil** | +R$ 63,8 mil |
| Primeiro mês no azul | M5 | **M4** | M2 |
| CAC pago / CAC médio | R$ 67 / R$ 21 | **R$ 35 / R$ 20** | R$ 20 / R$ 11 |
| LTV (margem ÷ churn) | R$ 112 | **R$ 135** | R$ 169 |

**Leitura:**
- Nos três cenários o **LTV fica bem acima do CAC** (mais de 3x).
- O risco principal não é custo, é **conseguir testes baratos e manter o churn em 10% ou menos**.

Modelo usado: pagantes = pagantes anteriores × (1 − churn) + testes × conversão.

---

## 6. Metas e gatilhos de decisão

| Métrica | Meta | Se ficar abaixo |
|---|---|---|
| Ativação (registrou 3+ gastos no teste) | ≥ 60% | Melhorar onboarding e o primeiro áudio |
| Teste → pagante | ≥ 20% | Mostrar o resumo de "quanto sobrou" antes de cobrar |
| Churn mensal | ≤ 10% | Reforçar alertas de conta e resumo semanal |
| CAC pago | ≤ R$ 40 | Pausar anúncio e dobrar conteúdo e indicação |
| Custo variável por pagante | ≤ R$ 6,50 | Apertar os guardrails de IA (`sg costs`) |

**Regra de escala:** só aumentar o marketing quando, por 2 meses seguidos, o churn estiver em 10% ou menos e o CAC pago em R$ 40 ou menos.

---

## 7. Riscos

| Risco | Mitigação |
|---|---|
| A Meta mudar o preço ou a regra do WhatsApp | Custo de template limitado a ~8/mês; acompanhar a política |
| Custo de IA subir | Teto por usuário, cache e modelo menor nas tarefas simples |
| Inadimplência no Pix | Pix Automático, 3 dias de carência e depois bloqueio leve |
| LGPD (dado financeiro) | SG-1.8: consentimento, apagar dados e logs mascarados |
| Copiarem a ideia | Velocidade, preço, comunidade e marca local |

---

## 8. Próximos passos
1. Terminar o MVP (SG-1.3 a SG-1.8).
2. Beta fechado com **30 motoristas e diaristas** por 3 semanas, de graça, para medir ativação e retenção.
3. Abrir o CNPJ e o Asaas, e fazer a verificação da Meta.
4. Lançamento com R$ 2.000 de marketing no mês 1, seguindo o cenário base.
5. Revisar este plano com os números reais no fim do mês 2.
