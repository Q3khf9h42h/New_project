const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const readMessagesFromFile = () => {
  try {
    const messages = fs.readFileSync('messages.txt', 'utf8').split('\n').filter(Boolean);
    return messages.reverse(); // Reverse to show newest messages at the top
  } catch (err) {
    console.error('Error reading messages:', err);
    return [];
  }
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const messages = readMessagesFromFile();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <form method="post" action="/">
        <textarea name="message" placeholder="Enter your message"></textarea>
        <br>
        <button type="submit">Submit</button>
      </form>
      <h2>Messages:</h2>
      <ul>
        ${messages.map(message => `<li>${message}</li>`).join('')}
      </ul>
    `);
    res.end();
  } else if (req.method === 'POST' && req.url === '/') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = querystring.parse(body);
      const newMessage = parsedBody.message.trim();
      if (newMessage) {
        fs.appendFileSync('messages.txt', newMessage + '\n');
      }
      res.writeHead(303, { 'Location': '/' });
      res.end();
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3003, () => {
  console.log('Server running on port 3003');
});
