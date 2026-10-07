# opencode-theme-select

Plugin para [opencode](https://opencode.ai) que adiciona o comando `/theme-select` para listar e aplicar um tema (built-in ou custom) **gravando direto no `tui.json` do projeto**.

## O que faz

- `/theme-select` — lista os temas disponíveis (built-in + custom) e o tema atual, e deixa você escolher.
- `/theme-select <nome>` — aplica o tema diretamente (ex.: `/theme-select matrix`).

O tema é gravado no `tui.json` da raiz do projeto (git root; se não houver git, usa o diretório atual), preservando as demais chaves e comentários do arquivo.

## Instalação

Adicione ao seu `opencode.json` (global `~/.config/opencode/opencode.json` ou do projeto):

```json
{
  "plugin": ["opencode-theme-select"]
}
```

O opencode instala o pacote via Bun na inicialização.

## Uso

1. Reinicie o opencode.
2. Digite `/theme-select` (para escolher) ou `/theme-select tokyonight` (direto).
3. Reinicie o opencode novamente para a cor do TUI atualizar (o tema é lido no startup).

## Como funciona

O plugin registra a ferramenta `theme_select`, que:

- Descobre temas custom em `~/.config/opencode/themes/*.json` e `<projeto>/.opencode/themes/*.json`.
- Junta com a lista de temas built-in.
- Sem `theme`: lista tudo + tema atual.
- Com `theme`: valida e grava/atualiza o `tui.json` do projeto.

> O tema é por instância, não por aba/sessão.

## Fallback do comando

Se o comando injetado não aparecer no seu setup, copie `command/theme-select.md` para `~/.config/opencode/commands/` (ou `.opencode/commands/`).

## Publicar no npm

```bash
npm login
npm publish
```

## Licença

MIT
