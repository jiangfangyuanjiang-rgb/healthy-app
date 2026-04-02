import { useState } from 'react'
import './index.css'
import { BottomNav, type TabType } from './components/BottomNav'
import { MealsPage } from './pages/MealsPage'
import { WorkoutPage } from './pages/WorkoutPage'
import { StatsPage } from './pages/StatsPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('meals')

  const renderPage = () => {
    switch (activeTab) {
      case 'meals':
        return <MealsPage />
      case 'workout':
        return <WorkoutPage />
      case 'stats':
        return <StatsPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <MealsPage />
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#ededed]">
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
