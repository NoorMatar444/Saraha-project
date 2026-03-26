

export function getBlackListTokenKey({userId,tokenId}){
  return `blackListToken::${userId}::${tokenId}`
}


export async function set({ key, value, exType = "EX", exValue = 60 }) {
  return await client.set(key, value, {
    expiration: {
      type: exType,
      value: Math.floor(exValue),
    },
  });
}

export async function hset(fields){
  return await client.hset(fields)
}

export async function update({ key, value }) {
  const fieldExists = await client.exists(key);

  if (!fieldExists) {
    return 0;
  }

  return await client.set(key, value);
}


export async function remove(keys) {
  return await client.del(keys);
}


export async function ttl(key) {
  return await client.ttl(key);
}


export async function setExpire(key, seconds) {
  return await client.expire(key, seconds);
}


export async function removeExpire(key) {
  return await client.persist(key);
}


export async function get(key) {
  return await client.get(key);
}


export async function mget(keys) {
  return await client.mGet(keys);
}


export async function exists(key) {
  return await client.exists(key);
}
