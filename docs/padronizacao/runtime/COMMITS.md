# Commits — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Async](ASYNC.md)** | **[Testes →](../qualidade/TESTES.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define o padrão de **Conventional Commits em português** para o projeto
Wl.Yaml: tipos, escopos, formato e exemplos.

**Objetivo:** histórico de git legível, rastreável e gerador de changelog
automático.

---

## A Regra Central: Mensagem Completa, Diff Opcional

Uma mensagem de commit bem escrita torna a leitura do diff uma **escolha**,
não uma necessidade.

Quem lê o histórico deve conseguir entender completamente o que mudou e por
que — sem abrir um único arquivo. O diff existe para quem quiser ver
**como** foi feito. Nunca para entender **o que** foi feito.

Se alguém precisar abrir o diff para entender a mudança, a mensagem está
incompleta.

```text
// ERRADO — inventário de arquivos (o diff já mostra isso)
feat(perfil): adicionar PerfilFormatacao.ts, IRepositorioPerfilProjeto.ts,
ResolvedorPerfilPorGlob.ts e atualizar ServicoFormatacao.ts

// ERRADO — título do diff (ainda não explica nada)
feat(perfil): criar entidade de perfil e interface de repositório

// CORRETO — completo o suficiente para dispensar o diff
feat(perfil): habilita resolução de perfil por glob pattern no workspace

Perfis definidos em .yaml-profile.json agora são resolvidos pelo padrão
de arquivo mais específico que corresponde ao documento aberto. O perfil
genérico (**/*.yaml) serve de fallback quando nenhum padrão mais específico
corresponde. Antes dessa mudança, todos os documentos do workspace usavam
o mesmo perfil independentemente do caminho.
```

O corpo deve descrever o **comportamento novo ou corrigido**: o que o usuário
ou o sistema passa a ser capaz de fazer, o que deixa de quebrar, e quando
relevante, qual era o comportamento anterior. Quando a mudança é interna
(refactor, build), o corpo descreve o que melhorou estruturalmente, por que
isso importa e qual problema concreto isso resolve ou previne.

---

## Formato

```text
<tipo>(<escopo>): <descrição curta>

[corpo — obrigatório quando a mudança tem impacto não óbvio]

[rodapé opcional]
```

- Primeira linha: máximo 72 caracteres.
- Tipo e escopo em minúsculas.
- Descrição curta em português, sem ponto final, em modo imperativo
  ("adiciona", "corrige", "remove" — não "adicionado", "corrigido").
- Corpo separado por linha em branco; descreve impacto e motivação —
  nunca lista de arquivos.

---

## Tipos

| Tipo | Quando usar |
| --- | --- |
| `feat` | Nova funcionalidade visível ao usuário |
| `fix` | Correção de bug |
| `refactor` | Mudança de código sem alteração de comportamento |
| `test` | Adição ou correção de testes |
| `docs` | Documentação (JSDoc, arquivos `.md`) |
| `build` | Mudança em build, webpack, tsconfig, package.json |
| `ci` | Mudança em pipelines de CI (GitHub Actions) |
| `chore` | Atualização de dependências, arquivos de configuração |
| `perf` | Melhoria de performance sem novo comportamento |

---

## Escopos do Projeto

| Escopo | Corresponde a |
| --- | --- |
| `nucleo` | `src/nucleo/` — entidades, value objects, exceções, interfaces |
| `aplicacao` | `src/aplicacao/` — serviços, validadores, mapeadores, DTOs |
| `infra` | `src/infraestrutura/` — repositórios, adaptadores |
| `apresentacao` | `src/apresentacao/` — ativação, comandos, UI |
| `perfil` | Funcionalidade de `.yaml-profile.json` especificamente |
| `schema` | Funcionalidade de associação e cache de schemas |
| `lsp` | Comunicação com `yaml-language-server` |
| `testes` | Arquivos de teste (quando o escopo não é suficientemente específico) |
| `docs` | Documentação de padronização (arquivos em `docs/`) |
| `deps` | Atualização de dependências |

---

## Exemplos

### Funcionalidade nova

```text
feat(perfil): adiciona suporte a múltiplos perfis por padrão de arquivo

Permite que o .yaml-profile.json defina perfis distintos por glob pattern.
O perfil mais específico tem precedência sobre o genérico.
```

### Correção de bug

```text
fix(lsp): corrige crash ao acessar workspaceFolders sem workspace aberto

workspaceFolders retorna undefined quando nenhum workspace está aberto.
Adicionada guard clause antes do acesso ao índice 0.
```

### Refactoring

```text
refactor(aplicacao): isola resolução de precedência de perfil em classe própria

A lógica de decidir qual camada vence (arquivo > workspace > global > padrão)
estava embutida como método privado em ServicoFormatacao, tornando impossível
testá-la isoladamente. Agora é uma classe com responsabilidade única e
cobertura própria.
```

### Testes

```text
test(perfil): cobre cenários de arquivo ausente, malformado e sem glob correspondente

Os três cenários representam as principais falhas silenciosas observadas no
projeto original: ausência do arquivo não retornava fallback, JSON inválido
propagava exceção genérica, e glob sem correspondência usava o último perfil
em vez do padrão.
```

### Documentação

```text
docs(padronizacao): define convenção de commits com foco em intenção, não inventário
```

### Atualização de dependência

```text
chore(deps): atualiza yaml-language-server de 1.14.0 para 1.15.0

Inclui correção de validação de âncoras recursivas (issue upstream #1234).
```

### Breaking change

```text
feat(perfil)!: altera campo "padraoArquivo" de string para array no .yaml-profile.json

BREAKING CHANGE: perfis com "padraoArquivo" como string única precisam ser
migrados para array de um elemento.

Antes: "padraoArquivo": "**/*.yaml"
Depois: "padraoArquivo": ["**/*.yaml"]
```

---

## Regras Adicionais

- **Commits atômicos:** um commit por mudança lógica independente.
- **Sem commits de "WIP"** no histórico principal — squash antes de merge.
- **Sem misturar tipos:** não juntar `feat` e `fix` no mesmo commit.
- **Breaking changes** sempre com `!` após o escopo e seção `BREAKING CHANGE`
  no rodapé.

---

## Branches

Nomes de branches em português, prefixados com o tipo:

```text
feat/perfil-multiplos-padroes
fix/crash-workspace-vazio
refactor/servico-formatacao-ca
docs/padronizacao-commits
chore/atualiza-yaml-language-server
```

---

## Checklist de Commit

- [ ] Tipo corresponde à mudança real?
- [ ] Escopo é um dos escopos definidos?
- [ ] Descrição em português, modo imperativo, sem ponto final?
- [ ] Primeira linha com no máximo 72 caracteres?
- [ ] O corpo descreve impacto ou motivação — não lista arquivos modificados?
- [ ] A mensagem é completa o suficiente para dispensar a leitura do diff?
- [ ] Quem lê o histórico daqui a seis meses entende o que mudou e por quê, sem abrir nenhum arquivo?
- [ ] Breaking change usa `!` e seção `BREAKING CHANGE`?
- [ ] Commit é atômico (uma mudança lógica)?

---

**Próximo:** [Testes →](../qualidade/TESTES.md)
