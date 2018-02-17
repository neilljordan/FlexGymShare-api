# Welcome to the Flex Gym Share API project

This is a  app which is accessed by the Flex UI project.

The app is written with NodeJS and Express. It uses a PostgreSQL database for persistent storage.

## Set up and configuration

To run the API project on your machine you will need to specify so environment variables including the port you want to run the application on, the database URL, and the hostname of the origin server initiating API calls to the project. This last setting is designed to only allows calls from the UI project to the API server.

        "NODE_ENV": "development",
        "PORT": "3131",
        "DATABASE_URL": "postgres://localhost/my-database",
        "ORIGIN_HOST": "http://localhost:3000"

The KnexJS library is used for database access. To set up a clean database for development you will need to run the following commands:

        knex migrate:rollback;
        knex migrate:latest;
        knex seed:run;

## Other Best Practices

All code that is being checked in must be linted using eslint. Code with eslint warnings may be committed but no eslint errors are acceptable. The project uses the Airbnb eslint config by default with a few setting changes.

Versioning is done according to semver: https://semver.org/

## Project Management and Branching
The sprint planning for this project is done with Waffle:

[![Waffle.io - Columns and their card count](https://badge.waffle.io/FlexGymShare/FlexGymShare-api.svg?columns=Next,In%20Progress,Review,Done)](https://waffle.io/FlexGymShare/FlexGymShare-api)

To work on a new issue, create a branch with the issue number at the start of the name and do your work in that branch.

For example, to work on issue #34 "Gym worker can check-in users for gym visits" (https://waffle.io/FlexGymShare/FlexGymShare-api/cards/5a62266ebb8d7a0076f3affd) you should create a branch called "34-gym-visit-check-in" or similar to make it clear which issue you are working on.

When finished, publish your changes to that branch and issue a pull request so other developers can review your changes.


