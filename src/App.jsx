import {Outlet} from "react-router-dom"
import { useState } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { UserProvider } from "./components/UserContext"

// * all data being passed down through the app

function App() {
 
  return (
    <>
  <UserProvider>
      <Navbar />
      <main className="bg-gray-900">
      <Outlet />
      </main>
      <Footer />
      </UserProvider>
    </>
  )
}

export default App
