# Valores e Tipos de Dados — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Nomenclatura](NOMENCLATURA.md)** | **[Estrutura →](../fundamentos/ESTRUTURA.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define **quais tipos usar para cada categoria de valor** no projeto Wl.Yaml.

**Objetivo:** reduzir erros de modelagem e tornar o critério de escolha de
tipos previsível.

---

## Mapa de Decisão Rápida

- Texto simples: `string` com semântica clara no nome.
- Texto com regra de domínio: Value Object (`TamanhoIndentacao`, `PadraoArquivo`, `UriSchema`).
- Contagem/tamanho: `number`.
- Estado binário: `boolean`.
- Estado finito nomeado: `enum`.
- Ausência de valor: `undefined` (não `null`).
- Coleção somente-leitura: `readonly T[]` ou `ReadonlyArray<T>`.
- Lookup por chave: `Map<K, V>` ou `Record<K, V>`.
- Membership rápido: `Set<T>`.

---

## 1. Tipos de Texto

### `string` — Textos Gerais

Use `string` para textos livres ou labels sem invariantes de domínio.

```typescript
// URI do documento — string simples
readonly uriDocumento: string;

// Nome do perfil — string com semântica no nome
readonly nomePerfil: string;
```

### `string` vs Value Object

**Quando `string` é suficiente:**

- Valor apenas exibido ou transportado.
- Sem regra de validação própria reutilizável.

**Quando promover para Value Object:**

- Existe formato obrigatório (ex.: glob pattern, URI com scheme específico).
- Existe invariante de domínio (ex.: tamanho de indentação entre 1 e 8).
- O valor aparece em múltiplos pontos e deve ser validado sempre igual.

```typescript
// OK para texto simples
readonly nomeSchema: string;

// Value Object quando há invariante
export class TamanhoIndentacao {
  private readonly _valor: number;

  constructor(valor: number) {
    if (valor < 1 || valor > 8) {
      throw new ConfiguracaoInvalidaExcecao(`Indentação deve ser entre 1 e 8. Recebido: ${valor}`);
    }
    this._valor = valor;
  }

  get valor(): number { return this._valor; }
}

export class PadraoArquivo {
  private readonly _glob: string;

  constructor(glob: string) {
    if (!glob || glob.trim().length === 0) {
      throw new ConfiguracaoInvalidaExcecao('Padrão de arquivo não pode ser vazio.');
    }
    this._glob = glob.trim();
  }

  get glob(): string { return this._glob; }

  corresponde(uri: string): boolean {
    return minimatch(uri, this._glob);
  }
}
```

---

## 2. Tipos Numéricos

### `number` — Contadores, Tamanhos e Limites

```typescript
// Indentação — número validado por Value Object
readonly indentacao: number;    // valor de TamanhoIndentacao

// Largura de linha
readonly larguraLinha: number;

// Limite de itens computados
readonly limiteItens: number;

// CONSTANTES — sem números mágicos
const INDENTACAO_PADRAO    = 2;
const LARGURA_LINHA_PADRAO = 80;
const LIMITE_ITENS_PADRAO  = 5000;
const INDENTACAO_MINIMA    = 1;
const INDENTACAO_MAXIMA    = 8;
```

---

## 3. Tipos Booleanos

### `boolean` — Flags de Estado

Use `boolean` apenas para estado binário real e nomeie com semântica clara.

```typescript
// CORRETO — nome semântico
readonly aspasSimplesHabilitadas: boolean;
readonly virgulasFinaisHabilitadas: boolean;
readonly validacaoHabilitada: boolean;
readonly hoverHabilitado: boolean;
readonly completionHabilitada: boolean;

// CORRETO — variável local com nome semântico
const temPerfilProjeto: boolean = perfilProjeto !== undefined;
const documentoEhYaml: boolean = documento.languageId === 'yaml';

// ERRADO — nome sem semântica
readonly flag: boolean;
const ok: boolean = perfilProjeto !== undefined;
```

**Sinal de modelagem ruim:** se precisa de mais de dois estados, usar enum.

```typescript
// ERRADO — bool para estado com múltiplas variações
readonly habilitado: boolean;
readonly desabilitadoManualmente: boolean;
readonly desabilitadoAutomaticamente: boolean;

// CORRETO — enum para estados múltiplos
export enum StatusDeteccaoSchema {
  Habilitado           = 'habilitado',
  DesabilitadoManual   = 'desabilitado-manual',
  DesabilitadoAuto     = 'desabilitado-auto',
}
```

---

## 4. Enums e Constantes

### `enum` — Estados Finitos de Domínio

Use enum para estados finitos com **significado semântico nomeado**.
Sempre atribua valores string — facilitam depuração e serialização.

```typescript
// CORRETO — enum com valor string
export enum TipoAspas {
  Simples = 'single',
  Duplas  = 'double',
}

export enum ModoQuebra {
  Preservar = 'preserve',
  Nunca     = 'never',
  Sempre    = 'always',
}

// Uso com switch exaustivo
function resolverModoQuebraLsp(modo: ModoQuebra): string {
  switch (modo) {
    case ModoQuebra.Preservar: return 'preserve';
    case ModoQuebra.Nunca:     return 'never';
    case ModoQuebra.Sempre:    return 'always';
    default: {
      const _exaustivo: never = modo;
      throw new ConfiguracaoInvalidaExcecao(`ModoQuebra desconhecido: ${_exaustivo}`);
    }
  }
}
```

