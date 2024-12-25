import { useState } from 'react'
import ToDo from './pages/toDo.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
   <ToDo/>
  )
}
export default App
