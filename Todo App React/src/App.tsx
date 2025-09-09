import { TaskProvider } from './context/TaskContext'
import { Home } from './pages/Home'
import './App.css'

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Home />
      </div>
    </TaskProvider>
  )
}

export default App
