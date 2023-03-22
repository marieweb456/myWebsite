import './App.css';
import Home from './pages/Home/index.jsx';
import PleinAir from './pages/PleinAir/index.jsx';
import Illustration from './pages/Illustration/index.jsx';
import Login from './pages/Login/index.jsx';
import About from './pages/About/index.jsx';
import Locked from './pages/Locked/index.jsx';
// import { Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './store/auth/AuthContext.js';
import Navbar from './components/Navbar/index.jsx';

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <div className='contentBodyGlobal'>
        <Routes>
          {/* Rediriger vers Home si le chemin n'est pas reconnu */}
          {/* <Route path='/*' element={<Navigate to='/' />} /> */}
          {/* <Route path='/' element={<Navigate to='/portfolio' />} /> */}
          <Route path='/' element={<Home />} />
          <Route path='/portfolio' element={<Home />} />
          <Route path='/pleinAir' element={<PleinAir />} />
          <Route path='/illustration' element={<Illustration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/locked' element={<Locked />} />
          <Route path='/about' element={<About />} />

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
