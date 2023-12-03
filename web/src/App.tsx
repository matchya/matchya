import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import { axiosInstance } from './helper';
import Dashboard from './screens/Dashboard/Dashboard';
import Settings from './screens/Settings/Settings';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/hello" element={<Hello />} />
      </Routes>
    </Router>
  );
}

// TODO: Remove this once confirmed cookies work
export const Hello = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const id = 'ac7d9ea6-e3e5-4f58-ba26-22e4e2afa9c4'
    const get_position = async () => {
      const response = await axiosInstance.get(`/positions/${id}`)
      setData(response.data.payload)
      console.log("RESPONSE: ", response)
    }
    get_position()
  }, [])
  return <div>{
    data ? JSON.stringify(data):null
    }</div>
}

export default App;
