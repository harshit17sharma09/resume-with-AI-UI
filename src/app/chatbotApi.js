export async function queryChatbot(query) {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();
    return data.answer;
  }
  