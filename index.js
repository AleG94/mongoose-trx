'use strict';
const mongoose = require('mongoose');

module.exports = async (fn, options) => {
  const session = await mongoose.startSession();

  try {
    return await new Promise((resolve, reject) => {
      let result;

      session.withTransaction(() => fn(session).then(res => result = res), options)
        .then(() => resolve(result))
        .catch(reject);
    });
  } finally {
    session.endSession();
  }
};
