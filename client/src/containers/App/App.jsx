import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../../helpers/AuthContext'
import { useState, useEffect} from "react"
import axios from 'axios';
// import containers
import NavBar from '../../containers/navbar/NavBar'
import Login from '../../containers/login/Login'
import Register from '../../containers/register/Register'
import Homepage from '../../containers/homepage/Homepage';

function App() {

  const [authState, setAuthState] = useState({
    email: "",
    id: "0",
    status: false,
    roles: []
  });

  useEffect(() => {
    axios
      .get('http://localhost:3001/users/auth', {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false })
        }
        else {
          // var tempRoles = []
          // console.log(response.data.id)
          axios.get(`http://localhost:3001/userroles/user/${response.data.id}`).then((resp) => {
            // tempRoles = response.data
            // console.log(resp.data)
            setAuthState(
              {
                email: response.data.email,
                id: response.data.id,
                status: true,
                roles: resp.data
              }
            )
            // console.log(authState)
          })
          // console.log(tempRoles)

          
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div >
  );
}

export default App;