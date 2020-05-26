# Web-Tech

The repositry for coursework of unit Web techonologies.

Using Express framework. The database is using `sqlite3`.

contributers: Jonah & Aaron

**install**:

Locate your work directory 

```shell
cd /Web_Tech
```

Add `.env` in the root directory

```shell
vim .env
```

IMPORTANT: Adding below settings in `.env` (confidential)
```shell
AUTH0_CLIENT_ID=Se8kcHf2KF6j50wqDYlK8ks7PYP9gWVU
AUTH0_DOMAIN=dev-qz3j4rvi.eu.auth0.com
AUTH0_CLIENT_SECRET=TwkoZh_mO4zYHFAbBCzzTRcNl3yVSAOdsauM7-rxyGwXCiA5O8H9kWo8KQ7qoyEW
```

Install essential modules first


```shell
npm install
```

**run locally**

Open two terminals.

```shell
npm run dev
```

```shell
npm run ui 
```
Visit `localhost:3000` to see updates in real time.


**run remotely (not available now)**

step1: submit all files using ftp

step2: reboot the pm2 service on server panel (in order to reload the nodes)

step3: access web given address


**current web address (not available now)**

`www.jonahlyu.club:8080`

port: 8080

port number can be changed in file `/bin/www`


**ftp info (for accessing raw files)**

ftp link: `ftp://18.191.141.206:21`

username: `node`

password: `12345678`


**New Info**:

Changes to code following these tutorials:

// This tutorial for design: https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/

// This one for authorisation: https://auth0.com/blog/create-a-simple-and-secure-node-express-app/#Setting-Up-the-Project


**Auth0 site login**:

My uni e-mail num is 17092

pass: MagicForum12

**Start server command**:
bash start_server.sh

