import './App.css'
import Header from './components/Header'
import Feed from './components/Feed'
import BubbleVisualization from './components/BubbleVisualization'
import TopicSelector from './components/TopicSelector'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <div className="app-container">
        <Header />

        <div className="main-content">
          <div className="sidebar">
            <TopicSelector />
            <BubbleVisualization />
          </div>

          <div className="content">
            <Feed />
          </div>
        </div>
      </div>
    </UserProvider>
  )
}

export default App
