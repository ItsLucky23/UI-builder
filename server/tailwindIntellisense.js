import { WebSocketServer } from "ws";
import { spawn } from "child_process";

const PORT = 3000;
const wss = new WebSocketServer({ port: PORT });
console.log(`Tailwind LSP server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  // spawn Tailwind language server
  const lspProcess = spawn("node", [
    require.resolve("@tailwindcss/language-server/bin/tailwindcss-language-server"),
    "--stdio",
  ]);

  ws.on("message", (msg) => {
    // forward from client to LSP
    lspProcess.stdin.write(msg);
  });

  lspProcess.stdout.on("data", (data) => {
    // forward from LSP to client
    ws.send(data);
  });

  ws.on("close", () => {
    lspProcess.kill();
  });
});