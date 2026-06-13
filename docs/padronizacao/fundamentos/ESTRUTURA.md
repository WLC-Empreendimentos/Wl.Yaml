# Organização Estrutural — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Decisões](DECISOES.md)** | **[TypeScript →](../codigo/TYPESCRIPT.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos, incluindo listagens de arquivos e pastas. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define a **estrutura de pastas semântica** do projeto Wl.Yaml, incluindo
organização de DTOs, separação de responsabilidades e hierarquia de arquivos.

**Objetivo:** clareza absoluta — bater o olho no caminho e saber exatamente
a responsabilidade do arquivo.

---

## Estrutura Geral do Projeto

```text
Wl.Yaml/
├── src/
│   ├── nucleo/           # Entidades, Enums, Value Objects, Interfaces, Excecoes
│   ├── aplicacao/        # Servicos, DTOs, Validadores, Mapeadores
│   ├── infraestrutura/   # VS Code API, sistema de arquivos, LSP, HTTP, cache
│   └── apresentacao/     # Entrada da extensão, comandos, UI, API pública
│
├── tests/
│   ├── nucleo/
│   ├── aplicacao/
│   ├── infraestrutura/
│   └── integracao/
│
├── docs/
│   └── padronizacao/
│
├── _old/                 # Projeto original (referência — não modificar)
├── package.json
├── tsconfig.json
└── webpack.config.js
```

---

## Estrutura Detalhada por Camada

### nucleo/

```text
src/nucleo/
├── Entidades/
│   ├── PerfilFormatacao.ts        # Regras de formatação com invariantes
│   ├── AssociacaoSchema.ts        # Associação schema ↔ padrão de arquivo
│   ├── PerfilProjeto.ts           # Lista de perfis do workspace
│   └── DocumentoYaml.ts           # Documento aberto no editor
│
├── ValueObjects/
│   ├── PadraoArquivo.ts           # Glob com lógica de match validada no construtor
│   ├── TamanhoIndentacao.ts       # 1–8, validado no construtor
│   └── UriSchema.ts               # URI com validação de scheme
│
├── Enums/
│   ├── TipoAspas.ts               # Simples, Duplas
│   └── ModoQuebra.ts              # Preservar, Nunca, Sempre
│
├── Excecoes/
│   ├── Base/
│   │   ├── YamlExtensaoExcecao.ts # Classe base abstrata de todas as exceções
│   │   ├── NaoEncontradoExcecao.ts
│   │   └── ConfiguracaoInvalidaExcecao.ts
│   ├── Perfil/
│   │   ├── PerfilInvalidoExcecao.ts
│   │   └── PerfilNaoEncontradoExcecao.ts
│   └── Schema/
│       ├── SchemaNaoEncontradoExcecao.ts
│       └── SchemaInvalidoExcecao.ts
│
└── Interfaces/
    ├── Repositorios/
    │   ├── IRepositorioPerfilProjeto.ts   # Contrato para .yaml-profile.json
    │   ├── IRepositorioConfiguracoes.ts   # Contrato para yaml.format.* do VS Code
    │   └── IRepositorioSchema.ts
    └── Servicos/
        ├── IClienteLsp.ts                 # Abstração do cliente LSP
        └── ICacheSchema.ts                # Cache de schemas remotos
```

### aplicacao/

```text
src/aplicacao/
├── DTOs/
│   ├── Entrada/
│   │   ├── Formatacao/
│   │   │   └── ResolverPerfilRequisicao.ts    # URI do documento + contexto
│   │   └── Schema/
│   │       └── AssociarSchemaRequisicao.ts
│   └── Saida/
│       ├── Formatacao/
│       │   └── PerfilFormatacaoResposta.ts    # Perfil resolvido (todos os campos)
│       └── Schema/
│           └── SchemaAtualResposta.ts
│
├── Servicos/
│   ├── Interfaces/
│   │   ├── IServicoFormatacao.ts
│   │   └── IServicoSchema.ts
│   └── Implementacoes/
│       ├── ServicoFormatacao.ts     # Resolve perfil efetivo (ver regra de precedência)
│       └── ServicoSchema.ts
│
├── Validadores/
│   └── Formatacao/
│       └── ValidadorPerfilFormatacao.ts
│
└── Mapeadores/
    ├── MapeadorPerfilFormatacao.ts
    └── MapeadorAssociacaoSchema.ts
```

