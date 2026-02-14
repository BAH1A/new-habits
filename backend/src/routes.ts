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

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParans = z.object({
            id: z.string()
        })
        const {id} = toggleHabitParans.parse(request.params)
        const today = dayjs().startOf('day').toDate()
        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })
        if (!day){
            day = await prisma.day.create({
                data:{
                    date:today
                }
            })
        }
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id:{
                    day_id: day.id,
                    habit_id: parseInt(id)
                }
            }
        })
        if (dayHabit){
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        }else{
            //Completa o habito
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: parseInt(id)
                }
            })
        }
    })

    app.get('/summary', async (request) =>{
        const summary = await prisma.$queryRaw`
        SELECT
            D.id,
            D.date,

            (
                SELECT
                    cast(count(*) as float)
                FROM dayHabits DH
                WHERE DH.day_id = D.id
            ) AS completed,
            (
                SELECT
                    cast(count(*) as float)
                FROM habit_week_days HWD
                JOIN habits H
                    ON H.id = HWD.habit_id
                WHERE
                    HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                    AND H.created_at <= D.date
            ) AS amount
        FROM days D
        `
        return summary
    })
}