// // import { Routes, Route } from "react-router-dom"
// // import Login from "./componentes/Login"
// // import Dashboard from "./componentes/Dashboard"
// // import Products from "./componentes/Products"
// // import Sales from "./componentes/Sales"
// // import Reports from "./componentes/Reports"
// // import Navbar from "./componentes/Navbar"
// // // import Login from "./components/Login"
// // // import Dashboard from "./components/Dashboard"
// // // import Products from "./components/Products"
// // // import Sales from "./components/Sales"
// // // import Reports from "./components/Reports"
// // // import Navbar from "./components/Navbar"

// // function App() {
// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       <Navbar/>
// //       <div className="container mx-auto px-4 py-8">
// //         <Routes>
// //           <Route path="/" element={<Login/>} />
// //           <Route path="/dashboard" element={<Dashboard/>} />
// //           <Route path="/products" element={<Products/>} />
// //           <Route path="/sales" element={<Sales/>} />
// //           <Route path="/reports" element={<Reports/>} />
// //         </Routes>
// //       </div>
// //     </div>
// //   )
// // }

// // export default App

// // import { Routes, Route, Navigate } from "react-router-dom"
// // import { AuthProvider, useAuth } from "./contexts/AuthContext"
// // import Login from "./componentes/Login"
// // import Navbar from "./componentes/Navbar"
// // import Dashboard from "./componentes/Dashboard"
// // import Products from "./componentes/Products"
// // import Sales from "./componentes/Sales"
// // import Reports from "./componentes/Reports"
// // // import Login from "./components/Login"
// // // import Dashboard from "./components/Dashboard"
// // // import Products from "./components/Products"
// // // import Sales from "./components/Sales"
// // // import Reports from "./components/Reports"
// // // import Navbar from "./components/Navbar"

// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated } = useAuth()
// //   if (!isAuthenticated) {
// //     return <Navigate to="/" replace />
// //   }
// //   return children
// // }

// // function AppContent() {
// //   const { isAuthenticated } = useAuth()

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       {isAuthenticated && <Navbar/>}
// //       <div className="container mx-auto px-4 py-8">
// //         <Routes>
// //           <Route path="/" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace />} />
// //           <Route
// //             path="/dashboard"
// //             element={
// //               <ProtectedRoute>
// //                 <Dashboard/>
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/products"
// //             element={
// //               <ProtectedRoute>
// //                 <Products/>
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/sales"
// //             element={
// //               <ProtectedRoute>
// //                 <Sales/>
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/reports"
// //             element={
// //               <ProtectedRoute>
// //                 <Reports/>
// //               </ProtectedRoute>
// //             }
// //           />
// //         </Routes>
// //       </div>
// //     </div>
// //   )
// // }

// // function App() {
// //   return (
// //     <AuthProvider>
// //       <AppContent />
// //     </AuthProvider>
// //   )
// // }

// // export default App

// // import { Routes, Route, Navigate } from "react-router-dom"
// // import { AuthProvider, useAuth } from "./contexts/AuthContext"
// // import Layout from "./componentes/Layout"
// // import Login from "./componentes/Login"
// // import Dashboard from "./componentes/Dashboard"
// // import Products from "./componentes/Products"
// // import Sales from "./componentes/Sales"
// // import Reports from "./componentes/Reports"
// // // import Layout from "./components/Layout"
// // // import Login from "./components/Login"
// // // import Dashboard from "./components/Dashboard"
// // // import Products from "./components/Products"
// // // import Sales from "./components/Sales"
// // // import Reports from "./components/Reports"

// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated } = useAuth()
// //   if (!isAuthenticated) {
// //     return <Navigate to="/" replace />
// //   }
// //   return <Layout>{children}</Layout> 
// // }

// // function AppContent() {
// //   const { isAuthenticated } = useAuth()

// //   return (
// //     <Routes>
// //       <Route path="/" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace />} />
// //       <Route
// //         path="/dashboard"
// //         element={
// //           <ProtectedRoute>
// //             <Dashboard/>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/products"
// //         element={
// //           <ProtectedRoute>
// //             <Products/>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/sales"
// //         element={
// //           <ProtectedRoute>
// //             <Sales/>
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/reports"
// //         element={
// //           <ProtectedRoute>
// //             <Reports/>
// //           </ProtectedRoute>
// //         }
// //       />
// //     </Routes>
// //   )
// // }

// // function App() {
// //   return (
// //     <AuthProvider>
// //       <AppContent />
// //     </AuthProvider>
// //   )
// // }

// // export default App

// import { Routes, Route, Navigate } from "react-router-dom"
// import { AuthProvider, useAuth } from "./contexts/AuthContext"
// import Layout from "./componentes/Layout"
// import Login from "./componentes/Login"
// import Dashboard from "./componentes/Dashboard"
// import Products from "./componentes/Products"
// import Sales from "./componentes/Sales"
// import Reports from "./componentes/Reports"
// // import Reports from "./componentes/Reports"
// // import Layout from "./components/Layout"
// // import Login from "./components/Login"
// // import Dashboard from "./components/Dashboard"
// // import Products from "./components/Products"
// // import Sales from "./components/Sales"
// // import Reports from "./components/Reports"

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth()
//   return isAuthenticated ? <Layout>{children}</Layout>  : <Navigate to="/" replace />
// }

// function AppContent() {
//   const { isAuthenticated } = useAuth()

//   return (
//     <Routes>
//       <Route path="/" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace />} />
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard/>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/products"
//         element={
//           <ProtectedRoute>
//             <Products/>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/sales"
//         element={
//           <ProtectedRoute>
//             <Sales/>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/reports"
//         element={
//           <ProtectedRoute>
//             <Reports/>
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   )
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   )
// }

// export default App

import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Layout from "./componentes/Layout"
import Login from "./componentes/Login"
import Dashboard from "./componentes/Dashboard"
import Products from "./componentes/Products"
import Sales from "./componentes/Sales"
import Reports from "./componentes/Reports"
// import Layout from "./components/Layout"
// import Login from "./components/Login"
// import Dashboard from "./components/Dashboard"
// import Products from "./components/Products"
// import Sales from "./components/Sales"
// import Reports from "./components/Reports"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" replace />
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Sales/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports/>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

