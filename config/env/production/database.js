const parse = require("pg-connection-string").parse;
// const config = parse(process.env.DATABASE_URL);
const { host, port, database, user, password } = parse(process.env["DATABASE_URL"]);

module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host,
        port,
        database,
        username,
        password,
        ssl: {
          rejectUnauthorized: false,
        },
      },
      options: {
        ssl: true,
      },
    },
  },
});
