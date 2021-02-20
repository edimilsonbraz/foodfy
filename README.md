<h1 align="center">
<br>
<!--   <img src="https://ik.imagekit.io/1n1swj1w28/Foodfy_eMEWz_K42P.png" width="800"> -->
  
<br>
<img src="https://ik.imagekit.io/1n1swj1w28/Foodfy02_qbkZct__dy.png" width="600">
<br>
  FOODFY
</h1>

<p align="center">Nesse Bootcamp foi desenvolvido uma aplicação completa(front-end e back-end) que trata-se de um sistema com receitas de diferentes chefs, todas com imagens, ingredientes e passo a passo pra fazer uma receita.</p>
  
<p align="center"> Projeto desenvolvido durante o Launchbase Bootcamp da Rocketseat. </p>


## TECNOLOGIAS

Este aplicação apresenta algumas das mais recentes ferramentas e práticas em desenvolvimento web!!
Alguns deles estão listados abaixo.


### Frontend:
- ⚛️ [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- ⚛️ [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- 💹 [JAVASCRIPT](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- ⚛️ [NUNJUCKS](https://github.com/mozilla/nunjucks)
- ⚛️ [LOTTIE](https://github.com/airbnb/lottie-web)

### Backend:
- ⚛️ [NODE](https://nodejs.org/en/)
- ⚛️ [EXPRESS](https://github.com/expressjs/express)
- 💹 [POSTGRESQL](https://www.postgresql.org/)
- ⚛️ [NODEMON](https://github.com/remy/nodemon)
- 💹 [MULTER](https://github.com/expressjs/multer)
- ⚛️ [NODE-CONNECT-SIMPLE](https://github.com/voxpelli/node-connect-pg-simple)
- ⚛️ [BCRYPT](https://github.com/dcodeIO/bcrypt.js) 
- 💹 [NODEMAILER](https://github.com/nodemailer/nodemailer)
- ⚛️ [SESSION](https://github.com/expressjs/session)
- ⚛️ [FAKER](https://github.com/marak/Faker.js/) 

## INSTALAÇÃO <BR>
  
Para clonar e executar essa aplicação você vai precisar dos seguintes softwares instalados em seu computador:
- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)

1 - Abra o terminal do seu computador e mude para o diretório que deseja manter este aplicativo. Execute o código
```
$ git clone https://github.com/edimilsonbraz/foodfy
```
2 - Acesse o diretório
```
$ cd foodfy
```
3 - Na pasta principal execute o comando para instalar todos os pacotes necessários listados no arquivo package.json.
```
$ npm install
```

### Iniciando o PostgresSQL

- ### Windows:
1. Abra o Powershell como administrador, e navegue até a pasta de instalação:
```
$ cd "C:\Program Files\PostgreSQL\13\bin\"
```
2. Inicie o postgres com o comando abaixo:
```
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" start
```
3. Após o uso, o comando para desligá-lo é:
```
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" stop
```
- ### Mac:
1. Iniciar o postgres
```
pg_ctl -D /usr/local/var/postgres start
```
2. Desligar o postgresql
```
pg_ctl -D /usr/local/var/postgres stop
```
- ### Linux:
[Documentação Oficial de Instalação do Postgres](https://www.postgresql.org/download/linux/)

### Usando o Postbird
- Esta aplicação requer um banco de dados onde todas as informações de receitas, chefs e usuários são armazenadas. DB usado no projeto [PostgresSQL](https://www.postgresql.org/) | (versão que estou usando neste projeto, é a versão 12)<br>
- Depois de instalar o postgres, você precisará do [Postbird](https://www.electronjs.org/apps/postbird), que é a visualização do BD numa interface gráfica. Use o mesmo login e senha no arquivo src/config/db.js<br>
- Após ligar o Postgres, abra o Postbird e crie um banco de dados, de nome foodfydb.<br>
- Abra o arquivo foodfydb.sql e copie toda a query para a sessão de Query do Postbird e clique em Run Query

## Executar a aplicação

- Com a configuração do banco de dados feita, No terminal do VSC execute o comando:
```
node seed.js. 
```
- Isso irá preencher o banco de dados com alguns dados aleatórios em receitas, chefs e usuários. 
- Senha desses usuários Fakes: senha:1234
- Inicie a aplicação:
```
$ cd Foodfy
```
- Inicie a aplicação:
```
$ npm start
```

## License
[**Edimilson Braz**](https://www.linkedin.com/in/edimilsonbraz/)
<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>
