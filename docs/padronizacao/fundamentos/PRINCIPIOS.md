# Princípios Fundamentais — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)**
> **Próximo:** [Decisões Intencionais →](DECISOES.md)

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define os **valores inegociáveis** e **princípios fundamentais** que guiam
todas as decisões técnicas do projeto Wl.Yaml.

**Quando consultar:**

- Ao iniciar desenvolvimento de nova funcionalidade
- Ao revisar código (code review)
- Ao resolver conflitos entre padrões
- Ao tomar decisões arquiteturais

---

## Visão Geral do Projeto

### Objetivo

Extensão VS Code para suporte completo a YAML: validação, autocompletion,
hover, formatação e integração com JSON Schema Store. Diferencial central:
perfis de formatação por projeto via `.yaml-profile.json`, permitindo que
cada workspace defina suas próprias regras de indentação, aspas e largura
de linha sem que a extensão sobrescreva as escolhas do time.

### Stack Tecnológica

- **Linguagem:** TypeScript 6.0.3
- **Plataforma:** VS Code Extension API
- **Arquitetura:** Clean Architecture em 4 camadas
- **Servidor de linguagem:** `yaml-language-server` (dependência externa, versão fixada)
- **Protocolo:** Language Server Protocol (LSP) via `vscode-languageclient`
- **Testes:** Jest + `@vscode/test-cli`
- **Build:** Webpack (bundle Node.js + Web Worker separados)

---

## Princípios Inegociáveis

### 1. Português Obrigatório (100%)

**TUDO em português**, sem exceções:

- Classes, interfaces, métodos, propriedades, variáveis
- Comentários e documentação JSDoc
- Mensagens de erro e validação
- Nomes de arquivo e pasta (exceto os definidos pela estrutura do VS Code)
- Mensagens de commit
- Nomes de branches Git
- Issues e Pull Requests

**Exceções permitidas:**

- Palavras-chave TypeScript (`class`, `interface`, `async`, `const`, `readonly`)
- APIs do VS Code (`workspace`, `window`, `commands`, `ExtensionContext`)
- Bibliotecas externas (`vscode-languageclient`, `request-light`)
- Termos técnicos consolidados sem tradução adequada: `Token`, `Cache`, `Schema`,
  `YAML`, `JSON`, `LSP`, `URI`, `Glob`, `Workspace`, `DTO`, `Hash`, `ETag`,
  `Webworker`, `Bundle`, `Plugin`

```typescript
// CORRETO
class ServicoFormatacao implements IServicoFormatacao {
  private readonly _repositorioPerfil: IRepositorioPerfilProjeto;

  async resolverPerfilEfetivoAsync(
    uriDocumento: string,
    ct: CancellationToken
  ): Promise<PerfilFormatacaoResposta> { ... }
}

// ERRADO — inglês
class FormattingService implements IFormattingService {
  private readonly _profileRepository: IProfileRepository;

  async getEffectiveProfile(docUri: string): Promise<FormattingProfileResponse> { ... }
}
```

**Glossário de Termos Obrigatórios:**

| Português (USAR)           | Inglês (EVITAR)          |
| -------------------------- | ------------------------ |
| Perfil                     | Profile                  |
| Formatacao                 | Formatting               |
| Esquema / Schema           | Schema (aceito em inglês)|
| Documento                  | Document                 |
| Repositorio                | Repository               |
| Servico                    | Service                  |
| Validador                  | Validator                |
| Mapeador                   | Mapper                   |
| Entidade                   | Entity                   |
| Excecao                    | Exception                |
| Configuracao               | Configuration / Settings |
| Associacao                 | Association              |
| Padrao                     | Pattern                  |
| Apresentacao               | Presentation             |
| Infraestrutura             | Infrastructure           |
| Nucleo                     | Core / Domain            |
| Aplicacao                  | Application              |

---

### 2. Um Motivo Para Mudar Por Arquivo

**Princípio:** cada arquivo existe por exatamente um motivo. Se mudar por dois
motivos diferentes, está errado — independentemente de quão pequeno seja o
segundo motivo.

Isso não é "um conjunto de funções que juntas formam uma ferramenta". Isso é
**um único motivo, literal**. Quando um segundo motivo aparece, por mais que
pareça irrisório, ele pertence a um arquivo próprio.

#### A armadilha do método privado

Métodos privados são o mascaramento mais comum desse problema. É tentador
criar um método privado dentro de uma classe para isolar um trecho de lógica.
Mas se esse método tem uma responsabilidade que pode mudar independentemente da
classe que o contém, ele não pertence ali — ele é uma classe ainda não criada.

```text
// ERRADO — método privado mascarando responsabilidade própria
class ServicoFormatacao {
  async resolverPerfilEfetivoAsync(...) { ... }

  private _resolverFallbackPorExtensao(uri: string): PerfilFormatacao {
    // lógica própria de resolução por extensão de arquivo
    // tem seu próprio motivo para mudar — pertence a outro arquivo
  }
}

// CORRETO — responsabilidade extraída para arquivo próprio
// ResolvedorFallbackPorExtensao.ts
class ResolvedorFallbackPorExtensao {
  resolver(uri: string): PerfilFormatacao { ... }
}

// ServicoFormatacao.ts
class ServicoFormatacao {
  constructor(private readonly _resolvedorFallback: ResolvedorFallbackPorExtensao) {}

  async resolverPerfilEfetivoAsync(...) { ... }
}
```

