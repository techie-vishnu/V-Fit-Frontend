import { useState } from 'react'
import './App.css'
import AdminPanel from './components/layout/adminPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1> */}
      <AdminPanel />
    </>
  )
}

export default App
