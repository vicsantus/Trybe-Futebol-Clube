# Projeto pessoal Trybe Futebol Clube

## Contextualizando

Trybe Futebol Clube é um projeto feito para acessar o placar de times de futebol. Existem times que ja jogaram seus jogos, e times que ainda estão jogando. É possivel acessar o placar, fazer login, alterar jogos em andamento e adicionar novos jogos. Abaixo você encontra o modo de acesso a eles.

## Link da aplicação funcionando no Railway

O **usuario e senha** ficam dentro da pasta **/app/backend/src/database/seeders/\*-user.js.** Trata-se dos seeders da tabela users que alimentam um banco de dados em um container do docker. Dentro do seeders você verá o email e senha, porém, as senhas estão criptografadas. Contudo existe um comentário abaixo delas com a senha real descriptografada. **Ao realizar o login, use o email e senha descriptografada.**

https://tfc-frontend-app-production.up.railway.app/login

## Instalação

Instalação do projeto

```bash
  git clone git@github.com:vicsantus/Trybe-Futebol-Clube.git
  cd Trybe-Futebol-Clube
  npm run compose:up
  npm run install:apps
```

Após a instalação você pode entrar no seu navegador em **`localhost:3000`**, e dali usar as funcionalidades da página.
Para eliminar os containers após o uso, rode `npm run compose:down`.

## Funcionalidades

- Feito em POO com Typescript
- Aplicado alguns principios de SOLID
- Projeto extensível

## Rotas

- get '/leaderboard/home'
- get '/leaderboard/away'
- get '/leaderboard'
- get '/matches'
- patch '/matches/:id/finish'
- patch '/matches/:id'
- post '/matches'
- get '/teams'
- get '/teams/:id'
- post '/login'
- get '/login/role'
