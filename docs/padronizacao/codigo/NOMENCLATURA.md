# Nomenclatura — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Condicionais](CONDICIONAIS.md)** | **[Valores →](VALORES.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define as **convenções obrigatórias de nomenclatura** para todos os elementos
do projeto Wl.Yaml: tipos, métodos, variáveis, arquivos e namespaces.

**Objetivo:** reduzir ambiguidade, acelerar code review e manter consistência
arquitetural entre camadas.

---

## Regra de Ouro

O nome é um contrato de intenção.

Se o nome não explica claramente o papel do elemento sem comentário adicional,
então ele está inadequado.

---

## PARTE 1 — Fundamentos de Nomeação

### 1. Idioma do Código

**Português** como idioma padrão. Inglês somente para termos técnicos
consolidados sem equivalente natural.

**Termos técnicos aceitos em inglês:**

`Schema`, `Token`, `Cache`, `ETag`, `URI`, `URL`, `Glob`, `LSP`, `IPC`,
`JSON`, `YAML`, `DTO`, `Id`, `Hash`, `Workspace`, `Webworker`, `Bundle`.

```typescript
// CORRETO
export class ServicoFormatacao { }
async resolverPerfilEfetivoAsync(requisicao: ResolverPerfilRequisicao): Promise<PerfilFormatacaoResposta> { }

// ERRADO
export class FormattingService { }
async getEffectiveProfile(request: ResolveProfileRequest): Promise<FormattingProfileResponse> { }
```

---

### 2. Nome Autodescritivo

O nome deve revelar objetivo e contexto. Evitar nomes sem semântica.

```typescript
// CORRETO
const documentosComSchemaAtivo = await this._repositorioSchema.listarComSchemaAsync(ct);
const perfilEfetivo: PerfilFormatacaoResposta = await servico.resolverAsync(requisicao, ct);

// ERRADO
const lista = await repo.listarAsync(ct);
const x = await servico.resolverAsync(req, ct);
```

---

### 3. Sem Abreviações (com Exceções)

Abreviar somente siglas universalmente conhecidas no domínio/stack.

**Exceções aceitas:** `Id`, `URI`, `URL`, `LSP`, `ct` (convenção para `CancellationToken`).

```typescript
// CORRETO
const uriDocumento = 'file:///workspace/config.yaml';
const repositorioSchema: IRepositorioSchema = ...;

// ERRADO
const uriDoc = 'file:///workspace/config.yaml';
const repoSchema = ...;
```

---

### 4. Convenções de Case

- **PascalCase:** tipos (`class`, `interface`, `enum`), métodos, propriedades públicas.
- **camelCase:** parâmetros, variáveis locais, campos privados.
- **`_` prefix:** campos privados de classe.
- **SCREAMING_SNAKE_CASE:** constantes de módulo com valor literal fixo.

```typescript
// PascalCase — tipos e métodos
export class RepositorioPerfilArquivo { }
export interface IRepositorioPerfilProjeto { }
async ObterPerfilAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacao | undefined> { }

// camelCase — parâmetros e variáveis
async obterPerfilAsync(uriDocumento: string, ct: CancellationToken) {
  const perfilEncontrado: PerfilFormatacao | undefined = await this._repositorio.obterAsync(uri, ct);
  const temPerfil: boolean = perfilEncontrado !== undefined;
}

// _ prefix — campos privados
private readonly _repositorioPerfil: IRepositorioPerfilProjeto;
private readonly _cache: ICacheSchema;

// SCREAMING_SNAKE_CASE — constantes de módulo
const CHAVE_CACHE = 'json-schema-key';
const DIRETORIO_CACHE = 'schemas_cache';
```

---

## PARTE 2 — Convenções por Artefato

### 5. Classes, Interfaces e Enums

**Classes:** substantivo claro no singular. Sufixo semântico obrigatório quando
descreve o papel arquitetural.

**Interfaces:** prefixo `I` + nome da abstração.

**Enums:** nome no singular, valores sem prefixo repetitivo.

