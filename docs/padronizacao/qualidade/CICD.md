# CI/CD — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Testes](TESTES.md)** | **[Erros →](ERROS.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos, incluindo nomes de workflows, jobs e scripts. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define a **infraestrutura de CI/CD** do projeto Wl.Yaml: modelo de
branches, versionamento, workflows de GitHub Actions, git hooks e publicação
nos marketplaces.

**Objetivo:** garantir que nenhuma mudança quebre o build ou os testes antes
de chegar à `main`, e que publicações sejam determinísticas e rastreáveis.

---

## Filosofia de Branches

Três regras fundamentais que guiam todo o modelo:

**1. `main` não recebe nada diretamente.**
`main` é o registro de versões finalizadas — não um alvo de desenvolvimento.
Nenhum commit, nenhum PR, nenhuma publicação vai diretamente para ela.
A única forma de algo chegar à `main` é via squash-merge automático do
`promover-release.yml`, disparado por uma tag de versão em `develop`.
Quem olha o histórico da `main` vê exatamente uma versão por commit.

**2. Tudo passa por PR.**
Nenhuma mudança vai direto para `develop`. O histórico de decisão, revisão e
discussão vive na PR — não nos commits nem nos nomes de branch. A PR só é
promovida para `develop` quando todos os workflows do `pr.yml` passam verde.
O CI é o árbitro da qualidade, não uma aprovação manual isolada.

**3. `develop` → `main` só quando a versão muda.**
Acumular mudanças em `develop` é o estado normal de trabalho. A promoção
para `main` é um ato deliberado: atualizar a versão em `package.json`,
criar a tag e deixar o `promover-release.yml` fazer o trabalho. Não existe
"merge manual para main" — esse caminho está bloqueado.

---

## Visão Geral

```text
commit local
  └── pre-commit   (tsc · eslint nos staged · markdownlint)
  └── commit-msg   (Conventional Commits em português)
  └── pre-push     (build completo · jest · vsce package)
        │
        ▼
pull request → develop
  └── pr.yml       (typecheck · lint · jest · integração · markdownlint)
  └── todos os checks verdes → merge permitido
        │
        ▼
tag v1.2.3 em develop (após atualizar package.json)
  └── promover-release.yml  (valida tag → squash-merge develop → main)
  └── release.yml           (vsce package → Marketplace + Open VSX)
```

---

## Modelo de Branches

| Branch | Propósito | Merge direto |
| --- | --- | --- |
| `main` | Registro de versões finalizadas — somente via squash-merge automático | ✗ bloqueado |
| `develop` | Integração contínua — alvo de todos os PRs | ✗ bloqueado |
| `feat/<descricao>` | Nova funcionalidade | PR → develop |
| `fix/<descricao>` | Correção de bug | PR → develop |
| `refactor/<descricao>` | Refatoração sem nova funcionalidade | PR → develop |
| `docs/<descricao>` | Apenas documentação | PR → develop |
| `build/<descricao>` | Scripts de build, webpack, tsconfig | PR → develop |
| `chore/<descricao>` | Atualização de dependências, limpeza | PR → develop |

Commit direto em `main` e `develop` é bloqueado via branch protection e
via hook `pre-commit`.

---

## Versionamento

O projeto usa **SemVer** (`vMAIOR.MENOR.PATCH`) com semântica padrão:

| Incremento | Quando |
| --- | --- |
| `MAIOR` | Breaking change na API pública da extensão ou no `.yaml-profile.json` |
| `MENOR` | Nova funcionalidade retrocompatível |
| `PATCH` | Correção de bug sem mudança de contrato |

A versão é declarada em `package.json` (`"version": "1.2.3"`) e deve bater
com a tag de release antes da promoção.

### Pré-releases

```text
v1.0.0-alpha.1   → fase alpha, publicado como pre-release no GitHub
v1.0.0-beta.1    → fase beta
v1.0.0-rc.1      → release candidate
```

Pré-releases não disparam `promover-release.yml` — permanecem em `develop`.
O `release.yml` os publica como `prerelease: true` no GitHub e com flag
`--pre-release` no `vsce`.

### Fluxo de release

```bash
# 1. Em develop, após todos os PRs mesclados
# Atualizar "version" em package.json para "1.2.3"
git commit -m "chore(deps): prepara versão 1.2.3"

git tag v1.2.3
git push --tags
# Dispara release.yml + promover-release.yml
```

