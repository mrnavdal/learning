const http = require('node:http');

// Tahle funkce se zavolá při KAŽDÉM požadavku.
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello');
});

server.listen(3000, () => {
  console.log('Poslouchám na http://localhost:3000');
});