### infraestrutura/

```text
src/infraestrutura/
├── VsCode/
│   ├── RepositorioConfiguracoes.ts    # Implementa IRepositorioConfiguracoes
│   │                                  # Lê yaml.format.* via workspace.getConfiguration
│   ├── AdaptadorSistemaArquivos.ts    # Wraps workspace.fs
│   └── AdaptadorClienteLsp.ts         # Wraps vscode-languageclient
│
├── Persistencia/
│   ├── RepositorioPerfilArquivo.ts    # Implementa IRepositorioPerfilProjeto
│   │                                  # Lê e valida .yaml-profile.json do workspace
│   └── RepositorioCacheSchema.ts      # Cache disk + VS Code Memento
│
└── Http/
    └── AdaptadorLojaSchemas.ts        # Busca catalog do schemastore.org
```

### apresentacao/

```text
src/apresentacao/
├── node/
│   └── ativar.ts              # activate() para desktop (IPC + Node.js)
│
├── webworker/
│   └── ativar.ts              # activate() para web (Web Worker)
│
└── compartilhado/
    ├── InicializadorExtensao.ts   # Bootstrap comum (DI, inicialização de serviços)
    ├── Comandos/
    │   ├── ComandoFormatarDocumento.ts
    │   └── ComandoSelecionarSchema.ts
    ├── Interface/
    │   ├── BarraStatusSchema.ts
    │   └── NotificacaoPerfil.ts
    └── Api/
        └── ApiExtensaoSchema.ts   # API pública para extensões terceiras
```

---

## Princípios de Organização

### Profundidade Hierárquica é Preferível à Pasta Plana

**Regra:** é mais correto ter 30 níveis de subpastas com separação semântica
clara do que ter 2 ou 3 níveis com dezenas de arquivos misturados.

Profundidade de pastas nunca é problema. Pasta plana com arquivos de
responsabilidades distintas sempre é.

Quando uma pasta começa a acumular arquivos de naturezas diferentes, isso é o
sinal para criar uma subpasta. O critério não é a quantidade de arquivos — é a
homogeneidade semântica. Uma pasta com dois arquivos de responsabilidades
distintas já justifica subdivisão. Uma pasta com vinte arquivos de
responsabilidade idêntica não precisa de mais nível.

```text
// ERRADO — pasta plana com responsabilidades misturadas
Excecoes/
├── PerfilInvalidoExcecao.ts
├── PerfilNaoEncontradoExcecao.ts
├── SchemaNaoEncontradoExcecao.ts
├── SchemaInvalidoExcecao.ts
├── YamlExtensaoExcecao.ts
├── NaoEncontradoExcecao.ts
└── ConfiguracaoInvalidaExcecao.ts
// → 7 arquivos, distinção entre base e especializações invisível

// CORRETO — hierarquia semântica clara
Excecoes/
├── Base/
│   ├── YamlExtensaoExcecao.ts
│   ├── NaoEncontradoExcecao.ts
│   └── ConfiguracaoInvalidaExcecao.ts
├── Perfil/
│   ├── PerfilInvalidoExcecao.ts
│   └── PerfilNaoEncontradoExcecao.ts
└── Schema/
    ├── SchemaNaoEncontradoExcecao.ts
    └── SchemaInvalidoExcecao.ts
// → o caminho já diz o que é antes de abrir o arquivo
```

**O caminho é a documentação.** `Excecoes/Perfil/PerfilInvalidoExcecao.ts` não
precisa de comentário explicando onde está ou para que serve. O path já diz
tudo.

Ao criar um novo arquivo, percorra o caminho a partir da raiz e pergunte em
cada nível: "este arquivo pertence aqui ou existe uma subpasta mais específica
que descreve melhor sua responsabilidade?" Se a subpasta não existe ainda,
crie-a.

