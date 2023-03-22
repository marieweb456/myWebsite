import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import reportWebVitals from './reportWebVitals';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import { HashRouter, Routes, Route } from 'react-router-dom';
import { store } from './store/store.js';
import { Provider } from 'react-redux';
//
import Home from './pages/Home/index.jsx';
import PleinAir from './pages/PleinAir/index.jsx';
import Illustration from './pages/Illustration/index.jsx';
import Login from './pages/Login/index.jsx';
import About from './pages/About/index.jsx';
import Locked from './pages/Locked/index.jsx';
import { AuthContextProvider } from './store/auth/AuthContext.js';
import Navbar from './components/Navbar/index.jsx';

// version react 17
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* <Routes> */}
        {/* la route spécifique sera l'ensemnle des elements dans app, donc le router  */}
        {/* <Route path='/*' element={<App />} /> */}
        {/* </Routes> */}
        <AuthContextProvider>
          <Navbar />
          <div className='contentBodyGlobal'>
            <Switch>
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
            </Switch>
          </div>
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
