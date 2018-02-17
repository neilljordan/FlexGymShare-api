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

All code that is being checked in must be linted using eslint. Tthere is a pre-commit task which enforces linting in order to commit a change; code with warnings may be committed but no errors are acceptable. The project uses the Airbnb eslint config by default with a few minor changes.

Versioning is done according to [semver](https://semver.org/).

## Project Management and Branching
The sprint management for this project is done with [Waffle](https://www.waffle.io):

[![Waffle.io - Columns and their card count](https://badge.waffle.io/FlexGymShare/FlexGymShare-api.svg?columns=Next,In%20Progress,Review,Done)](https://waffle.io/FlexGymShare/FlexGymShare-api)

Waffle creates a planning board interface on top of a project's GitHub issues. Using Waffle, there is NO NEED TO MANUALLY MOVE CARDS when following the correct approach.

To work on a new issue, create a branch with the issue number at the start of the name and do your work in that branch. Doing this triggers Waffle to set you as the owner for the issue and sets the issue to In Progress. This will ensure that another developer won't try to duplicate your efforts.

After committing the change make sure to include "(Closes #[issue_number]) at the end of the title of your pull request. This will automatically move the card to the Review state so other developers can review and approve the change. When the branch is merged to master the card will be automatically set to done.

For example, to work on issue #34 "Gym worker can check-in users for gym visits" (https://waffle.io/FlexGymShare/FlexGymShare-api/cards/5a62266ebb8d7a0076f3affd) you should create a branch called "34-gym-visit-check-in" or similar to make it clear which issue you are working on.
