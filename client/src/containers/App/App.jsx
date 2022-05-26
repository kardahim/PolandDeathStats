import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../../helpers/AuthContext'
import { useState} from "react"
// import containers
import NavBar from '../../containers/navbar/NavBar'
import Login from '../../containers/login/Login'
import Register from '../../containers/register/Register'

function App() {

  const [authState, setAuthState] = useState({
    email: "",
    id: "0",
    status: false
  });

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <NavBar />
        <Routes>
          {/* <Route path='/' element={<Home />}></Route> */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div >
  );
}

export default App;