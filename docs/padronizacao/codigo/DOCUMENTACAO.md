# Documentação de Código (JSDoc) — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Valores](VALORES.md)** | **[Testes →](../qualidade/TESTES.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define as **regras obrigatórias de documentação JSDoc** para o projeto Wl.Yaml.

**Objetivo:** fazer com que o código seja compreensível sem leitura completa da
implementação, melhorando manutenção, review e onboarding.

---

## Regra de Ouro

Documentação JSDoc não é enfeite. É contrato técnico.

Se um membro tem impacto arquitetural, de negócio, fluxo de decisão ou uso
público, ele deve ser documentado com contexto suficiente para uso seguro.

---

## Escopo de Aplicação

### Obrigatório sempre

- Tipos públicos (`class`, `interface`, `enum`, exceções, value objects).
- Membros públicos (construtores, métodos, propriedades).
- Contratos de interface pública da extensão (`ApiExtensaoSchema`).

### Obrigatório por complexidade

- Dependências privadas injetadas via construtor que são centrais para o comportamento.
- Métodos privados não triviais (regra, decisão, orquestração, segurança).
- Membros com pré-condição, pós-condição ou efeito colateral relevante.

### Não recomendado

- Método privado trivial de uma linha sem regra (`return this._valor;`).
- Comentário que apenas repete o nome do membro.
- Descrição de detalhe de implementação sem valor de uso.

---

## Tags e Critério de Uso

### `@param`

Obrigatório para cada parâmetro de método documentado.

- Explicar o papel do parâmetro no comportamento.
- Informar restrições importantes (obrigatório, faixa, formato).

### `@returns`

Obrigatório quando houver retorno diferente de `void` / `Promise<void>`.

- Explicar valor retornado e cenários especiais (`undefined`, vazio).

### `@throws`

Obrigatório para exceções esperadas de contrato.

- Documentar apenas exceções relevantes para o consumidor.
- Priorizar exceções de domínio e validação.

### `@remarks`

Obrigatório quando houver regra arquitetural, ordem de decisão ou detalhe
que não cabe no `@summary`.

### `@example`

Opcional e recomendado para contratos públicos com uso sensível.

---

## Exemplos por Tipo de Membro

### Interface de Serviço

```typescript
/**
 * Contrato para resolução do perfil de formatação efetivo de um documento YAML.
 *
 * @remarks
 * Aplica precedência: `.yaml-profile.json` → workspace settings → global settings → defaults.
 * Implementações devem ser tolerantes a ausência do `.yaml-profile.json` — retornar
 * o perfil resolvido pelas demais camadas, nunca lançar exceção.
 */
export interface IServicoFormatacao {
  /**
   * Resolve o perfil de formatação efetivo para o documento informado.
   *
   * @param requisicao - URI do documento e contexto do workspace.
   * @param ct - Token de cancelamento da operação.
   * @returns Perfil resolvido com todos os campos preenchidos.
   * @throws {PerfilInvalidoExcecao} Quando o `.yaml-profile.json` contém dados malformados.
   */
  resolverPerfilEfetivoAsync(
    requisicao: ResolverPerfilRequisicao,
    ct: CancellationToken
  ): Promise<PerfilFormatacaoResposta>;
}
```

### Classe de Serviço

```typescript
/**
 * Implementação padrão do serviço de formatação.
 *
 * @remarks
 * Orquestra os repositórios de perfil e configurações para resolver o perfil efetivo.
 * Não conhece VS Code nem vscode-languageclient — depende apenas de interfaces do nucleo.
 */
export class ServicoFormatacao implements IServicoFormatacao {
  /**
   * Repositório responsável por ler `.yaml-profile.json` do workspace.
   * @remarks Camada de maior prioridade na resolução de perfil.
   */
  private readonly _repositorioPerfil: IRepositorioPerfilProjeto;

  /**
   * Repositório responsável por ler as configurações `yaml.format.*` do VS Code.
   * @remarks Camada intermediária — sobreposta pelo arquivo de perfil quando presente.
   */
  private readonly _repositorioConfiguracoes: IRepositorioConfiguracoes;

  /**
   * Inicializa o serviço com as dependências necessárias para resolução de perfil.
   *
   * @param repositorioPerfil - Repositório do `.yaml-profile.json`.
   * @param repositorioConfiguracoes - Repositório das configurações do VS Code.
   * @param mapeador - Mapeador de entidade para DTO de saída.
   */
  constructor(
    repositorioPerfil: IRepositorioPerfilProjeto,
    repositorioConfiguracoes: IRepositorioConfiguracoes,
    mapeador: MapeadorPerfilFormatacao
  ) { ... }
}
```

