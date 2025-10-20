// Define a type to represent a chat message
export type ChatMsg = {
  // The role of the message sender
  role: "system" | "user" | "assistant"; // can be one of "system", "user", or "assistant"
  // The content of the chat message
  content: string;
};

// Asynchoronous function to send chat messages
export async function sendChat(messages: ChatMsg[]) {
  // Send the chat message to the server using the Fetch API
  const res = await fetch("/api/chat", {
    method: "POST", // HTTP method to indicate creation of resource
    headers: { "Content-Type": "application/json" }, // Specify the content type as JSON
    body: JSON.stringify({ messages }), // Convert the messages array to JSON
  });
  // Check if the response is okay; if not, throw error
  if (!res.ok) throw new Error("chat failed");
  // Parse response body as JSON and return it
  return res.json();
}
