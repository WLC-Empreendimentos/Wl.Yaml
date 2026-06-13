# Testes Automatizados — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Commits](../runtime/COMMITS.md)** | **[CI/CD →](CICD.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define as **regras para testes automáticos** do projeto Wl.Yaml, incluindo
testes unitários, de integração e de extensão.

**Objetivo:** cobertura 100%, testes legíveis e confiáveis que não
dependem de estado compartilhado.

---

## Princípios

### Regras de Ouro

1. **Jest** — framework padrão para testes unitários e de aplicação
2. **`@vscode/test-cli`** — testes de integração que requerem o VS Code
3. **`jest.fn()` / spies** — substituição de dependências em testes unitários
4. **Testes em português** — nomes de métodos, variáveis, comentários
5. **Arrange-Act-Assert** — estrutura padrão de cada teste
6. **Um cenário por teste** — não misturar verificações não relacionadas
7. **Sem estado residual** — cada teste independente

---

## Stack de Testes

- **Framework unitário:** Jest 29.x
- **Testes de extensão:** `@vscode/test-cli` + `@vscode/test-electron`
- **Dados fictícios:** construtores helper privados em cada arquivo de teste

### Pacotes

```json
{
  "devDependencies": {
    "@types/jest": "^29",
    "jest": "^29",
    "ts-jest": "^29",
    "@vscode/test-cli": "^0.0.12",
    "@vscode/test-electron": "^2.4.0"
  }
}
```

---

## Estrutura de Projetos de Teste

Os arquivos de teste **espelham** a estrutura dos arquivos-fonte:

```text
Wl.Yaml/
├── src/
│   ├── nucleo/
│   │   ├── Entidades/
│   │   ├── ValueObjects/
│   │   └── Excecoes/
│   ├── aplicacao/
│   │   ├── Servicos/
│   │   └── Validadores/
│   └── infraestrutura/
│
└── tests/
    ├── nucleo/
    │   ├── Entidades/
    │   ├── ValueObjects/
    │   └── Excecoes/
    ├── aplicacao/
    │   ├── Servicos/
    │   └── Validadores/
    ├── infraestrutura/
    │   └── Persistencia/
    └── integracao/
        └── Extensao/
```

**Regras:**

- Cada arquivo-fonte tem um `.test.ts` correspondente.
- A estrutura de pastas replica a do arquivo-fonte.
- Testes de integração que requerem VS Code ficam em `tests/integracao/`.

---

## Convenção de Nomes

### Arquivos de Teste

```text
ServicoFormatacao.ts       → ServicoFormatacao.test.ts
ValidadorPerfilFormatacao.ts → ValidadorPerfilFormatacao.test.ts
TamanhoIndentacao.ts       → TamanhoIndentacao.test.ts
```

### Métodos de Teste

```text
Cenario_Condicao_ResultadoEsperado
```

### Exemplos

```typescript
// CORRETO — nome descritivo em português
test('ResolverPerfilEfetivo_ArquivoPerfilPresente_RetornaPerfilDoProjeto', async () => { });
test('ResolverPerfilEfetivo_SemArquivoPerfil_RetornaConfiguracoesWorkspace', async () => { });
test('ValidarPerfil_IndentacaoAbaixoDoMinimo_RetornaErro', () => { });
test('TamanhoIndentacao_ValorForaDoIntervalo_LancaExcecao', () => { });

// ERRADO — nome não descritivo
test('test1', () => { });

// ERRADO — inglês
test('ShouldReturnProfileWhenFileExists', async () => { });

// ERRADO — sem underscore
test('QuandoArquivoExisteDeveRetornarPerfil', async () => { });
```

### Classes de Teste

```typescript
// Sufixo Test
describe('ServicoFormatacaoTest', () => { });
describe('ValidadorPerfilFormatacaoTest', () => { });
describe('RepositorioPerfilArquivoTest', () => { });
```

---

## Testes Unitários

### Exemplo: Serviço de Formatação

