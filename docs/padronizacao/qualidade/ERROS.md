# Tratamento de Erros — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← CI/CD](CICD.md)** | **[Validação →](VALIDACAO.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define as **regras para exceções** no projeto Wl.Yaml: hierarquia, um
arquivo por exceção, quando lançar e como tratar.

**Objetivo:** mensagens de erro úteis, rastreáveis e testáveis, sem
`throw new Error('string solta')` em nenhum ponto do código.

---

## Regra de Ouro

Toda exceção de domínio ou aplicação tem sua própria classe em `Excecoes/`,
em seu próprio arquivo.

Nunca lance `new Error()` diretamente no código de produção.

---

## Por Que Um Arquivo Por Exceção

Cada exceção tem seu próprio motivo para mudar. A mensagem de `PerfilInvalidoExcecao`
pode precisar incluir o campo inválido. `SchemaNaoEncontradoExcecao` pode precisar
carregar a URI que falhou. `PerfilNaoEncontradoExcecao` pode precisar de um campo
adicional com os nomes disponíveis.

Essas são evoluções completamente independentes. Colocar múltiplas exceções num
único arquivo (`Erros.ts`, `Excecoes.ts`) acopla motivos de mudança que não têm
relação entre si — qualquer alteração em uma exceção implica abrir e modificar
um arquivo que contém outras.

```text
// ERRADO — múltiplas exceções num arquivo
// Excecoes.ts
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao { ... }
export class PerfilNaoEncontradoExcecao extends NaoEncontradoExcecao { ... }
export class SchemaNaoEncontradoExcecao extends NaoEncontradoExcecao { ... }
// → três motivos para mudar no mesmo arquivo

// CORRETO — cada exceção em seu próprio arquivo
// PerfilInvalidoExcecao.ts      → muda quando a mensagem ou estrutura de perfil inválido muda
// PerfilNaoEncontradoExcecao.ts → muda quando a mensagem ou campos de perfil ausente mudam
// SchemaNaoEncontradoExcecao.ts → muda quando a mensagem ou dados de schema ausente mudam
```

Cada arquivo tem exatamente um motivo para mudar. Cada exceção pode evoluir,
ser testada e ser renomeada sem nenhum risco de afetar as outras.

---

## Hierarquia de Exceções

```text
Error (nativo TypeScript)
└── YamlExtensaoExcecao                   ← base de todas as exceções do projeto
    ├── NaoEncontradoExcecao              ← recurso não encontrado
    │   ├── PerfilNaoEncontradoExcecao
    │   └── SchemaNaoEncontradoExcecao
    ├── ConfiguracaoInvalidaExcecao       ← dados de configuração inválidos
    │   └── PerfilInvalidoExcecao
    └── EntradaInvalidaExcecao            ← pré-condição de entrada violada
```

---

## Localização dos Arquivos

```text
src/nucleo/Excecoes/
├── Base/
│   ├── YamlExtensaoExcecao.ts
│   ├── NaoEncontradoExcecao.ts
│   ├── ConfiguracaoInvalidaExcecao.ts
│   └── EntradaInvalidaExcecao.ts
├── Perfil/
│   ├── PerfilInvalidoExcecao.ts
│   └── PerfilNaoEncontradoExcecao.ts
└── Schema/
    ├── SchemaNaoEncontradoExcecao.ts
    └── SchemaInvalidoExcecao.ts
```

**Regra:** uma exceção por arquivo, nome do arquivo = nome da classe.

---

## Implementação

### Base — `YamlExtensaoExcecao`

```typescript
// nucleo/Excecoes/Base/YamlExtensaoExcecao.ts

/**
 * Classe base de todas as exceções lançadas pela extensão Wl.Yaml.
 *
 * @remarks
 * Permite captura genérica no ponto de entrada da extensão sem
 * suprimir erros de terceiros ou do runtime.
 */
export abstract class YamlExtensaoExcecao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

### Não-Encontrado — `NaoEncontradoExcecao`

```typescript
// nucleo/Excecoes/Base/NaoEncontradoExcecao.ts

/**
 * Exceção lançada quando um recurso esperado não é encontrado.
 */
export abstract class NaoEncontradoExcecao extends YamlExtensaoExcecao {
  constructor(mensagem: string) {
    super(mensagem);
  }
}
```

### Configuração Inválida — `ConfiguracaoInvalidaExcecao`

```typescript
// nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao.ts

/**
 * Exceção lançada quando dados de configuração violam invariantes de domínio.
 */
export abstract class ConfiguracaoInvalidaExcecao extends YamlExtensaoExcecao {
  constructor(mensagem: string) {
    super(mensagem);
  }
}
```

### Entrada Inválida — `EntradaInvalidaExcecao`

```typescript
// nucleo/Excecoes/Base/EntradaInvalidaExcecao.ts

/**
 * Exceção lançada quando uma pré-condição de entrada de serviço é violada.
 *
 * @remarks
 * Diferente de `ConfiguracaoInvalidaExcecao`, esta exceção representa
 * chamadas mal-formadas do consumidor — não dados de configuração.
 */
export class EntradaInvalidaExcecao extends YamlExtensaoExcecao {
  constructor(mensagem: string) {
    super(mensagem);
  }
}
```

### Perfil Inválido — Exemplo de Especialização

```typescript
// nucleo/Excecoes/Perfil/PerfilInvalidoExcecao.ts

/**
 * Exceção lançada quando o `.yaml-profile.json` contém dados estruturalmente inválidos.
 */
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
  /**
   * @param detalhe - Campo ou estrutura específica que causou a invalidação.
   */
  constructor(detalhe: string) {
    super(`Perfil de formatação inválido: ${detalhe}`);
  }
}
```

```typescript
// nucleo/Excecoes/Perfil/PerfilNaoEncontradoExcecao.ts

/**
 * Exceção lançada quando um perfil nomeado não existe no `.yaml-profile.json`.
 */
export class PerfilNaoEncontradoExcecao extends NaoEncontradoExcecao {
  /**
   * @param nomePerfil - Nome do perfil que não foi encontrado.
   */
  constructor(nomePerfil: string) {
    super(`Perfil '${nomePerfil}' não encontrado no arquivo .yaml-profile.json.`);
  }
}
```

---

## Quando Lançar

| Situação | Exceção |
| --- | --- |
| Propriedade obrigatória ausente no `.yaml-profile.json` | `PerfilInvalidoExcecao` |
| Perfil nomeado não encontrado na lista | `PerfilNaoEncontradoExcecao` |
| Schema URI inválida ou inacessível | `SchemaNaoEncontradoExcecao` |
| Value Object com valor fora do intervalo | `ConfiguracaoInvalidaExcecao` |
| Parâmetro de serviço ausente ou vazio | `EntradaInvalidaExcecao` |

---

## Onde Tratar

Exceções de domínio devem ser **lançadas** na camada correta e **tratadas**
no ponto de entrada da apresentação — nunca suprimidas silenciosamente.

```typescript
// apresentacao/compartilhado/InicializadorExtensao.ts
async ativarAsync(contexto: ExtensionContext): Promise<void> {
  try {
    await this._servicoFormatacao.inicializarAsync(ct);
  } catch (erro) {
    if (erro instanceof PerfilInvalidoExcecao) {
      window.showErrorMessage(`Wl.Yaml: ${erro.message}`);
      return;
    }
    if (erro instanceof YamlExtensaoExcecao) {
      this._logger.appendLine(`[ERRO] ${erro.message}`);
      return;
    }
    throw erro;  // re-lança erros desconhecidos
  }
}
```

**Regra:** erros de terceiros (`throw erro`) nunca devem ser engolidos.

---

## Proibições

- `throw new Error('mensagem')` — nunca em código de produção.
- Captura genérica com `catch (e) {}` vazia — nunca suprimir silenciosamente.
- `catch` que converte erro desconhecido em tipo do projeto sem verificação.
- Exceção com mensagem vazia.

---

## Checklist de Erros

- [ ] Toda exceção lançada é subclasse de `YamlExtensaoExcecao`?
- [ ] Cada exceção está em seu próprio arquivo — um único motivo para mudar?
- [ ] Nome do arquivo = nome da classe da exceção?
- [ ] Mensagem é descritiva e inclui o valor inválido quando possível?
- [ ] Exceção documentada com JSDoc e `@throws` no ponto de lançamento?
- [ ] Erros de terceiros são re-lançados, não engolidos?
- [ ] Sem `throw new Error()` direto?
- [ ] Ao adicionar campo ou mudar mensagem, apenas um arquivo foi tocado?

---

**Próximo:** [Validação →](VALIDACAO.md)
