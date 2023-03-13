import './App.css';
import Home from './pages/Home';
import PleinAir from './pages/PleinAir';
import Illustration from './pages/Illustration';
import Login from './pages/Login';
import About from './pages/About';
import Locked from './pages/Locked';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './store/auth/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <div className='contentBodyGlobal'>
        <Routes>
          {/* <Route index path='portfolio' element={<Home />} /> */}
          <Route exact path='/' element={<Home />} />
          <Route path='pleinAir' element={<PleinAir />} />
          <Route path='illustration' element={<Illustration />} />
          <Route path='login' element={<Login />} />
          <Route path='locked' element={<Locked />} />
          <Route path='about' element={<About />} />

          {/* Rediriger vers Home si le chemin n'est pas reconnu */}
          <Route path='*' element={<Navigate to='/' />} />

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
