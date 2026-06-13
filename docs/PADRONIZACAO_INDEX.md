# Padronização — Wl.Yaml

> Documentação normativa do projeto. Toda decisão técnica deve ser consistente
> com os documentos abaixo.

---

## Fundamentos

| Documento | O que define |
| --- | --- |
| [Princípios Fundamentais](padronizacao/fundamentos/PRINCIPIOS.md) | Regras inegociáveis: português, um tipo por arquivo, JSDoc completo, async, validadores, exceções separadas |
| [Estrutura do Projeto](padronizacao/fundamentos/ESTRUTURA.md) | Organização de pastas por camada, regras de fronteira DTO/Entidade/Repositório, diagrama de dependências |
| [Decisões Intencionais](padronizacao/fundamentos/DECISOES.md) | Raciocínio por trás de cada escolha que foge do convencional |

---

## Código

| Documento | O que define |
| --- | --- |
| [Nomenclatura](padronizacao/codigo/NOMENCLATURA.md) | PascalCase, camelCase, prefixo `_`, prefixo `I`, verbos em português, sufixos semânticos |
| [TypeScript](padronizacao/codigo/TYPESCRIPT.md) | Idiomas obrigatórios do TS: `interface` vs `type`, `readonly`, tipos explícitos, sem `any`, sem `!` |
| [Condicionais e Fluxo](padronizacao/codigo/CONDICIONAIS.md) | Hierarquia de 9 opções para condicionais; array methods antes de loops imperativos |
| [Documentação JSDoc](padronizacao/codigo/DOCUMENTACAO.md) | Escopo obrigatório, tags `@param` / `@returns` / `@throws` / `@remarks`, anti-padrões |
| [Valores e Tipos](padronizacao/codigo/VALORES.md) | Qual tipo usar para cada categoria; Value Objects; sem números mágicos |

---

## Qualidade

| Documento | O que define |
| --- | --- |
| [Testes Automatizados](padronizacao/qualidade/TESTES.md) | Jest, nomeação `Cenario_Condicao_ResultadoEsperado`, Arrange-Act-Assert, cobertura 100% |
| [CI/CD](padronizacao/qualidade/CICD.md) | Workflows de GitHub Actions, git hooks, modelo de branches, versionamento, publicação nos marketplaces |
| [Tratamento de Erros](padronizacao/qualidade/ERROS.md) | Hierarquia de exceções, arquivo por exceção, nunca `throw new Error()` genérico |
| [Validação](padronizacao/qualidade/VALIDACAO.md) | Validadores em classes separadas, validar na fronteira da camada de aplicação |

---

## Runtime

| Documento | O que define |
| --- | --- |
| [Async/Await](padronizacao/runtime/ASYNC.md) | Async all the way, CancellationToken do VS Code, sem `.then()` em código novo, sem async void |
| [Mensagens de Commit](padronizacao/runtime/COMMITS.md) | Conventional Commits em português, tipos, escopos, branches, PRs |

---

## Checklist Pré-Commit

- [ ] Todo código está em português (exceto termos técnicos permitidos)?
- [ ] Um tipo público por arquivo?
- [ ] JSDoc em todos os membros públicos?
- [ ] `async/await` para todo I/O?
- [ ] `CancellationToken` propagado nas operações canceláveis?
- [ ] Validação feita em classe `Validador` separada?
- [ ] Exceções em arquivos separados?
- [ ] Sem `any`, sem `!` (non-null assertion), sem `var`?
- [ ] Tipos explícitos em `const`/`let`?
- [ ] Commit segue Conventional Commits em português?
