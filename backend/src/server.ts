import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes.js';

const app = Fastify();

app.register(cors)
app.register(appRoutes)

const porta_api = Number(process.env.PORT)
app.listen({ port: porta_api })
  .then(() => {console.log(`Api ouvindo em: http://localhost:${porta_api}/`)})