---

## Workflows

### pr.yml — gate de PR

Disparado em: `pull_request` → `develop` e `push` → `develop`.

```text
preflight
  ├── tem_codigo     → arquivos .ts presentes
  └── tem_testes     → pasta tests/ presente

typecheck      (needs: preflight, se tem_codigo)
  └── tsc --noEmit

lint           (needs: preflight, se tem_codigo)
  └── eslint "src/**/*.ts"

jest           (needs: preflight, se tem_testes)
  └── jest --coverage --ci

integracao     (needs: jest, se tem_testes)
  └── @vscode/test-cli (VS Code headless)

markdownlint   (sempre)
  └── markdownlint-cli2 "**/*.md"
```

Todos os jobs são **obrigatórios** para merge (required status checks).

### release.yml — publicação nos marketplaces

Disparado em: `push` de tags correspondendo a `v*`.

```text
preflight
  └── tem_codigo → arquivos .ts + package.json

empacotar      (needs: preflight)
  ├── npm ci
  ├── vsce package → extensao-vMAJOR.MINOR.PATCH.vsix
  └── upload-artifact: vsix

publicar-marketplace   (needs: empacotar)
  └── vsce publish --packagePath extensao-*.vsix

publicar-openvsx       (needs: empacotar)
  └── ovsx publish extensao-*.vsix
```

As credenciais de publicação (`VSCE_PAT`, `OVSX_PAT`) são secrets do
repositório, nunca expostas em logs.

### promover-release.yml — promoção develop → main

Disparado em: `push` de tags correspondendo a `v[0-9]*.[0-9]*.[0-9]*`.

```text
1. Valida que a tag aponta para HEAD de develop
2. Valida que a versão na tag bate com "version" em package.json
3. Aguarda até 5 min para checks pendentes do commit terminarem
4. Verifica que todos os check-runs passaram (success ou skipped)
5. Squash-merge develop → main com mensagem "release: v1.2.3"
```

### noturno.yml — pipeline noturna

Disparado em: `schedule: '0 3 * * *'` (03:00 UTC) e `workflow_dispatch`.

```text
jest-completo
  └── jest --coverage --ci (suite completa, sem cache)

integracao-completa
  └── @vscode/test-cli com VS Code estável + VS Code insiders

auditoria-deps
  └── npm audit --audit-level=high
```

---

## Git Hooks

Os hooks vivem em `.githooks/` e são ativados via
`git config core.hooksPath .githooks`.

### Estrutura

```text
.githooks/
  instalar.sh                    → instalação única após clonar
  diagnostico.sh                 → verifica ambiente local
  pre-commit                     → orquestrador (verificacoes/commit/)
  commit-msg                     → orquestrador (verificacoes/mensagem/)
  pre-push                       → orquestrador (verificacoes/push/)
  prepare-commit-msg             → prefixo automático de branch
  verificacoes/
    commit/
      01-branch-protegida.sh     → bloqueia commit direto em main/develop
      02-marcadores-conflito.sh  → detecta <<<<<<< / >>>>>>> nos staged
      03-arquivos-proibidos.sh   → .env, *.key, segredos fora de fixtures
      04-segredos.sh             → gitleaks nos staged
      05-tamanho-arquivo.sh      → limite configurável (padrão 5 MB)
      06-debug-leftovers.sh      → console.log("DEBUG"), TODO: REMOVE, etc.
      07-editorconfig.sh         → ec nos staged
      08-markdownlint.sh         → markdownlint nos staged .md
      09-eslint.sh               → eslint nos staged .ts
      10-typecheck.sh            → tsc --noEmit
    mensagem/
      01-formato.sh              → tipo(escopo)?: descrição
      02-escopo.sh               → escopo na whitelist YAML_ESCOPOS_VALIDOS
      03-tamanho-titulo.sh       → ≤ 72 caracteres
      04-pontuacao.sh            → sem ponto final no título
      05-breaking-change.sh      → BREAKING CHANGE: exige '!' no título
    push/
      01-branch-destino.sh       → bloqueia push direto a main/develop
      02-build.sh                → npm run build (webpack)
      03-jest.sh                 → jest --ci
      04-vsce-package.sh         → vsce package --no-dependencies (valida .vsix)
      05-gitleaks-historico.sh   → gitleaks no histórico de commits novos
```

