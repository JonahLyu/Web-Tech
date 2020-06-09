
# Magic Forum | Web-Tech Project

<img src="https://github.com/JonahLyu/Web-Tech/blob/master/public/logo.svg" width = "100" height = "100" alt="logo1" align=center style="display:inline;"/> <img src="https://github.com/JonahLyu/Web-Tech/blob/master/public/logo2.svg" width = "100" height = "100" alt="logo2" align=center style="display:inline;"/>

The repositry for coursework of unit Web techonologies.

Using Express framework. The database is using `sqlite3`.

contributers: Jonah & Aaron


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
## Docker Start
```shell
bash docker_run.sh
```

## Quick Start
```shell
bash start_server.sh
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

