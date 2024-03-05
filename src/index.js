import React from "react"
import ReactDOM from "react-dom"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
//
import { store } from "./store/store.js"
import { AuthContextProvider } from "./store/auth/AuthContext.js"

import Navbar from "./components/Navbar/index.jsx"
import Footer from "./components/Footer/index.jsx"

import Home from "./pages/Home/index.jsx"
import PleinAir from "./pages/PleinAir/index.jsx"
import Illustration from "./pages/Illustration/index.jsx"
import Login from "./pages/Login/index.jsx"
import About from "./pages/About/index.jsx"
import Locked from "./pages/Locked/index.jsx"
import Error from "./pages/Error404/index.jsx"

// version react 17
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthContextProvider>
          <div className="contentBodyTotal">
            <Navbar />
            <div className="contentBodyGlobal">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/*" element={<Error />} />
                <Route path="/pleinAir" element={<PleinAir />} />
                <Route path="/illustration" element={<Illustration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/locked" element={<Locked />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
