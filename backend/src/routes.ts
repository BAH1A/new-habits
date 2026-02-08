import type { FastifyInstance } from "fastify";
import { prismaCli } from "../lib/prisma.js";
import { date, z } from 'zod'
import dayjs from "dayjs";

const prisma = prismaCli;

export async function appRoutes(app: FastifyInstance){
    app.post('/habits', async (request) => { //Cria novos habitos
        const createHabitBody = z.object({
            //**
            // Faz a validação com a lib zod,
            // ele verifica se o que ta vindo de request.body
            // está correto com seu tipo certo. */
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })
        const { title, weekDays } = createHabitBody.parse(request.body)
        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map( weekDays => {
                        return{
                            week_day: weekDays
                        }
                    })
                }
            }
        })
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })
        const { date } = getDayParams.parse(request.query)
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')
        console.log(date, weekDay)
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at:{
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })
        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include:{
                dayHabits: true,
            }
        })
        const completeHabits= day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })

        return {
            possibleHabits, completeHabits
        }

    })
}