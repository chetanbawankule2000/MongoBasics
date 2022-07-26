const { MongoClient } = require("mongodb");

let dbConnection;

let uri =
  "mongodb+srv://chetan:Bookstore123@cluster0.zd9a3.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((error) => {
        console.log(error);
        return cb(error);
      });
  },
  getDb: () => dbConnection,
};
