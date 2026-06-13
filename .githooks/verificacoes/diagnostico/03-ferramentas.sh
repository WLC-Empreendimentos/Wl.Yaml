# shellcheck shell=bash
# 03 — Ferramentas listadas em lib/ferramentas.sh.
export VY_TITULO="Ferramentas"

vy_verificar() {
    _checar() {
        local cmd=$1 obrig=$2 _fonte=$3 hint=$4
        vy_verificar_cmd "$cmd" "$obrig" "$hint" || true
    }
    vy_para_cada_ferramenta _checar
}
