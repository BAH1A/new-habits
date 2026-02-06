interface HabitProps{
    completed:number
}
//import './Habit.css'

export function Habit(props: HabitProps){
    return(
        <p className='bg-purple-600 w-10 h-10 text-white text-center rounded-lg'>{props.completed}</p>
    )
}