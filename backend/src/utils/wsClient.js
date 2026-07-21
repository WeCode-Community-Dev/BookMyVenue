

const wsClients = new Map();

export const addClient = (userId, ws) => {
  const existing = wsClients.get(userId) || [];
  wsClients.set(userId, [...existing, ws]);
};


export const removeClient = (userId, ws) => {
  const existing = wsClients.get(userId) || [];
  const updated = existing.filter(client => client !== ws);
  if (updated.length === 0) {
    wsClients.delete(userId);
  } else {
    wsClients.set(userId, updated);
  }
};

export const getClients = (userId) => {
  return wsClients.get(userId) || [];
};