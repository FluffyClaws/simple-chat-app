const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws, req) => {
  const chatId = req.url.split("/")[2]; // Extract the chat ID from the URL
  const clientId = Date.now(); // Generate a unique client ID

  clients.set(clientId, { ws, chatId });

  console.log(`New client connected to chat ${chatId}`);

  ws.on("message", (message) => {
    const { chatId } = clients.get(clientId);
    const parsedMessage = JSON.parse(message);

    // Broadcast the message to all clients in the same chat
    for (const [, client] of clients) {
      if (client.chatId === chatId) {
        client.ws.send(JSON.stringify(parsedMessage));
      }
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

console.log("WebSocket server started on port 8080");
