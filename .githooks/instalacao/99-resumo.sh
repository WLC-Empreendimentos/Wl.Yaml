# shellcheck shell=bash
# 99 — Mensagem final de ajuda e atalhos para o desenvolvedor.

vy_passo() {
    echo ""
    echo -e "${VY_NEGRITO}====================================================${VY_RESET}"
    echo -e " ${VY_VERDE}${VY_NEGRITO}Hooks instalados${VY_RESET}"
    echo -e "${VY_NEGRITO}====================================================${VY_RESET}"
    echo ""
    echo -e "${VY_NEGRITO}Hooks ativos:${VY_RESET}"
    echo "  pre-commit         14 etapas (branch, conflitos, arquivos proibidos,"
    echo "                     sensíveis, segredos, tamanho, debug TS, EditorConfig,"
    echo "                     markdown, ESLint, actionlint, yamllint, shellcheck)"
    echo "  prepare-commit-msg pré-preenche tipo(escopo) e Refs: a partir da branch"
    echo "  commit-msg         Conventional Commits 1.0.0 (PT, infinitivo, escopo whitelist)"
    echo "  pre-push           6 etapas (branch, sincronia, typecheck, jest, gitleaks, lychee)"
    echo ""
    echo -e "${VY_NEGRITO}Flags úteis (env):${VY_RESET}"
    echo "  VY_HOOK_FAST=1      pula etapas pesadas no pre-commit (ESLint)"
    echo "  VY_HOOK_TEST=0      pula jest no pre-push"
    echo "  VY_HOOK_NO_CACHE=1  desliga cache de validação"
    echo "  VY_HOOK_VERBOSE=1   saída detalhada"
    echo ""
    echo -e "${VY_NEGRITO}Comandos:${VY_RESET}"
    echo "  bash .githooks/diagnostico.sh   # ver estado da instalação"
    echo "  git commit --no-verify          # bypass pre-commit + commit-msg (NÃO recomendado)"
    echo "  git push   --no-verify          # bypass pre-push (NÃO recomendado)"
    echo ""
}