### Um Tipo Público Por Arquivo

**Regra absoluta:** nome do arquivo = nome do tipo público principal.

```text
CORRETO
PerfilFormatacao.ts             → export class PerfilFormatacao
IRepositorioPerfilProjeto.ts    → export interface IRepositorioPerfilProjeto
ResolverPerfilRequisicao.ts     → export interface ResolverPerfilRequisicao
TipoAspas.ts                    → export enum TipoAspas
PerfilInvalidoExcecao.ts        → export class PerfilInvalidoExcecao

ERRADO
Entidades.ts                    → export class PerfilFormatacao
                                   export class AssociacaoSchema
DTOs.ts                         → export interface ResolverPerfilRequisicao
                                   export interface AssociarSchemaRequisicao
```

### Anti-Padrão Crítico: Misturar Responsabilidades

**NUNCA** defina DTOs, entidades ou validadores dentro de serviços ou comandos:

```typescript
// ERRADO — interface definida dentro do arquivo de serviço
// ServicoFormatacao.ts
interface PerfilResolvido { indentacao: number; }   // ERRADO: DTO no serviço
export class ServicoFormatacao { ... }

// CORRETO — cada responsabilidade em seu arquivo
// DTOs/Saida/Formatacao/PerfilFormatacaoResposta.ts
export interface PerfilFormatacaoResposta { readonly indentacao: number; }

// Servicos/Implementacoes/ServicoFormatacao.ts
export class ServicoFormatacao implements IServicoFormatacao { ... }
```

---

## DTO vs Entidade — Definição e Fronteiras

### Entidade (`nucleo/Entidades/`)

- Representa **estado de domínio** com invariantes garantidas no construtor.
- Pode ter campos privados, métodos que alteram estado interno.
- É mapeada para/de DTOs pelos `Mapeadores/` da camada de aplicação.
- **Nunca** é serializada diretamente para fora da camada de aplicação.
- Não conhece VS Code, JSON, serialização ou framework de transporte.

### DTO (`aplicacao/DTOs/`)

- Objeto de transporte puro. Sem comportamento, sem invariantes complexas.
- Forma idiomática: `interface` com propriedades `readonly`.
- Existe em duas direções: **Entrada** (do comando/apresentação) e **Saída**
  (devolvida ao apresentação).
- Pode referenciar enums e value objects públicos do nucleo, mas **nunca** uma
  entidade diretamente.

### Regra de Fronteira (inegociável)

> **Comando conhece DTO. Serviço traduz DTO ↔ Entidade. Repositório conhece
> Entidade. Entidade nunca atravessa a fronteira de apresentação.**

```text
Evento VS Code (comando, configuração)
   ↓
Apresentação → recebe/constrói DTO de Entrada
   ↓
Serviço → usa Mapeador para virar Entidade → opera regra de domínio
   ↓                                              ↓
   ↓                                        Repositório (via interface do nucleo)
   ↓                                              ↓
   ↓                                        Infraestrutura (FS, VS Code, LSP)
   ↓
Serviço → usa Mapeador para virar DTO de Saída
   ↓
Apresentação → usa DTO de Saída (status bar, notificação, LSP)
```

### Casos Proibidos

- **Comando recebendo entidade diretamente.**
- **Comando devolvendo entidade diretamente.**
- **DTO referenciando entidade** (`interface PerfilDto { entidade: PerfilFormatacao }`).
- **Entidade com método `paraDto()` ou `toJSON()`** — responsabilidade do Mapeador.

---

## Dependências Entre Camadas

```text
┌──────────────────────────────────────────────┐
│              apresentacao/                   │
│    (node, webworker, comandos, UI, api)      │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│              aplicacao/                      │
│      (servicos, DTOs, validadores)           │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│               nucleo/                        │
│   (entidades, excecoes, interfaces,          │
│    value objects, enums)                     │
└──────────────────────────────────────────────┘
                      ▲
                      │
┌──────────────────────────────────────────────┐
│            infraestrutura/                   │
│  (VS Code, FS, LSP, HTTP, cache — impl.)     │
└──────────────────────────────────────────────┘
```