```typescript
// CORRETO
export class ServicoFormatacao { }
export class RepositorioPerfilArquivo { }
export class ValidadorPerfilFormatacao { }
export class MapeadorPerfilFormatacao { }
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao { }

export interface IServicoFormatacao { }
export interface IRepositorioPerfilProjeto { }
export interface ICacheSchema { }

export enum TipoAspas { Simples, Duplas }
export enum ModoQuebra { Preservar, Nunca, Sempre }

// ERRADO
export class FormattingService { }
export interface RepositorioPerfilProjeto { }   // sem prefixo I
export enum TiposAspas { Simples, Duplas }      // plural
```

---

### 6. Métodos e Assinaturas

- Método nomeado por **verbo no infinitivo** + complemento.
- Método assíncrono com sufixo `Async` obrigatório.
- Métodos booleanos devem começar por `Pode`, `Tem`, `Esta`, `Deve` ou `Eh`.

**Verbos padrão do projeto:**

`Criar`, `Adicionar`, `Obter`, `Listar`, `Atualizar`, `Remover`, `Revogar`,
`Validar`, `Verificar`, `Gerar`, `Registrar`, `Resolver`, `Mapear`, `Processar`

```typescript
// CORRETO
async obterPerfilAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacao | undefined> { }
async resolverPerfilEfetivoAsync(req: ResolverPerfilRequisicao, ct: CancellationToken): Promise<PerfilFormatacaoResposta> { }
temPerfilDefinido(uri: string): boolean { }
podeAplicarFormatacao(documento: DocumentoYaml): boolean { }

// ERRADO
async getProfile(uri: string): Promise<PerfilFormatacao | undefined> { }
async resolveEffectiveProfile(req: ResolverPerfilRequisicao): Promise<PerfilFormatacaoResposta> { }
hasProfile(uri: string): boolean { }
```

---

### 7. Exceções

- Sempre sufixo `Excecao`.
- Nomear por problema de domínio, não por detalhe técnico.
- Exceções base gerais primeiro, específicas de domínio depois.

```typescript
// CORRETO
export class YamlExtensaoExcecao extends Error { }
export class NaoEncontradoExcecao extends YamlExtensaoExcecao { }
export class PerfilNaoEncontradoExcecao extends NaoEncontradoExcecao { }
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao { }

// ERRADO
export class ProfileError extends Error { }
export class InvalidProfileException extends Error { }
```

---

### 8. DTOs, Validadores e Mapeadores

- DTOs de entrada: sufixo `Requisicao`.
- DTOs de saída: sufixo `Resposta`.
- Validadores: prefixo `Validador` + contexto.
- Mapeadores: prefixo `Mapeador` + contexto.

```typescript
// CORRETO
export interface ResolverPerfilRequisicao { }
export interface PerfilFormatacaoResposta { }
export class ValidadorPerfilFormatacao { }
export class MapeadorPerfilFormatacao { }

// ERRADO
export interface ResolveProfileDto { }
export interface FormattingProfileDto { }
export class ProfileValidator { }
export class ProfileMapper { }
```

---

### 9. Variáveis, Parâmetros e Campos Privados

- Parâmetros e variáveis em camelCase descritivo.
- Campos privados com prefixo `_`.
- `CancellationToken` deve ser nomeado como `ct`.
- Variável booleana deve expor condição (`perfilEncontrado`, `temSchema`).

```typescript
// CORRETO
private readonly _repositorioPerfil: IRepositorioPerfilProjeto;
private readonly _cache: ICacheSchema;

async resolverAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacaoResposta> {
  const perfilProjeto: PerfilFormatacao | undefined = await this._repositorioPerfil.obterAsync(uri, ct);
  const temPerfilProjeto: boolean = perfilProjeto !== undefined;

  if (!temPerfilProjeto) {
    return this._construirPerfilPadrao();
  }

  return this._mapeador.paraResposta(perfilProjeto);
}

// ERRADO
private repositorioPerfil: IRepositorioPerfilProjeto;    // sem _
private cache: ICacheSchema;                              // sem _

async resolver(u: string, token: CancellationToken) {    // u e token ruins
  const p = await this.repositorioPerfil.obterAsync(u);  // p sem significado
}
```

---

## PARTE 3 — Convenções Operacionais

### 10. `const`/`let` com Tipo Explícito como Padrão

