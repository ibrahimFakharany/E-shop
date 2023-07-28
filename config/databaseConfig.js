const mongo = require("mongoose");

const dbConnection = () => {
  mongo.connect(process.env.DB_URI).then((conn) => {
    console.log(conn.connection.host);
  });
};

module.exports = dbConnection;
