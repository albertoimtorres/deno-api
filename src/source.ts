import { init, MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

const client = new MongoClient()

client.connectWithUri(`${Deno.env.get('URI_MONGO')}:${Deno.env.get('PORT_MONGO')}`)

const db = client.database(`${Deno.env.get('DB')}`)

export default db;