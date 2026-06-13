# TypeScript — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Estrutura](../fundamentos/ESTRUTURA.md)** | **[Condicionais →](CONDICIONAIS.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define os **idiomas obrigatórios do TypeScript** no projeto Wl.Yaml:
quais construções usar, quais evitar e por quê.

**Objetivo:** base de código consistente, segura em tempo de compilação e
livre de surpresas em runtime.

---

## 1. `interface` vs `type`

### Regra

- Use `interface` para **contratos** (DTOs, shape de objetos, contratos de serviço).
- Use `type` apenas para **aliases de união/interseção** ou tipos utilitários.
- Nunca use `type` onde uma `interface` serviria — `interface` é extensível e
  produz erros mais claros.

```typescript
// CORRETO — interface para contratos
export interface PerfilFormatacaoResposta {
  readonly indentacao: number;
  readonly aspasSimplesHabilitadas: boolean;
  readonly larguraLinha: number;
  readonly virgulasFinais: boolean;
  readonly modoQuebra: ModoQuebra;
}

export interface IServicoFormatacao {
  resolverPerfilEfetivoAsync(
    requisicao: ResolverPerfilRequisicao,
    ct: CancellationToken
  ): Promise<PerfilFormatacaoResposta>;
}

// CORRETO — type para união
type ResultadoValidacao = ValidacaoSucesso | ValidacaoFalha;

// ERRADO — type para contrato simples
type PerfilFormatacaoResposta = { indentacao: number; };
```

---

## 2. `class` para Entidades e Serviços

### Regra

- Use `class` para **entidades de domínio** (com invariantes no construtor),
  **serviços** e **repositórios** (com dependências injetadas).
- Campos privados com prefixo `_` e tipo explícito.
- `readonly` em tudo que não muda após construção.

```typescript
// CORRETO — entidade com invariantes
export class TamanhoIndentacao {
  private readonly _valor: number;

  constructor(valor: number) {
    if (valor < 1 || valor > 8) {
      throw new ConfiguracaoInvalidaExcecao(
        `Indentação deve estar entre 1 e 8. Recebido: ${valor}`
      );
    }
    this._valor = valor;
  }

  get valor(): number {
    return this._valor;
  }
}

// CORRETO — serviço com dependências injetadas
export class ServicoFormatacao implements IServicoFormatacao {
  private readonly _repositorioPerfil: IRepositorioPerfilProjeto;
  private readonly _repositorioConfiguracoes: IRepositorioConfiguracoes;
  private readonly _mapeador: MapeadorPerfilFormatacao;

  constructor(
    repositorioPerfil: IRepositorioPerfilProjeto,
    repositorioConfiguracoes: IRepositorioConfiguracoes,
    mapeador: MapeadorPerfilFormatacao
  ) {
    this._repositorioPerfil = repositorioPerfil;
    this._repositorioConfiguracoes = repositorioConfiguracoes;
    this._mapeador = mapeador;
  }
}
```

---

## 3. `readonly` em Tudo Que Não Muda

### Regra

Aplique `readonly` em campos de classe, propriedades de interface e arrays
sempre que o valor não deve ser reatribuído após construção.

```typescript
// CORRETO
export interface ResolverPerfilRequisicao {
  readonly uriDocumento: string;
  readonly uriWorkspace: string | undefined;
}

export class ValidadorPerfilFormatacao {
  private readonly _limiteIndentacaoMinimo = 1;
  private readonly _limiteIndentacaoMaximo = 8;
}

// Para arrays: prefira ReadonlyArray ou readonly T[]
async listarPerfisAsync(ct: CancellationToken): Promise<readonly PerfilFormatacao[]> { }

// ERRADO — sem readonly onde o valor não muda
export interface ResolverPerfilRequisicao {
  uriDocumento: string;   // mutável acidentalmente
}
```

---

## 4. Proibição de `any`

### Regra

`any` desabilita completamente a checagem de tipos. **Proibido** em todo o
código de produção.

- Use `unknown` quando o tipo for genuinamente desconhecido (dado externo,
  resposta HTTP, settings do VS Code).
- Faça narrowing explícito antes de usar.

```typescript
// ERRADO
function processarConteudo(conteudo: any): string {
  return conteudo.text;
}

// CORRETO
function processarConteudo(conteudo: unknown): string {
  if (typeof conteudo !== 'string') {
    throw new EntradaInvalidaExcecao('conteudo deve ser string');
  }
  return conteudo;
}

// CORRETO — dado de settings do VS Code
const indentacao: unknown = configuracao.get('yaml.format.indent');
if (typeof indentacao !== 'number') {
  return INDENTACAO_PADRAO;
}
const tamanho = new TamanhoIndentacao(indentacao);
```

---

## 5. Proibição de `!` (Non-Null Assertion)

### Regra

`!` força o compilador a ignorar possibilidade de `null`/`undefined` sem
garantia em runtime. **Proibido.**