### pre-commit

Executa verificações em `verificacoes/commit/` em ordem numérica.
Apenas arquivos **staged** são analisados.

**Modo rápido** — pula etapas pesadas (typecheck, gitleaks):

```bash
YAML_HOOK_FAST=1 git commit -m "fix: ..."
```

### commit-msg

Valida que a mensagem segue Conventional Commits em português. Merge
commits e revert automáticos são aceitos sem validação.

### pre-push

Executa verificações em `verificacoes/push/` em ordem numérica. Inclui
build completo e testes — mais lento que o pre-commit.

```bash
YAML_HOOK_TEST=0 git push   # pula jest no pre-push
```

### Variáveis de controle

| Variável | Padrão | Efeito |
| --- | --- | --- |
| `YAML_HOOK_FAST=1` | `0` | Pula typecheck e gitleaks no pre-commit |
| `YAML_HOOK_TEST=0` | `1` | Não roda jest no pre-push |
| `YAML_HOOK_VERBOSE=1` | `0` | Exibe detalhes de cada etapa |

### Instalação

```bash
# Uma vez após clonar
bash .githooks/instalar.sh

# Para verificar depois
bash .githooks/diagnostico.sh
```

**Ferramentas exigidas pelos hooks:**

| Ferramenta | Obrigatória | Instalação |
| --- | --- | --- |
| `node` / `npm` | ✓ | manual (nodejs.org) |
| `tsc` | ✓ | `npm ci` (devDependency) |
| `eslint` | ✓ | `npm ci` (devDependency) |
| `jest` | ✓ | `npm ci` (devDependency) |
| `vsce` | ✓ | `npm install -g @vscode/vsce` |
| `ovsx` | — | `npm install -g ovsx` (apenas release) |
| `gitleaks` | ✓ | binário (GitHub releases) |
| `editorconfig-checker` | ✓ | binário ou `npm install -g` |
| `markdownlint-cli2` | ✓ | `npm install -g markdownlint-cli2` |

---

## Proteção de Branches

Configuração do GitHub para `main` e `develop`:

| Regra | main | develop |
| --- | --- | --- |
| Require pull request before merging | ✓ | ✓ |
| Required approvals | 1 | 1 |
| Dismiss stale reviews | ✓ | ✓ |
| Require status checks to pass | ✓ | ✓ |
| Require branches to be up to date | ✓ | ✓ |
| Require signed commits | ✓ | ✓ |
| Do not allow bypassing | ✓ | ✓ |
| Restrict who can push | ✓ (bot apenas) | — |

**Required status checks em `develop`:**

```text
typecheck
lint
jest
markdownlint
```

`integracao` é required somente após os testes de integração estarem estáveis.

---

## Anti-padrões

| Anti-padrão | Por quê é problema | Alternativa |
| --- | --- | --- |
| PR direto para `main` | Viola a filosofia — `main` só recebe squash-merge automático da tag | PR → develop; tag dispara promoção |
| Merge direto em `develop` sem PR | Bypassa o CI gate e perde o histórico de revisão da PR | Sempre via PR com todos os checks verdes |
| Merge manual de `develop` → `main` | `main` deve refletir somente versões deliberadas via tag | Atualize `package.json`, crie a tag, deixe o workflow promover |
| Publicar manualmente via `vsce publish` local | Build local pode diferir do CI — não reproduzível e não rastreável | Sempre publicar via `release.yml` disparado pela tag |
| Tag `v1.2.3` com `package.json` em versão diferente | `promover-release.yml` bloqueia a promoção | Atualize `package.json` e commite antes de taggear |
| `git push --force origin main` | Destrói o registro de versões finalizadas | Nunca force-push em `main` |
| `git commit --no-verify` | Bypassa segurança que o CI vai rejeitar de qualquer forma | Corrija a causa raiz |
| `console.log` esquecido em código de produção | Hook `06-debug-leftovers.sh` bloqueia o commit | Remova antes de commitar |
| Segredo em texto plano em qualquer arquivo | gitleaks bloqueia no pre-commit e no pre-push | Variável de ambiente via CI secret |

---

**Próximo:** [Erros →](ERROS.md)
