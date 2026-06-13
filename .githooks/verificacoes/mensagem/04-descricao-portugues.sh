# shellcheck shell=bash
# 04 — Descrição em português (heurística de inglês + tempo verbal errado).
export VY_TITULO="Descrição em português, infinitivo, minúscula"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return

    local primeira_letra="${DESCRICAO:0:1}"
    if [[ "$primeira_letra" =~ [A-Z] ]]; then
        vy_msg_erro "Descrição deve começar com letra minúscula (atual: '$primeira_letra')"
    fi

    local primeira_palavra
    primeira_palavra=$(echo "$DESCRICAO" | awk '{print tolower($1)}')

    case "$primeira_palavra" in
        add|added|adds|adding|fix|fixed|fixes|fixing|\
        update|updated|updates|updating|remove|removed|removes|removing|\
        delete|deleted|deletes|deleting|create|created|creates|creating|\
        change|changed|changes|changing|implement|implemented|implementing|\
        refactor|refactored|refactoring|improve|improved|improving|\
        bump|bumps|bumped)
            vy_msg_erro "Mensagem em inglês ('$primeira_palavra')."
            vy_msg_erro "Use infinitivo PT: adicionar, corrigir, atualizar..."
            return
            ;;
    esac

    declare -A sugestoes=(
        [adicionado]=adicionar [adicionei]=adicionar [adicionando]=adicionar
        [corrigido]=corrigir   [corrigi]=corrigir    [corrigindo]=corrigir
        [atualizado]=atualizar [atualizei]=atualizar [atualizando]=atualizar
        [removido]=remover     [removi]=remover      [removendo]=remover
        [criado]=criar         [criei]=criar         [criando]=criar
        [implementado]=implementar [implementei]=implementar [implementando]=implementar
        [refatorado]=refatorar [refatorei]=refatorar [refatorando]=refatorar
        [movido]=mover         [movi]=mover          [movendo]=mover
        [extraido]=extrair     [extraindo]=extrair
        [renomeado]=renomear   [renomeando]=renomear
    )
    if [[ -n "${sugestoes[$primeira_palavra]:-}" ]]; then
        vy_msg_erro "Use infinitivo: '${sugestoes[$primeira_palavra]}' em vez de '$primeira_palavra'"
        return
    fi

    if [[ "$primeira_palavra" =~ (ado|ada|ados|adas|ido|ida|idos|idas|ando|endo|indo|ou|ei|amos|emos|imos)$ ]]; then
        case "$primeira_palavra" in
            todo|tudo|quando|sendo|tendo|fazendo|cinco|seis) ;;
            *) vy_msg_erro "Use infinitivo, não conjugado ('$primeira_palavra')" ;;
        esac
    fi
}
