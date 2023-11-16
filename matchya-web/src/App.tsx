import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home'
import Settings from './screens/Settings';
import Header from './components/Header'


function App() {

  return (
    <Router>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </Router>
  )
}

export default App
