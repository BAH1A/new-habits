import { Habit } from './components/Habit'
import './styles/global.css'

function App() {
  return (
    <div className='flex gap-3 justify-center'>
      <Habit completed={3}/>
      <Habit completed={3}/>
      <Habit completed={3}/>
      <Habit completed={3}/>
      <Habit completed={3}/>
      <Habit completed={3}/>
    </div>
  )
}

export default App