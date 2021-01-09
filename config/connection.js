//database connecting
const mongoClient = require("mongodb").MongoClient;
const state = {
  db: null,
};
//use connect() for all files
module.exports.connect = function (done) {
  const url =
    "mongodb+srv://admin:CNojm0HyXo4iA9Z5@cluster0.shb7d.mongodb.net/classRoom?retryWrites=true&w=majority";
  const dbName = "classRoom";
  mongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, data) => {
      if (err) return done(err);
      state.db = data.db(dbName);
      done();
    }
  );
};
module.exports.get = function () {
  return state.db;
};