**Regra:** sempre declarar o tipo explícito. Inferência é aceita apenas quando
o tipo é óbvio por literal simples.

```typescript
// CORRETO — tipo explícito como padrão
const perfilEfetivo: PerfilFormatacaoResposta = await servico.resolverAsync(req, ct);
const documentosAbertos: readonly DocumentoYaml[] = workspace.textDocuments.map(mapear);
const limiteItens: number = configuracao.get<number>('yaml.maxItemsComputed', 5000);
const habilitado: boolean = true;

// ACEITÁVEL — tipo óbvio por literal simples
const limite = 5000;
const prefixo = 'yaml.format';

// ERRADO — tipo implícito quando não é óbvio
const perfilEfetivo = await servico.resolverAsync(req, ct);
const documentos = workspace.textDocuments.map(mapear);
```

---

### 11. Arquivos e Pastas

- Nome do arquivo igual ao tipo público principal (PascalCase).
- Um tipo público por arquivo.
- Pastas em PascalCase.
- Exceções: arquivos de configuração de projeto (`package.json`, `tsconfig.json`, `webpack.config.js`).

```text
CORRETO
ServicoFormatacao.ts
IRepositorioPerfilProjeto.ts
ValidadorPerfilFormatacao.ts
ModoQuebra.ts
PerfilFormatacaoResposta.ts

ERRADO
formatting-service.ts
i-repository-profile.ts
validator.ts
enums.ts
```

---

## PARTE 4 — Glossário e Antipadrões

### 12. Glossário de Domínio Wl.Yaml

**Termos de domínio (português):**

- `perfil`: conjunto de regras de formatação associado a um padrão de arquivo.
- `perfilProjeto`: todos os perfis definidos no `.yaml-profile.json`.
- `padraoArquivo`: glob que determina quais arquivos um perfil se aplica.
- `associacaoSchema`: mapeamento entre um Schema URI e padrões de arquivo.
- `documentoYaml`: arquivo YAML aberto no editor.
- `configuracao`: settings do VS Code (`yaml.format.*`).
- `requisicao`: DTO de entrada.
- `resposta`: DTO de saída.
- `excecao`: erro de domínio tipado.

**Termos técnicos aceitos em inglês:**

`Schema`, `Token`, `Cache`, `ETag`, `URI`, `LSP`, `IPC`, `JSON`, `YAML`,
`Workspace`, `Glob`, `Webworker`.

---

### 13. Antipadrões de Nomenclatura

```typescript
// ERRADO — inglês
export class FormattingService { }

// ERRADO — abreviação obscura
export class SvcFmt { }

// ERRADO — método sem intenção
async processarAsync(dado: unknown): Promise<void> { }

// ERRADO — bool sem semântica
const status = perfil.habilitado;

// ERRADO — campo privado sem _
private repositorioPerfil: IRepositorioPerfilProjeto;

// CORRETO
export class ServicoFormatacao { }
async resolverPerfilEfetivoAsync(requisicao: ResolverPerfilRequisicao, ct: CancellationToken): Promise<void> { }
const perfilHabilitado: boolean = perfil.habilitado;
private readonly _repositorioPerfil: IRepositorioPerfilProjeto;
```

---

## Checklist de Nomenclatura

### Idioma e clareza

- [ ] Nome está em português (exceto termos técnicos permitidos)?
- [ ] Nome explica intenção sem comentário adicional?
- [ ] Não há abreviação desnecessária?

### Convenções por elemento

- [ ] Tipos, métodos e propriedades estão em PascalCase?
- [ ] Parâmetros, variáveis e campos privados estão em camelCase?
- [ ] Campos privados usam prefixo `_`?
- [ ] Interfaces usam prefixo `I`?
- [ ] Métodos assíncronos usam sufixo `Async`?
- [ ] Exceções usam sufixo `Excecao`?
- [ ] Enums estão no singular?

### Coerência arquitetural

- [ ] Arquivo tem mesmo nome do tipo público principal?
- [ ] Uso de tipo explícito em `const`/`let` onde necessário?
- [ ] DTOs de entrada com sufixo `Requisicao`?
- [ ] DTOs de saída com sufixo `Resposta`?

---

**Próximo:** [Valores →](VALORES.md)
