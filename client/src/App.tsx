import { Routes, Route } from 'react-router-dom'
import { Search } from './pages/Search'
import { Favorites } from './pages/Favorites'
import { Profile } from './pages/Profile'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App
