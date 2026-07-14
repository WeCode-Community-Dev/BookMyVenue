

const clients = new Map()

export const addClient = (userId, res) => {
  // get existing array or empty, push new res, set back
  const existing = clients.get(userId) ?? []
   existing.push(res)
   return clients.set(userId,existing)
}


export const removeClient = (userId, res) => {
  // filter out this specific res
  // if array is empty, delete the key entirely
  const updated = clients.get(userId)?.filter(r => r !== res) ?? []
  if(updated.length === 0){
    clients.delete(userId)
  }
  return clients.set(userId,updated);
};

export const getClients = (userId) => {
  // return the array, or empty array if not found
  return clients.get(userId);
}