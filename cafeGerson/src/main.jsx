// // import React from 'react'
// // import ReactDOM from 'react-dom/client'
// // import App from './App.jsx'
// // import './index.css'

// // ReactDOM.createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>,
// // )

// import React from "react"
// import ReactDOM from "react-dom/client"
// import { BrowserRouter as Router } from "react-router-dom"
// import App from "./App"
// import "./index.css"

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Router>
//       <App />
//     </Router>
//   </React.StrictMode>,
// )

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import axios from "axios"
import App from "./App"
import "./index.css"
import "sweetalert2/dist/sweetalert2.min.css"

// Configurar el interceptor de Axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)