#### A conexão com condicionais

Quando a única saída parece ser um `if`, muito provavelmente existe uma classe
ainda não criada que deveria encapsular aquela variação. O `if` desaparece
porque a decisão passa a estar codificada no sistema de tipos — não no fluxo.

#### Nome do arquivo = nome do tipo público

Consequência direta do princípio: se cada arquivo tem um único motivo para
mudar, ele contém exatamente um tipo público. O nome do arquivo e o nome do
tipo são sempre iguais.

```text
CORRETO
PerfilFormatacao.ts              → export class PerfilFormatacao
ResolvedorFallbackPorExtensao.ts → export class ResolvedorFallbackPorExtensao
IRepositorioPerfilProjeto.ts     → export interface IRepositorioPerfilProjeto
TipoAspas.ts                     → export enum TipoAspas
PerfilInvalidoExcecao.ts         → export class PerfilInvalidoExcecao
ValidadorPerfilFormatacao.ts     → export class ValidadorPerfilFormatacao

ERRADO
Entidades.ts                     → export class PerfilFormatacao
                                   export class AssociacaoSchema
Erros.ts                         → export class PerfilInvalidoExcecao
                                   export class SchemaNaoEncontradoExcecao
ServicoFormatacao.ts             → ServicoFormatacao + lógica privada
                                   que tem motivo próprio para mudar
```

#### O que "motivo para mudar" significa na prática

Pergunte: "se essa responsabilidade mudar, quais arquivos precisam ser
alterados?" Se a resposta incluir mais de um conceito dentro do mesmo arquivo,
há uma separação a fazer. Exemplos neste projeto:

| Responsabilidade | Arquivo próprio |
| --- | --- |
| Resolver qual perfil se aplica por glob | `ResolvedorPerfilPorGlob.ts` |
| Fazer fallback quando nenhum glob corresponde | `ResolvedorFallbackPadrao.ts` |
| Validar estrutura do `.yaml-profile.json` | `ValidadorEstruturaPerfil.ts` |
| Construir URI do arquivo de perfil no workspace | `ConstrutorUriPerfilProjeto.ts` |

Cada um muda por um motivo diferente. Cada um em seu arquivo.

---

### 3. Documentação JSDoc Completa

**"Completa" no sentido literal:** a documentação deve explicar não só *o que*
existe, mas *por que* existe no contexto arquitetural.

**Escopo obrigatório:**

- Tipos públicos (`class`, `interface`, `enum`, exceções)
- Membros públicos (construtores, métodos, propriedades)
- Dependências privadas injetadas via construtor que são centrais para o comportamento
- Métodos privados não triviais (quando carregam regra, decisão ou fluxo relevante)

**Tags obrigatórias por contexto:**

- `@param` para todos os parâmetros
- `@returns` quando houver retorno diferente de `void` / `Promise<void>`
- `@throws` para exceções esperadas de contrato
- `@remarks` quando houver regra arquitetural ou de negócio importante

```typescript
/**
 * Serviço responsável por resolver o perfil de formatação efetivo para um documento.
 *
 * @remarks
 * Aplica precedência: `.yaml-profile.json` → workspace settings → global settings → defaults.
 * Nunca lança exceção se o arquivo `.yaml-profile.json` estiver ausente — retorna o perfil
 * de fallback resolvido pelas demais camadas.
 */
export class ServicoFormatacao implements IServicoFormatacao {
  /**
   * Repositório responsável por ler `.yaml-profile.json` do workspace.
   * @remarks Dependência central para resolução da camada de maior prioridade.
   */
  private readonly _repositorioPerfil: IRepositorioPerfilProjeto;

  /**
   * Resolve o perfil de formatação efetivo para o documento informado.
   *
   * @param requisicao - URI do documento e contexto do workspace.
   * @param ct - Token de cancelamento da operação.
   * @returns Perfil resolvido com todas as propriedades preenchidas.
   * @throws {PerfilInvalidoExcecao} Quando o `.yaml-profile.json` contém dados inválidos.
   */
  async resolverPerfilEfetivoAsync(
    requisicao: ResolverPerfilRequisicao,
    ct: CancellationToken
  ): Promise<PerfilFormatacaoResposta> { ... }
}
```

---

### 4. Async/Await para Todo I/O

**SEMPRE** use `async/await` para:

- Leitura/escrita de arquivos via `workspace.fs`
- Chamadas HTTP (schemas remotos, SchemaStore)
- Comunicação LSP (requests e notifications)
- Leitura de configurações quando assíncrona

```typescript
// CORRETO
async obterSchemaAsync(uri: string, ct: CancellationToken): Promise<string | undefined> {
  return await this._cache.obterAsync(uri, ct);
}

// ERRADO — bloqueante
obterSchema(uri: string): string | undefined {
  return this._cache.obterSync(uri);
}
```

