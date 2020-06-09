
# Magic Forum | Web-Tech Project

<img src="https://github.com/JonahLyu/Web-Tech/blob/master/public/logo.svg" width = "100" height = "100" alt="logo1" align=center style="display:inline;"/> <img src="https://github.com/JonahLyu/Web-Tech/blob/master/public/logo2.svg" width = "100" height = "100" alt="logo2" align=center style="display:inline;"/>

The repositry for coursework of unit Web techonologies.

Using Express framework. The database is using `sqlite3`.

contributers: Jonah & Aaron

## Run our site

To run our final site we have included a bash script: start_server_final.sh
Command:
bash start_server_final.sh

To visit our site you will then need to visit https://localhost:8443

If this is your first visit you will then be able to either create a new account or log-in with an existing one.

A provided admin account is has the following details

Username: Admin
Password: Password123

If you wish to access our Auth0 dashboard the details are as follows:
E-mail: ar17092@bristol.ac.uk
Pass: MagicForum12

The alternate command:
bash start_server_dev.sh

will start the server in a way that the page will update in real-time.
This version is fairly unstable at this point.


## Install

IMPORTANT: The running requires confidential configurations in `.env`

Please contact any contributor to get access.

Locate your work directory

```shell
cd /Web_Tech
```

Add `.env` in the root directory

```shell
vim .env
```

## Quick Start
```shell
bash start_server_final.sh
```


## Run locally step by step

Install essential modules first

```shell
npm install
```

Open three terminals:

1.you may need to install redis command line tool first.
```shell
redis-server
```

2.run the server
```shell
npm run dev
```

2.run the client
```shell
npm run ui
```
Visit `localhost:3000` to see updates in real time.

