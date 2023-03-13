import './App.css';
import Home from './pages/Home';
import PleinAir from './pages/PleinAir';
import Illustration from './pages/Illustration';
import Login from './pages/Login';
import About from './pages/About';
import Locked from './pages/Locked';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './store/auth/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <div className='contentBodyGlobal'>
        <Routes>
          <Route index path='portfolio' element={<Home />} />
          <Route index path='pleinAir' element={<PleinAir />} />
          <Route index path='illustration' element={<Illustration />} />
          <Route path='login' element={<Login />} />
          <Route path='locked' element={<Locked />} />
          <Route path='about' element={<About />} />
          <Route exact path='/' element={<Home />} />
          {/* <Route
          path='dashboard'
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        /> */}
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;
