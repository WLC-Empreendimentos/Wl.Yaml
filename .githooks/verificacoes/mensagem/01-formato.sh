# shellcheck shell=bash
# 01 — Mensagem não vazia, não é WIP/fixup/squash, e segue o formato
#      tipo(escopo)?!?: descrição.
export VY_TITULO="Formato Conventional Commits"

vy_verificar() {
    if [[ -z "$TITULO" ]]; then
        vy_msg_erro "Mensagem de commit vazia"
        return
    fi
    if [[ "$TITULO" =~ ^(wip|WIP|FIXUP|fixup!|squash!) ]]; then
        vy_msg_erro "Commits 'WIP' / 'fixup!' / 'squash!' não são permitidos"
    fi
    if [[ $TITULO_VALIDO -eq 0 ]]; then
        vy_msg_erro "Formato inválido. Esperado: tipo(escopo)!?: descrição"
    fi
}
