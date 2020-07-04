# API Deno Oak Example

## TODO API

CRUD created with middleware framework for Deno's http server, including a router middleware.

## Modules

[![oak ci](https://github.com/oakserver/oak/workflows/oak%20ci/badge.svg)](https://github.com/oakserver/oak)

[![tag](https://img.shields.io/github/tag/manyuanrong/deno_mongo.svg)](https://github.com/manyuanrong/deno_mongo/releases)

## Database

Connection to Mongodb

## Execute server with deno

**deno run --allow-net --allow-write --allow-read --allow-plugin --unstable --inspect server.ts**

## Execute server with denon (nodemon to deno)

**denon start**

# API

  # [POST]:
    User registration, required fields email and password.
    URL: api/v1/register

  # [POST]:
    Login.
    URL: /api/v1/login

  # [POST]:
    Create new item from to-do list, name required field.
    URL: /api/v1/create

  # [GET]:
    Get all items from to-do list.
    URL: /api/v1/todos

  # [GET]:
    Gets a single item by its id.
    URL: /api/v1/todo/5edfcc3500cc3198003ec638

  # [GET]:
    Pagination from to-do list.
    URL: /api/v1/pagination?skip=1&limit=5

  # [PUT]:
    Updating the item's data, the required field is: id and name.
    URL: /api/v1/update

  # [DELETE]:
    Delete item, id required field
    URL: /api/v1/delete

## New integrations
# In future changes, I will integrate API documentation with swagger