### Constantes de Domínio — sem Números Mágicos

```typescript
// CORRETO — constantes nomeadas por módulo
export const LIMITES_FORMATACAO = {
  INDENTACAO_MINIMA:    1,
  INDENTACAO_MAXIMA:    8,
  LARGURA_LINHA_MINIMA: 40,
  LARGURA_LINHA_MAXIMA: 200,
} as const;

export const PADROES_FORMATACAO = {
  INDENTACAO:          2,
  LARGURA_LINHA:       80,
  VIRGULAS_FINAIS:     true,
  ASPAS_SIMPLES:       false,
  MODO_QUEBRA:         ModoQuebra.Preservar,
} as const;

// ERRADO — números mágicos espalhados
if (indentacao < 1 || indentacao > 8) { ... }  // 1 e 8 sem nome
```

---

## 5. Coleções

### `readonly T[]` / `ReadonlyArray<T>` — Coleções de Leitura

Use em contratos e retorno de serviços quando a coleção não deve ser mutada.

```typescript
// Interfaces e DTOs — sempre readonly
export interface PerfilProjetoResposta {
  readonly perfis: readonly PerfilFormatacaoResposta[];
}

async listarPerfisAsync(ct: CancellationToken): Promise<readonly PerfilFormatacao[]> { }
```

### `T[]` — Mutação Local

Use apenas dentro de métodos onde construção incremental é necessária.

```typescript
// CORRETO — lista mutável apenas enquanto construindo
private _construirAssociacoes(extensoes: readonly Extension<unknown>[]): AssociacaoSchema[] {
  const associacoes: AssociacaoSchema[] = [];
  for (const extensao of extensoes) {
    const yamlValidation = extensao.packageJSON?.contributes?.yamlValidation;
    if (Array.isArray(yamlValidation)) {
      associacoes.push(...yamlValidation.map(this._mapeador.mapear));
    }
  }
  return associacoes;
}
```

### `Map<K, V>` — Lookup por Chave

Para acesso direto por chave (roteamento, cache, estratégia).

```typescript
private readonly _contribuidores: Map<string, IContribuidorSchema> = new Map();

registrarContribuidor(schema: string, contribuidor: IContribuidorSchema): boolean {
  if (this._contribuidores.has(schema)) {
    return false;
  }
  this._contribuidores.set(schema, contribuidor);
  return true;
}
```

### `Set<T>` — Membership Rápido

Para verificação frequente de pertencimento.

```typescript
private readonly _extensoesConflitantes: Set<string> = new Set([
  'vscoss.vscode-ansible',
  'sysninja.vscode-ansible-mod',
  'haaaad.ansible',
]);

ehConflitante(idExtensao: string): boolean {
  return this._extensoesConflitantes.has(idExtensao);
}
```

---

## 6. Conversões e Parsing

### Conversão Segura em Fronteiras

Entrada externa (settings VS Code, arquivo JSON, resposta HTTP) deve passar
por validação explícita antes de entrar no domínio.

```typescript
// CORRETO — narrowing explícito
function obterIndentacaoConfigurada(configuracao: WorkspaceConfiguration): number {
  const valor: unknown = configuracao.get('yaml.format.indent');

  if (typeof valor !== 'number' || !Number.isInteger(valor)) {
    return PADROES_FORMATACAO.INDENTACAO;
  }

  if (valor < LIMITES_FORMATACAO.INDENTACAO_MINIMA || valor > LIMITES_FORMATACAO.INDENTACAO_MAXIMA) {
    return PADROES_FORMATACAO.INDENTACAO;
  }

  return valor;
}

// ERRADO — cast direto sem validação
const indentacao = configuracao.get('yaml.format.indent') as number;
```

---

## 7. `interface` para DTOs — Forma Idiomática

DTOs de entrada e saída devem ser `interface` com propriedades `readonly`.
Nunca use `class` para DTOs — eles não têm comportamento nem invariantes.

```typescript
// CORRETO — interface readonly
export interface ResolverPerfilRequisicao {
  readonly uriDocumento: string;
  readonly uriWorkspace: string | undefined;
}

export interface PerfilFormatacaoResposta {
  readonly indentacao: number;
  readonly aspasSimplesHabilitadas: boolean;
  readonly larguraLinha: number;
  readonly virgulasFinaisHabilitadas: boolean;
  readonly modoQuebra: ModoQuebra;
}

// ERRADO — class para DTO
export class PerfilFormatacaoResposta {
  indentacao: number = 2;
  // ...
}
```

---

## Checklist de Valores

- [ ] Strings com regra de domínio viraram Value Objects?
- [ ] Sem números mágicos — constantes nomeadas?
- [ ] `enum` com valor string para estados finitos?
- [ ] `boolean` com nome semântico?
- [ ] Coleções em interfaces e DTOs usam `readonly T[]`?
- [ ] `Map` para lookup por chave dinâmica?
- [ ] `Set` para membership frequente?
- [ ] Conversões externas fazem narrowing explícito?
- [ ] DTOs são `interface` com `readonly`, não `class`?
- [ ] `undefined` para ausência (não `null`)?

---

**Próximo:** [Estrutura →](../fundamentos/ESTRUTURA.md)
