import './App.css'
import Manager from './components/manager.jsx'
const App = () => {
  return (
    <div>
      <div className=" flex justify-center absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      </div>
      <Manager className=' flex items-center justify-center' />
    </div>
  )
}

export default App
