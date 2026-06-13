# Validação de Entrada — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Erros](ERROS.md)** | **[Async →](../runtime/ASYNC.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define **onde e como validar** dados de entrada no projeto Wl.Yaml:
classes `Validador`, fronteiras de validação e o tipo `ResultadoValidacao`.

**Objetivo:** toda entrada externa passa por validação explícita antes de
entrar no domínio. Nada é validado diretamente dentro de serviços.

---

## Regra de Ouro

Validação de entrada é responsabilidade de classes `Validador` dedicadas,
invocadas na camada de aplicação **antes** de qualquer serviço.

---

## Onde Validar

### Fronteira de aplicação (obrigatório)

Cada DTO de entrada tem um `Validador` correspondente em
`aplicacao/Validadores/`. O serviço **não valida** — ele confia que o
Validador já fez isso antes.

```text
aplicacao/
└── Validadores/
    ├── Formatacao/
    │   └── ValidadorPerfilFormatacao.ts
    └── Schema/
        └── ValidadorAssociacaoSchema.ts
```

### Fronteira de sistema de arquivos (obrigatório)

Dados lidos do `.yaml-profile.json` ou de settings do VS Code são `unknown`
e precisam ser verificados estruturalmente antes de entrar no domínio.

```text
infraestrutura/Persistencia/
└── RepositorioPerfilArquivo.ts  ← lê arquivo, verifica estrutura, lança PerfilInvalidoExcecao
```

### Dentro de Value Objects (obrigatório)

Invariantes de domínio são verificadas no construtor do Value Object.

```text
nucleo/ValueObjects/
├── TamanhoIndentacao.ts   ← lança ConfiguracaoInvalidaExcecao se valor inválido
├── PadraoArquivo.ts       ← lança ConfiguracaoInvalidaExcecao se glob vazio
└── UriSchema.ts           ← lança ConfiguracaoInvalidaExcecao se URI malformada
```

---

## Tipo `ResultadoValidacao`

```typescript
// aplicacao/Validadores/ResultadoValidacao.ts

/**
 * Resultado de uma operação de validação de entrada.
 */
export class ResultadoValidacao {
  private constructor(
    readonly valido: boolean,
    readonly erros: readonly string[]
  ) {}

  static valido(): ResultadoValidacao {
    return new ResultadoValidacao(true, []);
  }

  static invalido(erros: readonly string[]): ResultadoValidacao {
    return new ResultadoValidacao(false, erros);
  }
}
```

---

## Implementando um Validador

```typescript
// aplicacao/Validadores/Formatacao/ValidadorPerfilFormatacao.ts

/**
 * Valida os dados de entrada para criação ou atualização de perfil de formatação.
 */
export class ValidadorPerfilFormatacao {
  private static readonly _INDENTACAO_MINIMA = 1;
  private static readonly _INDENTACAO_MAXIMA = 8;
  private static readonly _LARGURA_MINIMA    = 40;
  private static readonly _LARGURA_MAXIMA    = 200;

  /**
   * Valida os campos obrigatórios e regras de negócio de um perfil de formatação.
   *
   * @param entrada - Dados brutos do perfil a validar.
   * @returns Resultado com lista de erros, ou resultado válido se sem erros.
   */
  validar(entrada: PerfilFormatacaoEntrada): ResultadoValidacao {
    const erros: string[] = [];

    if (entrada.indentacao < ValidadorPerfilFormatacao._INDENTACAO_MINIMA ||
        entrada.indentacao > ValidadorPerfilFormatacao._INDENTACAO_MAXIMA) {
      erros.push(`Indentação deve estar entre ${ValidadorPerfilFormatacao._INDENTACAO_MINIMA} e ${ValidadorPerfilFormatacao._INDENTACAO_MAXIMA}.`);
    }

    if (!entrada.padraoArquivo || entrada.padraoArquivo.length === 0) {
      erros.push('Padrão de arquivo é obrigatório.');
    }

    if (entrada.larguraLinha !== undefined) {
      if (entrada.larguraLinha < ValidadorPerfilFormatacao._LARGURA_MINIMA ||
          entrada.larguraLinha > ValidadorPerfilFormatacao._LARGURA_MAXIMA) {
        erros.push(`Largura de linha deve estar entre ${ValidadorPerfilFormatacao._LARGURA_MINIMA} e ${ValidadorPerfilFormatacao._LARGURA_MAXIMA}.`);
      }
    }

    return erros.length === 0
      ? ResultadoValidacao.valido()
      : ResultadoValidacao.invalido(erros);
  }
}
```

---

## Usando o Validador no Serviço

```typescript
// aplicacao/Servicos/Implementacoes/ServicoFormatacao.ts

export class ServicoFormatacao implements IServicoFormatacao {
  private readonly _validador: ValidadorPerfilFormatacao;

  constructor(
    validador: ValidadorPerfilFormatacao,
    repositorioPerfil: IRepositorioPerfilProjeto,
    ...
  ) {
    this._validador = validador;
    // ...
  }

  async salvarPerfilAsync(
    entrada: PerfilFormatacaoEntrada,
    ct: CancellationToken
  ): Promise<void> {
    const resultado = this._validador.validar(entrada);

    if (!resultado.valido) {
      throw new EntradaInvalidaExcecao(resultado.erros.join('; '));
    }

    // continua apenas com dados válidos
    const entidade = this._mapeador.paraEntidade(entrada);
    await this._repositorioPerfil.salvarAsync(entidade, ct);
  }
}
```

---

## Validação Estrutural em Fronteira de Arquivo

```typescript
// infraestrutura/Persistencia/RepositorioPerfilArquivo.ts

async obterAsync(uriWorkspace: string, ct: CancellationToken): Promise<PerfilProjeto | undefined> {
  const uri = Uri.joinPath(Uri.parse(uriWorkspace), '.yaml-profile.json');

  let dado: unknown;
  try {
    const bytes = await workspace.fs.readFile(uri);
    dado = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return undefined;  // arquivo ausente — sem perfil de projeto
  }

  if (!this._ehPerfilRaw(dado)) {
    throw new PerfilInvalidoExcecao('Estrutura do .yaml-profile.json é inválida.');
  }

  return this._mapeador.paraEntidade(dado);
}

private _ehPerfilRaw(dado: unknown): dado is PerfilProjetoRaw {
  return (
    typeof dado === 'object' &&
    dado !== null &&
    'versao' in dado &&
    typeof (dado as Record<string, unknown>).versao === 'number' &&
    'perfis' in dado &&
    Array.isArray((dado as Record<string, unknown>).perfis)
  );
}
```

---

## O Que Não É Validação

- **Value Objects** — validação de invariante, não de entrada externa.
- **Guard clauses em serviços** — verificação de pré-condição de contrato
  (parâmetro nulo), não validação de negócio.
- **Narrowing de `unknown`** — verificação de tipo, parte do parsing de
  fronteira, não um Validador de negócio.

---

## Checklist de Validação

- [ ] DTO de entrada tem Validador correspondente em `Validadores/`?
- [ ] Serviço chama Validador antes de qualquer lógica de negócio?
- [ ] Dados de arquivo externo passam por guard `ehXxxRaw()` antes de entrar?
- [ ] Value Objects verificam invariantes no construtor?
- [ ] Validador retorna `ResultadoValidacao`, não lança exceção diretamente?
- [ ] Mensagens de erro são descritivas e em português?

---

**Próximo:** [Async →](../runtime/ASYNC.md)