```typescript
import { ServicoFormatacao } from '../../../src/aplicacao/Servicos/Implementacoes/ServicoFormatacao';
import { IRepositorioPerfilProjeto } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioPerfilProjeto';
import { IRepositorioConfiguracoes } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioConfiguracoes';
import { MapeadorPerfilFormatacao } from '../../../src/aplicacao/Mapeadores/MapeadorPerfilFormatacao';
import { PerfilInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';
import { CancellationToken } from 'vscode';

describe('ServicoFormatacaoTest', () => {
  let _repositorioPerfil: jest.Mocked<IRepositorioPerfilProjeto>;
  let _repositorioConfiguracoes: jest.Mocked<IRepositorioConfiguracoes>;
  let _mapeador: MapeadorPerfilFormatacao;
  let _sut: ServicoFormatacao;

  beforeEach(() => {
    _repositorioPerfil = {
      obterAsync: jest.fn(),
      existeArquivoAsync: jest.fn(),
    };
    _repositorioConfiguracoes = {
      obterIndentacaoAsync: jest.fn(),
      obterLarguraLinhaAsync: jest.fn(),
      obterHabilitadoAsync: jest.fn(),
    };
    _mapeador = new MapeadorPerfilFormatacao();
    _sut = new ServicoFormatacao(_repositorioPerfil, _repositorioConfiguracoes, _mapeador);
  });

  test('ResolverPerfilEfetivo_ArquivoPerfilPresente_RetornaPerfilDoProjeto', async () => {
    // Arrange
    const requisicao = criarRequisicao('file:///workspace/k8s/deploy.yaml');
    const perfilEsperado = criarPerfilFormatacao({ indentacao: 2 });
    _repositorioPerfil.obterAsync.mockResolvedValue(perfilEsperado);

    // Act
    const resultado = await _sut.resolverPerfilEfetivoAsync(requisicao, CancellationToken.None);

    // Assert
    expect(resultado.indentacao).toBe(2);
    expect(_repositorioConfiguracoes.obterIndentacaoAsync).not.toHaveBeenCalled();
  });

  test('ResolverPerfilEfetivo_SemArquivoPerfil_UsaConfiguracoesWorkspace', async () => {
    // Arrange
    const requisicao = criarRequisicao('file:///workspace/config.yaml');
    _repositorioPerfil.obterAsync.mockResolvedValue(undefined);
    _repositorioConfiguracoes.obterIndentacaoAsync.mockResolvedValue(4);

    // Act
    const resultado = await _sut.resolverPerfilEfetivoAsync(requisicao, CancellationToken.None);

    // Assert
    expect(resultado.indentacao).toBe(4);
    expect(_repositorioPerfil.obterAsync).toHaveBeenCalledTimes(1);
  });

  test('ResolverPerfilEfetivo_UriDocumentoVazia_LancaExcecao', async () => {
    // Arrange
    const requisicao = criarRequisicao('');

    // Act
    const acao = () => _sut.resolverPerfilEfetivoAsync(requisicao, CancellationToken.None);

    // Assert
    await expect(acao).rejects.toBeInstanceOf(EntradaInvalidaExcecao);
    expect(_repositorioPerfil.obterAsync).not.toHaveBeenCalled();
  });
});

// Helpers de construção — private ao arquivo de teste
function criarRequisicao(uriDocumento: string): ResolverPerfilRequisicao {
  return { uriDocumento, uriWorkspace: 'file:///workspace' };
}

function criarPerfilFormatacao(overrides: Partial<PerfilFormatacao> = {}): PerfilFormatacao {
  return new PerfilFormatacao({
    indentacao: 2,
    aspasSimplesHabilitadas: false,
    larguraLinha: 80,
    virgulasFinaisHabilitadas: true,
    modoQuebra: ModoQuebra.Preservar,
    padraoArquivo: new PadraoArquivo('**/*.yaml'),
    ...overrides,
  });
}
```

---

## Testes de Validadores

```typescript
import { ValidadorPerfilFormatacao } from '../../../src/aplicacao/Validadores/Formatacao/ValidadorPerfilFormatacao';

describe('ValidadorPerfilFormatacaoTest', () => {
  const _sut = new ValidadorPerfilFormatacao();

  test('Validar_DadosValidos_SemErros', () => {
    // Arrange
    const entrada: PerfilFormatacaoEntrada = {
      indentacao: 4,
      padraoArquivo: ['**/*.yaml'],
      larguraLinha: 120,
    };

    // Act
    const resultado = _sut.validar(entrada);

    // Assert
    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toHaveLength(0);
  });

  test('Validar_IndentacaoAbaixoDoMinimo_RetornaErro', () => {
    // Arrange
    const entrada: PerfilFormatacaoEntrada = { indentacao: 0, padraoArquivo: ['**/*.yaml'] };

    // Act
    const resultado = _sut.validar(entrada);

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.erros).toContain('Indentação deve estar entre 1 e 8.');
  });

  test('Validar_PadraoArquivoVazio_RetornaErro', () => {
    // Arrange
    const entrada: PerfilFormatacaoEntrada = { indentacao: 2, padraoArquivo: [] };

    // Act
    const resultado = _sut.validar(entrada);

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.length).toBeGreaterThan(0);
  });
});
```

---

## Testes de Value Objects

```typescript
import { TamanhoIndentacao } from '../../../src/nucleo/ValueObjects/TamanhoIndentacao';
import { ConfiguracaoInvalidaExcecao } from '../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';

describe('TamanhoIndentacaoTest', () => {
  test('Construtor_ValorValido_CriaInstancia', () => {
    // Arrange & Act
    const indentacao = new TamanhoIndentacao(4);

    // Assert
    expect(indentacao.valor).toBe(4);
  });

  test.each([0, 9, -1, 100])(
    'Construtor_Valor%iForaDoIntervalo_LancaExcecao',
    (valorInvalido) => {
      // Act
      const acao = () => new TamanhoIndentacao(valorInvalido);

      // Assert
      expect(acao).toThrow(ConfiguracaoInvalidaExcecao);
    }
  );

  test.each([1, 2, 4, 8])(
    'Construtor_Valor%iDentroDoIntervalo_CriaInstancia',
    (valorValido) => {
      // Act & Assert
      expect(() => new TamanhoIndentacao(valorValido)).not.toThrow();
    }
  );
});
```

---

## Checklist de Testes

- [ ] Nome de teste segue formato `Cenario_Condicao_ResultadoEsperado`?
- [ ] Arrange-Act-Assert respeitado?
- [ ] Um cenário por teste?
- [ ] Mocks criados com `jest.fn()` e `jest.Mocked<T>`?
- [ ] `beforeEach` limpa o estado antes de cada teste?
- [ ] Sem estado residual entre execuções?
- [ ] Helpers de construção são funções locais ao arquivo?
- [ ] Testes em português?

---

**Próximo:** [Erros →](ERROS.md)
