# Begin Development

Development can be performed by any IDE that supports Java and React. However, this repositority is specifically built to support VS Code. VS Code will enable developers to get everything running significantly quicker.

If you choose to use VS Code you can use the development containers instead of installing everything locally on your machine.
The solution has been setup to support `docker-compose` which will mimic the production infrastructure implementation.

To setup your local environment to run and develop the TNO solution, download or clone this mono-repo [https://github.com/bcgov/tno](https://github.com/bcgov/tno).

## Docker Development

If you choose to run the solution with Docker you will need to install the following.

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

> If using Windows OS it is preferable to **not** use the WSL version of Docker Desktop. While it may work, mileage may vary in certain scenarios.

There are a number of Windows related dependencies that are required to take advantage of some of the automated build scripts.
These scripts simplify the process of setting up your environment, but can be performed manually if you do not want to install the following.

| Windows                                                | Mac                                                     | Description                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Git Bash](https://git-scm.com/)                       |                                                         | All scripts in this project are `bash` which natively isn't supported by Windows.       |
| [chocolately](https://chocolatey.org/install)          |                                                         | Package manager for Windows.                                                            |
| [make](https://community.chocolatey.org/packages/make) | [make](https://formulae.brew.sh/formula/make)           | Useful tool for speeding up common activities.                                          |
|                                                        | [coreutils](https://formulae.brew.sh/formula/coreutils) |
|                                                        | [grep](https://formulae.brew.sh/formula/grep)           | Macos doesn't natively support GNU Grep, so you need to install it. `brew install grep` |
|                                                        | [gnupg](https://formulae.brew.sh/formula/gnupg)         | Generate signing keys `brew install gpnupg`                                             |

## Development Containers

VS Code supports developing inside a container.
This provides a very quick and reliable way to setup your whole local development environment without installing anything locally.
In theory you will no longer need to worry about missing dependencies, correct versions, or OS related issues.

Development containers provide an amazing way to ensure all developers have the identical environment to work in.

VS Code - [more information here](https://code.visualstudio.com/docs/remote/containers)

- Install [VS Code](https://code.visualstudio.com/download)

After installing vscode will recognize when you open a folder that contains a `.devcontainer` folder and ask you if you want to open the container.
Choosing to open the container will spin up one with all the required dependencies to do development work locally.
In addition, it will also install all the associated plugins for VS Code.

## Local Development (Without Development Containers)

If you would like to be able to build the solution locally or run the various components locally (not with Docker), you will need to install the following dependencies.
This can be helpful if your computer's performance is unable to support development within docker containers.

| Dependency                                                                                                                                           |  Version | Description                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ---------------------------------------------------------- |
| [Node](https://nodejs.org/en/download/)                                                                                                              | v16.10.0 |                                                            |
| [nvm](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows)                                                               |          | Required if you need to support different versions of node |
| [npm](https://docs.npmjs.com/cli/v7/configuring-npm/install)                                                                                         |   7.24.0 |                                                            |
| [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)                                                                                  |  v1.22.5 |                                                            |
| [jdk](https://docs.oracle.com/en/java/javase/11/install/installation-jdk-microsoft-windows-platforms.html#GUID-A7E27B90-A28D-4237-9383-A58B416071CA) |   17.0.2 |                                                            |
| [maven](http://maven.apache.org/install.html)                                                                                                        |    3.8.2 |                                                            |

## Standup Local Environment

In order for the various components of the solution to work they require the appropriate configuration files to be created.
You can auto generate them with the provided scripts.
This process will generate `.env` files in the required locations so that the solution and docker containers can run.

If you have installed `make` you can use the helper method.
If you haven't installed `make` you can use the docker-compose cli.
Review the `Makefile` and the related scripts `./tools/scripts` to understand how to do this.

When using `make` commands you can review the options by using the following command.

```bash
make
```

The following containers are hosted in the TNO solution.
The exposed container ports is configurable, but the defaults are identified below.

| Container       |                Port | Description                                                                                   |
| --------------- | ------------------: | --------------------------------------------------------------------------------------------- |
| nginx           |        40080, 40081 | Provides a reverse proxy network configuration enable a single entry point to the application |
| keycloak        |               40001 | Provides authentication and account management services                                       |
| database        |               40000 | Provides PostgreSQL relational database for the API                                           |
| elastic         |               40003 | Provides NoSQL Elasticsearch database for the API                                             |
| azure-storage   | 40006, 40007, 40008 | Azurite local Azure Storage for development                                                   |
| api             |               40010 | Provides the RESTful API which gives secure access to data                                    |
| editor          |               40082 | Web application for Editors                                                                   |
| subscriber      |               40083 | Web application for Subscribers                                                               |
| zookeeper       |               40100 | Kafka Zookeeper to manage cluster                                                             |
| broker          |        40101, 40102 | Kafka server and REST API v3                                                                  |
| schema-registry |               40103 | Kafka schema registry services                                                                |
| rest-proxy      |               40104 | Kafka REST API                                                                                |
| connect         |               40105 | Kafka connect Control Center with Schema Registry                                             |
| ksqldb-server   |               40106 | Kafka streaming services                                                                      |

The first time you do this takes a little longer as each container needs to be built and initialized.
After the docker containers are ready it becomes much quicker.
Additionally, there are a number of configuration settings (usernames, passwords, keys, etc) that are created the first time you execute this script.

Many laptops cannot handle running all containers running at one time, so you may want to use the other `make p=$profile` commands specifically to only start what you need.

```bash
# Configure your local environment.
# Start all of the containers that require initialization.
# Initialize the PostgreSQL database.
# Initialize the Kafka cluster topics.
# Initialize the Elasticsearch indexes.
make init
```

If you choose to only run what you need for specific types of feature development/testing you can use the following commands.
Or if you choose to run everything use the `make up` command.

```bash
# Start up containers for the web applications.
make up p=editor
# Start up containers for Kafka.
make up p=kafka
```

You can now view the application in your browser.
Login into Keycloak with the username and password you configured in your `.env` file.
You can then change the passwords for the default users to anything you would like.
Then you can login to the web application with one of those default users.

Be aware most of the api endpoints will require a valid JWToken.
Use Postman to interact with the API independently from the web application.
Read more [here](../test/README.md).

Use the Nginx proxy to use the Editor and Subscriber apps.
Nginx provides a reverse proxy, which handles communication with the API.

| Component          | Container  | URI                                               |
| ------------------ | ---------- | ------------------------------------------------- |
| Nginx - Editor     | nginx      | [http://localhost:40080](http://localhost:40080)  |
| Nginx - Subscriber | nginx      | [http://localhost:40081](http://localhost:40081)  |
| Editor app         | editor     | [http://localhost:40082](http://localhost:40082)  |
| Subscriber app     | subscriber | [http://localhost:40083](http://localhost:40083)  |
| API                | api        | [http://localhost:40010](http://localhost:40010)  |
| Keycloak           | keycloak   | [http://localhost:40001/](http://localhost:40001) |
| Kafka API          | rest-proxy | [http://localhost:40104](http://localhost:40104)  |
| Kafka Kowl         | kowl       | [http://localhost:40180](http://localhost:40180)  |
| Elasticsearch      | elastic    | [http://localhost:40003](http://localhost:40003)  |
| Dejavu             | dejavu     | [http://localhost:40005](http://localhost:40005)  |

Once the core containers are running you can then start up the other services and utilities.
Locally you will probably never want everything running at the same time.
Choose the services and utilities you need and run them independently.

```bash
# Start up the various utilities to view Kafka, and Elasticsearch.
make up n=[utility name]

# Start up the various supplementary services for the solution.
make up n=[service name]
```

Below is a list of all the additional services and utilities.

| Container     |  Port | Description                                                    |
| ------------- | ----: | -------------------------------------------------------------- |
| syndication   | 40020 | Kafka Producer to ingest syndication feeds                     |
| capture       | 40024 | Listens to audio/video streams and captures a file             |
| clip          | 40025 | Creates clips from capture files based on schedule             |
| content       | 40026 | Kafka Consumer to create content for Editors                   |
| nlp           | 40022 | Kafka Consumer/Producer to perform Natural Language Processing |
| command       |       | Runs command line utilities                                    |
| indexing      | 40023 | Kafka Consumer to index content for search                     |
| transcription |       | Kafka Consumer/Producer to transcribe audio/video content      |
| image         |       | Image ingestion service                                        |
| file          |       | File ingestion service                                         |
