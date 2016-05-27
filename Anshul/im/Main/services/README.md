# TFIN
----------
The Teach For India - API Platform

##Contents

 1. [Requirements](#requirements)
 2. [Quick Start](#quick-start)

###Requirements
[Node.js](https://nodejs.org) [Version 4.2.6 & above]

> [Recommended ways to install on *nix systems - Command Cheatsheet](https://gist.github.com/isaacs/579814)
> [Detailed Steps to Install](https://www.digitalocean.com/community/tutorials/how-to-install-an-upstream-version-of-node-js-on-ubuntu-12-04)


[Redis](http://redis.io/)

> [Quickstart](http://redis.io/topics/quickstart)

[MongoDB](https://www.mongodb.org/)

> [Instructions to setup if hosting on your own](https://docs.mongodb.org/getting-started/shell/installation/)
> [Getting started with mongolabs](http://docs.mongolab.com/)
> [Creating users](https://docs.mongodb.org/manual/reference/method/db.createUser/) and [Basics on roles](https://docs.mongodb.org/manual/reference/built-in-roles/#built-in-roles)

[Elasticsearch](https://www.elastic.co/products/elasticsearch)

Required only to run the indexing platform on the server

> [Steps to Install](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)
> [Running as a Service](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-service.html)

###Quick Start
####Clone the repo

    git clone <repo uri>
####Install server-end packages
Make sure you are at the root of the project and run

    npm install

Once all packages are installed, you will be asked to configure your environmentVariables file. Follow the instructions to complete setting this up. To change the configuration later, you can run:

    npm run setup

Or simply go to the file configs/variables/environmentVaiables.json and edit it.

####Install global packages

    npm i -g bunyan
    npm i -g nodemon //Running Locally
    npm i -g pm2 //Running On Server

####Start the server

Make sure redis is running and reachable, mongodb is reachable.

    npm run dev //Running Locally
    npm start //Running On Server

These commands are, respectively, shorthands for

    nodemon server.js | bunyan
	pm2 start ecosystem.json

The framework can otherwise be started by
	
	NODE_ENV=env node server