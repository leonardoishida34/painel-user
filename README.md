# Painel de Usuários

CRUD de usuários em Next.js + TypeScript com JSON Server, com autenticação por token e rotas protegidas.

## Funcionalidades

- Listagem, cadastro, edição e exclusão de usuários
- Máscaras e validações de CPF, telefone, CEP e data de nascimento
- **Login com token de acesso:** o token é gerado ao entrar e expira em 2 horas
- **Rotas protegidas:** as páginas internas só abrem com token válido; sem ele, o usuário é redirecionado para `/login`
- Botão "Sair", que remove o token

## Como a autenticação funciona

- `src/services/auth/auth.ts`: confere e-mail e senha no JSON Server, gera e guarda o token, valida se ele ainda é válido e faz o logout.
- `src/app/login/page.tsx`: tela de login.
- `src/app/(admin)/layout.tsx`: protege todas as páginas internas, verificando o token antes de exibi-las.

## Como rodar

```bash
npm install
npx json-server jsonserver/db.json --port 3001
npm run dev
```

Em dois terminais: um para o JSON Server (porta 3001) e outro para o Next.js. Depois acesse `http://localhost:3000/login`.