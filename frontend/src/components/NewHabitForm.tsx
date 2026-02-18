import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox'
import { useState, type SubmitEvent } from "react";
import { api } from "../lib/axios";

const availableWeekDays=[
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
]

export function NewHabitForm(){
    const [title, setTitle] = useState('')
    const [weekDays, setWeekdays] = useState<number[]>([])
    async function createNewHabit (event: SubmitEvent){
        event.preventDefault()
        if(!title || weekDays.length===0){
            return
        }
        await api.post('habits', {
            title,
            weekDays
        })
        setTitle('')
        setWeekdays([])
        alert(`O hábito, ${title}, foi criado com sucesso!`)
    }
    function handleToggleWeekDay(weekDay: number){
        if (weekDays.includes(weekDay)){
            const weekDaysWithRemovedOne=weekDays.filter(day=>day!=weekDay)
            setWeekdays(weekDaysWithRemovedOne)
        }
        else{
            const weekDaysWithAddedOne = [...weekDays,weekDay]
            setWeekdays(weekDaysWithAddedOne)
        }
    }
    return(
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual sua nova prática?
            </label>
            <input
                type="text"
                id="title"
                placeholder="Ex.: Treinar, Estudar, Ler..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
            />
            <label htmlFor="" className=" mt-3 font-semibold leading-tight">
                Em quais dias irá praticar?
            </label>
            <div className='mt-2 flex flex-col gap-2'>
                {availableWeekDays.map((weekDay, index) => {
                    return(
                        <Checkbox.Root
                            key={weekDay}
                            className='flex items-center gap-3 group'
                            checked={weekDays.includes(index)}
                            onCheckedChange={()=> {handleToggleWeekDay(index)}}>
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-700 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'>
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white'/>
                                </Checkbox.Indicator>
                            </div>
                            <span className='text-xl text-zinc-400 leading-tight group-data-[state=checked]:text-white group-data-[state=checked]:font-semibold'>
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}
            </div>
            <button type="submit" className="mt-6 rounded-lg p-4 flex itens-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors">
                <Check size={20} weight="bold" />
                Salvar
            </button>
        </form>
    )
}