---

### 5. CancellationToken Obrigatório em Operações Canceláveis

Operações que envolvem I/O cancelável (requests LSP, leitura de arquivo via
VS Code API) devem aceitar `CancellationToken` como último parâmetro.

```typescript
// CORRETO
async lerArquivoAsync(uri: Uri, ct: CancellationToken): Promise<string> {
  const bytes = await workspace.fs.readFile(uri);
  // ...
}

// CORRETO — interface com token
interface IRepositorioCacheSchema {
  obterAsync(uri: string, ct: CancellationToken): Promise<string | undefined>;
  salvarAsync(uri: string, etag: string, conteudo: string, ct: CancellationToken): Promise<void>;
}
```

---

### 6. Validadores em Classes Separadas

**NUNCA** valide entrada diretamente dentro de um serviço ou comando.

Cada DTO de entrada tem um `Validador` correspondente em `Validadores/`.

```typescript
// CORRETO — validação em classe separada
export class ValidadorPerfilFormatacao {
  validar(perfil: PerfilFormatacaoEntrada): ResultadoValidacao {
    const erros: string[] = [];

    if (perfil.indentacao < 1 || perfil.indentacao > 8) {
      erros.push('Indentação deve estar entre 1 e 8.');
    }

    if (!perfil.padraoArquivo || perfil.padraoArquivo.length === 0) {
      erros.push('Padrão de arquivo é obrigatório.');
    }

    return erros.length === 0
      ? ResultadoValidacao.valido()
      : ResultadoValidacao.invalido(erros);
  }
}

// ERRADO — validação inline no serviço
async salvarPerfilAsync(perfil: PerfilFormatacaoEntrada): Promise<void> {
  if (perfil.indentacao < 1 || perfil.indentacao > 8) {    // ERRADO
    throw new Error('Indentação inválida');
  }
  // ...
}
```

---

### 7. Exceções em Arquivos Separados

**NUNCA** lance `new Error('mensagem solta')`. Cada erro de domínio tem
sua própria classe em `Excecoes/{Dominio}/`.

```typescript
// ERRADO — exceção genérica
throw new Error('Perfil não encontrado');

// CORRETO — exceção em arquivo separado
// nucleo/Excecoes/Perfil/PerfilNaoEncontradoExcecao.ts
export class PerfilNaoEncontradoExcecao extends NaoEncontradoExcecao {
  constructor(nomePerfil: string) {
    super(`Perfil '${nomePerfil}' não encontrado no arquivo .yaml-profile.json.`);
  }
}

// Uso no serviço:
throw new PerfilNaoEncontradoExcecao(requisicao.nomePerfil);
```

---

### 8. Sem `any`, Sem `!` (Non-Null Assertion)

- `any` desabilita a checagem de tipos — **proibido**.
- `!` força tipo não-nulo sem garantia em runtime — **proibido**.
- Use `unknown` quando o tipo for genuinamente desconhecido na borda.
- Use guard clauses ou optional chaining para lidar com nullability.

```typescript
// ERRADO
function processar(dado: any): void { ... }
const nome = usuario!.nome;

// CORRETO
function processar(dado: unknown): void {
  if (typeof dado !== 'string') throw new EntradaInvalidaExcecao('dado deve ser string');
  // ...
}

const nome = usuario?.nome ?? '';
```

---

### 9. Tipos Explícitos como Padrão

Declare o tipo explicitamente em `const`/`let`. Use inferência (`const x = ...`)
apenas quando o tipo for óbvio pela atribuição literal.

```typescript
// CORRETO — tipo explícito
const perfil: PerfilFormatacao = await this._repositorioPerfil.obterAsync(uri, ct);
const indentacao: number = perfil.indentacao;
const habilitado: boolean = configuracao.get<boolean>('yaml.format.enable', true);

// ACEITÁVEL — tipo óbvio por literal
const limite = 5000;
const prefixo = 'yaml.format';

// ERRADO — tipo implícito onde não é óbvio
const perfil = await this._repositorioPerfil.obterAsync(uri, ct);
```

---

### 10. Cobertura de Testes 100%

Todo código de produção deve ter cobertura 100% de linhas, branches e funções.

Com 100% de cobertura, quando algo falhar (em outro ambiente, em outro SO, em
uma nova versão do VS Code) a causa mais provável é diferença de ambiente —
não ausência de teste.

---

## Checklist de Conformidade

Antes de cada commit, verificar:

- [ ] Todo código está em português (exceto termos técnicos permitidos)?
- [ ] Uma classe/interface/enum pública por arquivo?
- [ ] JSDoc em todos os membros públicos?
- [ ] `async/await` para todo I/O?
- [ ] `CancellationToken` em operações canceláveis?
- [ ] Validação feita em classe `Validador` separada?
- [ ] Exceções em arquivos separados, sem `throw new Error()`?
- [ ] Sem `any`, sem `!` (non-null assertion)?
- [ ] Tipos explícitos em `const`/`let` onde necessário?

---

**Próximo:** [Decisões Intencionais →](DECISOES.md)
