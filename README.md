Rewrited project [link](https://github.com/dao0dao/CourtReservationSystem-Backend) from ExpressJS to NestJS.

## Requirements:
1. NestJS V 9.1.1
2. mySQL

To start project local you have to create in root folder `.env` with next data
```
MODE=dev
DATABASE_username={your user name in mySQL}
DATABASE_password={your password in mySQL}
DATABASE_database={schema name that you want to create}
DATABASE_host={your mySQL host}
DATABASE_port={your mySQL port}
SALT_ROUNDS={number to bcrypt salt}
PORT={number of port in which server should run}
```
## Set up project
1. `npm install`
2. `npm run set_project` (set project) or `npm run set_project:start-dev` (set project and start local server)
3. `npm run start:dev` if you have set project
