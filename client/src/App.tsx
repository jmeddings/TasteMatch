import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { Recommendations } from './pages/Recommendations'
import { Favorites } from './pages/Favorites'
import { Restaurants } from './pages/Restaurants'
import { Community } from './pages/Community'
import { Profile } from './pages/Profile'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App
