const http = require("https");
const app = require("./app");
const server = http.createServer(app);
const { API_PORT } = process.env;
const port = API_PORT || 3000

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
