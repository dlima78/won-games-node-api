# Login

> ## Caso de sucesso

1. ✅ Recebe a requisição do tipo **POST** na rota **/api/login**
2. ✅ Valida dados obrigatórios **email** e **password**
3. ✅ Valida que o campo **email** é um campo válido
4. ✅ Busca usuário com o email e senha fornecidos
5. ✅ Gera o token de acesso a partir do ID do usuário
6. ✅ Atualiza os dados do usuário com o token de accesso gerado
7. ✅ Retorna 200 com o token de acesso

> ## Exceções

1. ✅ Retorna erro 404 se a API não existir
2. ✅ Retorna erro 400 se **email** e **password** não forem fornecidos pelo cliente
3. ✅ Retorna erro 400 se o campo **email** for um e-mail inválido
4. ✅ Retorna erro 401 se não encontrar um usuário com os dados fornecidos
5. ✅ Retorna erro 500 se der erro ao gerar o token de acesso
5. ✅ Retorna erro 500 se der erro ao tentar atualizar o usuário com o token de acessso gerado