### Enum

```typescript
/**
 * Modo de quebra de linha para formatação de texto em prosa YAML.
 */
export enum ModoQuebra {
  /** Mantém a quebra original do arquivo. */
  Preservar = 'preserve',

  /** Nunca insere quebras adicionais. */
  Nunca = 'never',

  /** Sempre quebra na largura definida por `larguraLinha`. */
  Sempre = 'always',
}
```

### Exceção de Domínio

```typescript
/**
 * Exceção lançada quando o `.yaml-profile.json` contém dados estruturalmente inválidos.
 */
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
  /**
   * Inicializa a exceção com a mensagem descritiva do problema encontrado.
   *
   * @param detalhe - Descrição específica do campo ou estrutura inválida.
   */
  constructor(detalhe: string) {
    super(`Perfil de formatação inválido: ${detalhe}`);
  }
}
```

### Value Object

```typescript
/**
 * Representa o tamanho de indentação YAML, garantindo valores válidos.
 *
 * @remarks
 * Aceita apenas valores entre 1 e 8 (inclusive). Qualquer valor fora desse
 * intervalo resulta em {@link ConfiguracaoInvalidaExcecao} no construtor.
 */
export class TamanhoIndentacao {
  private readonly _valor: number;

  /**
   * Cria uma instância validada de tamanho de indentação.
   *
   * @param valor - Número de espaços por nível de indentação (1–8).
   * @throws {ConfiguracaoInvalidaExcecao} Quando `valor` está fora do intervalo permitido.
   */
  constructor(valor: number) { ... }

  /**
   * Valor numérico da indentação.
   *
   * @returns Inteiro entre 1 e 8.
   */
  get valor(): number {
    return this._valor;
  }
}
```

### Método Privado Não Trivial

```typescript
/**
 * Aplica a precedência de resolução entre as camadas de configuração.
 *
 * @remarks
 * Ordem obrigatória: `.yaml-profile.json` (mais específico) → workspace settings
 * → global settings → defaults da extensão (mais genérico). Cada camada preenche
 * apenas os campos ausentes da camada anterior.
 */
private async _resolverPorPrecedenciaAsync(
  uriDocumento: string,
  ct: CancellationToken
): Promise<PerfilFormatacaoResposta> { ... }
```

---

## Anti-Padrões Comuns

### 1) Repetir o nome do membro

```typescript
// ERRADO
/** Obtém o perfil. */
obterPerfilAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacao | undefined>;

// CORRETO
/** Busca o perfil de formatação definido para o documento, ou `undefined` se ausente. */
obterPerfilAsync(uri: string, ct: CancellationToken): Promise<PerfilFormatacao | undefined>;
```

### 2) Ocultar comportamento relevante

```typescript
// ERRADO
/** Resolve o perfil. */
resolverPerfilEfetivoAsync(req: ResolverPerfilRequisicao, ct: CancellationToken): Promise<PerfilFormatacaoResposta>;

// CORRETO
/**
 * Resolve o perfil efetivo aplicando precedência entre arquivo de projeto,
 * workspace settings e global settings.
 *
 * @throws {PerfilInvalidoExcecao} Quando `.yaml-profile.json` contém dados malformados.
 */
resolverPerfilEfetivoAsync(req: ResolverPerfilRequisicao, ct: CancellationToken): Promise<PerfilFormatacaoResposta>;
```

### 3) JSDoc em método privado trivial

```typescript
// ERRADO
/** Retorna o valor. */
private _obterValor(): number { return this._valor; }

// CORRETO
private _obterValor(): number { return this._valor; }
```

---

## Checklist de Documentação

- [ ] Todos os tipos públicos possuem `@summary`?
- [ ] Métodos públicos possuem `@param` e `@returns` quando aplicável?
- [ ] Exceções esperadas estão em `@throws`?
- [ ] Métodos privados não triviais estão documentados?
- [ ] Dependências privadas centrais têm `@remarks` explicando o papel?
- [ ] Comentários explicam intenção, não detalhe mecânico?
- [ ] Linguagem está em português técnico e objetiva?
- [ ] Sem JSDoc redundante em membro trivial?

---

**Próximo:** [Testes →](../qualidade/TESTES.md)
