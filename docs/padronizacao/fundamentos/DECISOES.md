# Decisões Intencionais — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Princípios](PRINCIPIOS.md)** | **[Condicionais →](../codigo/CONDICIONAIS.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Documenta o raciocínio por trás de cada decisão que foge do padrão
convencional para extensões VS Code desse tipo.

**Objetivo:** qualquer desenvolvedor que questione "por que não simplesmente X?"
deve encontrar aqui a resposta antes de propor uma mudança.

---

## Português como Idioma do Código

A maioria das extensões VS Code usa inglês. Este projeto usa português por uma
escolha deliberada de valorizar o idioma nativo dos seus autores e do público-alvo.

**Valorizar o idioma nativo.** O projeto é criado por e para desenvolvedores
cujo idioma de trabalho é o português. Nomear entidades, serviços e contratos
no idioma que o time pensa naturalmente reduz fricção cognitiva.

**Material acessível.** Um dos objetivos é ser uma referência de arquitetura
bem aplicada ao contexto de extensões VS Code. Código em português permite que
o foco esteja na arquitetura e boas práticas, não na tradução.

Termos técnicos consolidados sem tradução adequada (`Schema`, `YAML`, `LSP`,
`Token`, `Cache`, `ETag`) permanecem em inglês. A regra é clareza, não
purismo.

---

## Clean Architecture para uma Extensão VS Code

Extensões VS Code normalmente têm estrutura flat: um `extension.ts` com tudo
acoplado à API do VS Code. Isso funciona para extensões pequenas mas cria
problemas concretos em escala:

- Impossível testar a lógica de resolução de perfis sem inicializar o VS Code.
- Trocar o mecanismo de cache (de Memento para arquivo) exige mudanças em
  múltiplos pontos.
- O bug original `workspaceFolders[0]` sem guard existia exatamente porque a
  lógica estava misturada com o handler de request LSP.

Com CA, a lógica de resolução de perfil (`ServicoFormatacao`) não conhece o
VS Code. Os testes testam regra de negócio pura. A infraestrutura pode ser
trocada sem tocar na aplicação.

O custo é boilerplate adicional (interfaces, mapeadores). O benefício é
testabilidade real e evolução segura.

---

## Perfis por Projeto via `.yaml-profile.json`

O mecanismo original (`yaml.format.*` nas settings do VS Code) tem um
problema fundamental: as configurações são globais ou por workspace, mas o
workspace do VS Code é uma unidade coarse. Um monorepo com múltiplos serviços
não consegue definir indentação diferente para cada serviço sem criar
workspaces separados.

Além disso, as settings do VS Code são um canal de configuração do editor, não
do projeto. Se o time definir `"yaml.format.indent": 4` no
`settings.json` do workspace, isso não vai para o repositório de forma clara e
controlada — depende de cada membro do time ter o mesmo settings.json.

O `.yaml-profile.json` resolve ambos:

- **Versionável com o projeto:** vai para o repositório, todos os membros
  do time usam automaticamente.
- **Granular por padrão de arquivo:** um perfil para `**/k8s/**/*.yaml`
  (indent 2) e outro para `**/*.yaml` geral (indent 4) no mesmo workspace.
- **Explícito sobre intenção:** o arquivo declara a política de formatação do
  projeto, não configuração pessoal do editor.

A precedência `arquivo > workspace settings > global settings > defaults`
garante compatibilidade retroativa: workspaces sem `.yaml-profile.json`
continuam funcionando exatamente como antes.

---

## Manter `yaml-language-server` como Dependência

O servidor LSP (`yaml-language-server`) implementa parse, validação semântica,
hover e completion de YAML. Reescrever isso seria um projeto separado de outra
magnitude, com custo muito maior do que o benefício.

O que este projeto controla — e onde está o valor real — é o **cliente VS
Code**: como ele se comunica com o servidor, como resolve configurações de
forma inteligente por projeto, e como expõe a API para extensões terceiras.

A decisão de fixar a versão do `yaml-language-server` em semver exato (em vez
de `"next"` como no original) é consequência direta: builds devem ser
determinísticos.

---

## Dois Entry Points: Node.js e Web Worker

VS Code roda em dois ambientes: desktop (Node.js) e browser/vscode.dev (Web
Worker). Eles têm APIs diferentes para comunicação com o servidor LSP:

- Desktop: IPC via `LanguageClient` do `vscode-languageclient/node`
- Web: `Worker` + `LanguageClient` do `vscode-languageclient/browser`

O bootstrap é diferente nos dois casos, mas toda a lógica de negócio
(`aplicacao/`, `nucleo/`) é idêntica. Por isso existem dois entry points
(`apresentacao/node/ativar.ts` e `apresentacao/webworker/ativar.ts`) que
compartilham o `InicializadorExtensao.ts`.

O Web Worker também não tem acesso ao sistema de arquivos nativo, então
`RepositorioCacheSchema` tem uma implementação no-op para esse ambiente — o
cache funciona apenas em desktop.

---

## Cobertura de Testes 100%

A extensão precisa funcionar corretamente em Windows, Linux e macOS, em
desktop e browser. Com 100% de cobertura em ambiente local, quando algo falhar
em outro ambiente a causa mais provável é diferença de ambiente — não ausência
de teste. Sem 100%, não é possível distinguir com firmeza.

---

## Versão Semântica Fixada para `yaml-language-server`

O projeto original usa `"yaml-language-server": "next"` como dependência de
produção. Isso significa que dois builds em datas diferentes podem usar
versões diferentes do servidor — quebrando de forma silenciosa e
não-determinística.

Este projeto fixa a versão em semver exato (ex.: `"1.15.0"`). Atualizações
são deliberadas: avaliadas, testadas e commitadas com mensagem explicativa.

---

**Próximo:** [Condicionais →](../codigo/CONDICIONAIS.md)
