# Criar enquete

> ## Caso de sucesso

1. ⛔ Recebe uma requisição do tipo **GET** na rota **/api/surveys**
2. ⛔ Valida se a requisição é feita por um usuário
3. ⛔ Retorna 200 com os dados das enquetes

> ## Exceções

1. ⛔ Retorna erro **404** se a API não existir
2. ⛔ Retorna erro **403** se o usuário não for um usuário
1. ⛔ Retorna erro **500** se der erro ao tentar listar as enquetes