**Regras de dependência:**

- `apresentacao` → `aplicacao` → `nucleo`
- `infraestrutura` → `nucleo` (implementa interfaces)
- `apresentacao` **NÃO** conhece `infraestrutura` diretamente (DI resolve)
- `aplicacao` **NÃO** conhece `infraestrutura` (inversão de dependência)
- `nucleo` não depende de nada interno

---

## Ordem de Implementação por Dependência Estrutural

```text
1. nucleo/
   Sem dependências internas.
   Entidades, Value Objects, Enums, Exceções e todas as Interfaces
   de repositório e serviço devem existir antes de qualquer outra camada.

2. aplicacao/
   Depende apenas do nucleo.
   Serviços de aplicação orquestram contratos do nucleo.
   DTOs, validadores e mapeadores ficam aqui.

3. infraestrutura/
   Depende apenas do nucleo (implementa suas interfaces).
   Não conhece aplicacao nem apresentacao.
   Pode ser desenvolvida em paralelo com a aplicacao na prática,
   pois ambas dependem somente do nucleo.

4. apresentacao/
   Depende da aplicacao.
   Infraestrutura chega via DI — apresentacao não a referencia diretamente.
```

### Testes Seguem a Mesma Ordem

```text
tests/nucleo/          → após o nucleo
tests/aplicacao/       → após a aplicacao
tests/infraestrutura/  → após a infraestrutura
tests/integracao/      → após apresentacao estar operacional
```

---

## Convenções de Nomenclatura de Pastas

### Pastas em PascalCase

```text
CORRETO
Entidades/
Servicos/
DTOs/
Excecoes/

ERRADO
entidades/
servicos/
dtos/
excecoes/
```

### Subpastas Semânticas — Sempre que Houver Distinção

Cada nível de pasta deve comunicar algo sobre o que está dentro. Se dois
arquivos numa mesma pasta têm naturezas diferentes, eles pertencem a subpastas
diferentes — mesmo que cada subpasta tenha apenas um arquivo.

```text
// CORRETO — cada nível comunica algo
DTOs/
├── Entrada/               ← direção do fluxo
│   ├── Formatacao/        ← domínio
│   │   └── ResolverPerfilRequisicao.ts
│   └── Schema/            ← domínio
│       └── AssociarSchemaRequisicao.ts
└── Saida/                 ← direção do fluxo
    ├── Formatacao/        ← domínio
    │   └── PerfilFormatacaoResposta.ts
    └── Schema/            ← domínio
        └── SchemaAtualResposta.ts

// ERRADO — pasta plana sem hierarquia semântica
DTOs/
├── ResolverPerfilRequisicao.ts   ← entrada ou saída? formatação ou schema?
├── AssociarSchemaRequisicao.ts
└── PerfilFormatacaoResposta.ts
```

Uma subpasta com um único arquivo é completamente aceitável. O valor está na
clareza do caminho, não na densidade da pasta.

---

## Checklist de Estrutura

Antes de criar novo arquivo:

- [ ] Arquivo está na camada correta?
- [ ] Nome do arquivo = nome do tipo público principal?
- [ ] Existe uma subpasta mais específica que descreve melhor a responsabilidade?
- [ ] A pasta onde vai entrar é semanticamente homogênea — todos os arquivos ali têm a mesma natureza?
- [ ] Apenas um tipo público no arquivo?
- [ ] DTO está em `DTOs/Entrada/{Dominio}/` ou `DTOs/Saida/{Dominio}/`?
- [ ] Exceção está em `Excecoes/{Dominio}/`?
- [ ] Validador está em `Validadores/{Dominio}/`?
- [ ] Interface está em `nucleo/Interfaces/`?
- [ ] Implementação está em `infraestrutura/` (repositórios) ou `aplicacao/Servicos/Implementacoes/` (serviços)?
- [ ] Se a pasta de destino tem arquivos de responsabilidades distintas, foi criada subpasta antes de adicionar?

---

**Próximo:** [TypeScript →](../codigo/TYPESCRIPT.md)
