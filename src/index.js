import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { store } from './store/store.js';
import { Provider } from 'react-redux';

// version react 17
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          {/* la route spécifique sera l'ensemnle des elements dans app, donc le router  */}
          <Route path='/*' element={<App />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
