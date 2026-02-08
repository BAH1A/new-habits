import { prismaCli } from '../lib/prisma.js'

const prisma = prismaCli

const firstHabitId = 10
const firstHabitCreationDate= new Date('2026-02-01T03:00:00.000')
const secondHabitId = 20
const secondHabitCreationDate= new Date('2026-02-01T03:00:00.000')
const thirdHabitId = 30
const thirdHabitCreationDate= new Date('2026-02-01T03:00:00.000')

async function main() {
    await prisma.habitWeekDays.deleteMany() //Deleta a tabela
    await prisma.dayHabit.deleteMany()
    await prisma.day.deleteMany()
    await prisma.habit.deleteMany()
    await Promise.all([
        prisma.habit.create({ //Popula a tabela
            data:{
                id: firstHabitId,
                title: 'Beber 4L de água',
                created_at: firstHabitCreationDate,
                weekDays:{
                    create:[
                        {week_day: 0},
                        {week_day: 1},
                        {week_day: 2},
                        {week_day: 3},
                        {week_day: 4},
                        {week_day: 5}
                    ]
                },
            }
    }),
        prisma.habit.create({ //Popula a tabela
            data:{
                id: secondHabitId,
                created_at: secondHabitCreationDate,
                title: 'Estudar',
                weekDays:{
                    create:[
                        {week_day: 0},
                        {week_day: 1},
                        {week_day: 2},
                        {week_day: 3},
                        {week_day: 4},
                        {week_day: 5}
                    ]
                },
            }
        }),
        prisma.habit.create({ //Popula a tabela
            data:{
                id: thirdHabitId,
                created_at: thirdHabitCreationDate,
                title: 'Academia',
                weekDays:{
                    create:[
                        {week_day: 0},
                        {week_day: 1},
                        {week_day: 2},
                        {week_day: 3},
                        {week_day: 4},
                        {week_day: 5}
                    ]
                },
            }
        })
    ])

    await Promise.all([
        /** Segunda */
        prisma.day.create({
            data:{
                date: new Date('2026-02-02T00:00:00.000'),
                dayHabits:{
                    create:[
                        {habit_id:firstHabitId},
                    ]
                }
            }
        }),
        /** Terca */
        prisma.day.create({
            data:{
                date: new Date('2026-02-03T00:00:00.000'),
                dayHabits:{
                    create:[
                        {habit_id:firstHabitId}
                    ]
                }
            }
        }),
        /** Quarta */
        prisma.day.create({
            data:{
                date: new Date('2026-02-04T00:00:00.000'),
                dayHabits:{
                    create: [
                        {habit_id:firstHabitId},
                        {habit_id:secondHabitId},
                        {habit_id:thirdHabitId},
                    ]
                }
            }
        }),
    ])
}
main()
    .then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })