# mongoose-trx

[![CircleCI][circleci-image]][circleci-url]
[![NPM Version][npm-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

A simple helper for hassle-free transactions with mongoose.

## Requirements

* [mongoose](https://www.npmjs.com/package/mongoose) (5.2.0 or higher)


## Installation

```
npm install mongoose-trx
```

## Usage

Executing a transaction and getting the result is as simple as doing:

```js
const transaction = require('mongoose-trx');

const txOpts = { readConcern: 'majority', writeConcern: 'majority' };
const [customer] = await transaction(session => Customer.create([{ name: 'Test' }], { session }), txOpts);

// Continue with 'customer'
```

<br>

This is equivalent to the following native mongoose code which is less clean and more verbose at the same time.

```js
const session = await Customer.startSession();

const txOpts = { readConcern: 'majority', writeConcern: 'majority' };

let customer;

await session.withTransaction(async () => {
  [customer] = await Customer.create([{ name: 'Test' }], { session });
}, txOpts);

session.endSession();

// Continue with 'customer'
```


[circleci-image]: https://circleci.com/gh/AleG94/mongoose-trx.svg?style=svg
[circleci-url]: https://circleci.com/gh/AleG94/mongoose-trx
[coveralls-image]: https://coveralls.io/repos/github/AleG94/mongoose-trx/badge.svg?branch=main
[coveralls-url]: https://coveralls.io/github/AleG94/mongoose-trx?branch=main
[npm-image]: https://img.shields.io/npm/v/mongoose-trx.svg
[npm-url]: https://npmjs.org/package/mongoose-trx
[license-image]: https://img.shields.io/npm/l/mongoose-trx.svg
[license-url]: https://github.com/AleG94/mongoose-trx/blob/main/LICENSE
