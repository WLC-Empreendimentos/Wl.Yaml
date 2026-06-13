<div align="center">

# Pull Request

[![Commits](https://img.shields.io/badge/commits-Conventional%20Commits%20PT--BR-success?logo=conventionalcommits&logoColor=white)](../docs/padronizacao/runtime/COMMITS.md)
[![CI](https://img.shields.io/badge/CI-self--hosted-2088FF?logo=github-actions&logoColor=white)](../docs/padronizacao/qualidade/CICD.md)

</div>

---

## Tipo de mudança

<!-- Marque todos que se aplicam. -->

- [ ] `feat` — nova funcionalidade
- [ ] `fix` — correção de bug
- [ ] `refactor` — refatoração sem mudança de comportamento observável
- [ ] `perf` — melhoria de desempenho
- [ ] `docs` — somente documentação
- [ ] `test` — adição ou correção de testes, sem mudança de código de produção
- [ ] `build` — build, webpack, tsconfig, dependências
- [ ] `chore` — tarefas operacionais e CI
- [ ] `breaking` — quebra de compatibilidade com versão anterior

---

## Issue relacionada

<!-- PRs de funcionalidade devem referenciar uma issue aprovada previamente.
     Deixe em branco apenas para correções triviais. -->

Fecha #

---

## Descrição

<!-- O que este PR faz? Por que é necessário?
     A descrição deve ser completa o suficiente para dispensar a leitura do diff.
     Explique o comportamento novo ou corrigido, não a lista de arquivos alterados. -->

---

## Checklist

- [ ] Todos os checks de CI passam (typecheck, lint, jest, editorconfig, markdown).
- [ ] Novas funcionalidades têm testes com cobertura 100%.
- [ ] Documentação afetada foi atualizada.
- [ ] Mensagens de commit seguem [Conventional Commits PT-BR](../docs/padronizacao/runtime/COMMITS.md).
- [ ] Nenhum segredo, `.env` ou credencial foi incluído.