Use optional chaining `?.`, nullish coalescing `??` ou guard clauses.

```typescript
// ERRADO
const nome = usuario!.nome;
const uri = workspaceFolders![0].uri;

// CORRETO — optional chaining
const nome = usuario?.nome ?? '';

// CORRETO — guard clause
const pastas = workspace.workspaceFolders;
if (!pastas || pastas.length === 0) {
  return undefined;
}
const uri = pastas[0].uri;
```

---

## 6. Tipos Explícitos em Retorno de Método Público

### Regra

Métodos públicos devem ter **tipo de retorno explícito**. Métodos privados
triviais podem usar inferência.

```typescript
// CORRETO — retorno explícito em públicos
async resolverPerfilEfetivoAsync(
  requisicao: ResolverPerfilRequisicao,
  ct: CancellationToken
): Promise<PerfilFormatacaoResposta> {
  // ...
}

obterIndentacaoPadrao(): number {
  return 2;
}

// ACEITÁVEL — retorno inferido em privado trivial
private construirChaveCache(uri: string) {
  return `schema-cache-${uri}`;
}
```

---

## 7. Sem `var`

### Regra

`var` tem escopo de função e sofre hoisting — comportamento surpreendente.
**Proibido.** Use sempre `const` ou `let`.

- `const` para tudo que não é reatribuído.
- `let` apenas quando reatribuição é necessária.

```typescript
// ERRADO
var perfil = await this._repositorioPerfil.obterAsync(uri, ct);

// CORRETO
const perfil: PerfilFormatacao | undefined = await this._repositorioPerfil.obterAsync(uri, ct);

// CORRETO — let quando reatribuição é necessária
let uriEfetiva: string = uriDocumento;
if (!uriEfetiva.startsWith('file://')) {
  uriEfetiva = `file://${uriEfetiva}`;
}
```

---

## 8. Nullability: `undefined` vs `null`

### Regra

- Use `undefined` para valores ausentes/opcionais.
- Use `null` apenas quando a API do VS Code ou uma biblioteca externa o exige.
- Nunca misture `null` e `undefined` para o mesmo conceito.

```typescript
// CORRETO — ausência com undefined
async obterPerfilAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacao | undefined> {
  // ...
}

// CORRETO — null quando VS Code retorna null
const editor: TextEditor | undefined = window.activeTextEditor ?? undefined;

// ERRADO — mistura
async obterPerfilAsync(uri: string): Promise<PerfilFormatacao | null | undefined> { }
```

---

## 9. Narrowing Explícito antes de Usar `unknown`

### Regra

Após receber um valor `unknown` (parsing JSON, configuração, resposta HTTP),
sempre faça narrowing explícito antes de usar.

```typescript
// CORRETO — narrowing de dado externo
async lerArquivoPerfilAsync(uri: Uri, ct: CancellationToken): Promise<PerfilProjetoRaw> {
  const bytes: Uint8Array = await workspace.fs.readFile(uri);
  const texto: string = new TextDecoder().decode(bytes);
  const dado: unknown = JSON.parse(texto);

  if (!this._ehPerfilProjetoRaw(dado)) {
    throw new PerfilInvalidoExcecao('Estrutura do .yaml-profile.json é inválida.');
  }

  return dado;
}

private _ehPerfilProjetoRaw(dado: unknown): dado is PerfilProjetoRaw {
  return (
    typeof dado === 'object' &&
    dado !== null &&
    'versao' in dado &&
    'perfis' in dado &&
    Array.isArray((dado as Record<string, unknown>).perfis)
  );
}
```

---

## 10. `enum` vs `const enum` vs Union de Strings

### Regra

- Use `enum` para estados de domínio com **significado semântico** nomeado.
- Use union de strings literais para **valores de configuração** simples que
  aparecem em JSON/settings.
- Evite `const enum` — não funciona corretamente com bundlers externos.

```typescript
// CORRETO — enum para estado de domínio
export enum ModoQuebra {
  Preservar = 'preserve',
  Nunca     = 'never',
  Sempre    = 'always',
}

// CORRETO — union para valores de configuração próximos ao settings.json
type ModoQuebraConfig = 'preserve' | 'never' | 'always';

// ERRADO — const enum (problema com bundlers)
const enum TipoAspas { Simples, Duplas }
```

---

## Checklist TypeScript

- [ ] `interface` para contratos, `type` somente para uniões/aliases?
- [ ] `class` para entidades e serviços com campos `private readonly _`?
- [ ] `readonly` em todos os campos que não mudam após construção?
- [ ] Zero `any` no código de produção?
- [ ] Zero `!` (non-null assertion)?
- [ ] Tipos de retorno explícitos em métodos públicos?
- [ ] `const` ou `let` (sem `var`)?
- [ ] `undefined` para ausência (não `null`)?
- [ ] Narrowing explícito antes de usar `unknown`?
- [ ] `enum` com valor string para estados de domínio?

---

**Próximo:** [Condicionais →](CONDICIONAIS.md)
