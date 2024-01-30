const mongoose = require('mongoose');

const validateMongoDbId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid MongoDB ObjectId: ${id}`);
  }
};

module.exports = {validateMongoDbId};
