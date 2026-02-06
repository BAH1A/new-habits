import Fastify from 'fastify'
import cors from '@fastify/cors'
import { prismaCli } from '../lib/prisma.js'

const app = Fastify();
const prisma = prismaCli;

app.register(cors)

app.get('/', async () => {
  const habits = await prisma.habit.findMany();
  return habits
})

const porta_api = Number(process.env.PORTA_API_BACK)
app.listen({ port: porta_api })
  .then(() => {console.log(`Api ouvindo o endereço: http://localhost:${porta_api}/`)})