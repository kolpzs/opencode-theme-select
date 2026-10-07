---
description: Lista e aplica um tema (built-in ou custom) gravando o tui.json do projeto
---

Você vai aplicar um tema do opencode ao projeto atual.

Regras:
1. Se o usuário informou um tema em $ARGUMENTS, use esse nome diretamente.
2. Se $ARGUMENTS estiver vazio, chame a ferramenta `theme_select` SEM o argumento `theme` para listar os temas disponíveis (built-in + custom) e o tema atual. Apresente essa lista ao usuário e pergunte qual tema ele quer aplicar.
3. Depois de saber o tema desejado, chame a ferramenta `theme_select` passando o nome no argumento `theme`.
4. Confirme ao usuário o tema aplicado e o caminho do arquivo gravado. Avise que é preciso reiniciar o opencode para a mudança aparecer.
