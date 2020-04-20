# Web-Tech

The repositry for coursework of unit Web techonologies.

Using Express framework. The database is using `sqlite3`.

contributers: Jonah & Aaron

**install**:

```shell
cd /Web_Tech
npm install
```

**run locally**
```shell
npm start
```
Open web browser and goto `http://localhost:8080`


**run remotely**

step1: submit all files using ftp

step2: reboot the pm2 service on server panel (in order to reload the nodes)

step3: access web given address


**current web address**:

`www.jonahlyu.club:8080`

port: 8080

port number can be changed in file `/bin/www`


**ftp info (for accessing raw files)**

ftp link: `ftp://18.191.141.206:21`

username: `node`

password: `12345678`

**IMPORTANT**

Had to make major changes to current structure to get user authentication working. Pushed to new branch. More details at bottom of readme.

Make sure to run:

npm i pug

npm i -D browser-sync

To install used packages