import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Welcome } from './pages/Welcome'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Onboarding } from './pages/Onboarding'
import { Search } from './pages/Search'
import { Recommendations } from './pages/Recommendations'
import { Favorites } from './pages/Favorites'
import { Restaurants } from './pages/Restaurants'
import { Community } from './pages/Community'
import { DishDetail } from './pages/DishDetail'
import { RestaurantDetail } from './pages/RestaurantDetail'
import { Review } from './pages/Review'
import { Profile } from './pages/Profile'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/dishes/:id" element={<DishDetail />} />
        <Route path="/dishes/:id/review" element={<Review />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App
