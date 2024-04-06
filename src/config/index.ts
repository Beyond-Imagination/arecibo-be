import { config } from 'dotenv'

config()

export const { NODE_ENV, DB_URI, DB_NAME, CLIENT_URL } = process.env

export const PORT = Number.parseInt(process.env.PORT) || 5000

export const SECRET_KEY = process.env.SECRET_KEY || 'secret'
