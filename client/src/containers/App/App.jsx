import './App.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthContext } from '../../helpers/AuthContext'
import { useState, useEffect } from "react"
// import containers
import Homepage from '../../containers/homepage/Homepage'
import NavBar from '../../containers/navbar/NavBar'
import Login from '../../containers/login/Login'
import Register from '../../containers/register/Register'
// axios
import axios from '../../api/axios'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [authState, setAuthState] = useState({
    email: "",
    id: "0",
    status: false,
    roles: []
  });
  useEffect(() => {
    axios
      .get('/users/auth', {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false })
          setIsLoading(false)
        }
        else {
          axios.get(`/userroles/user/${response.data.id}`).then((resp) => {
            setAuthState(
              {
                email: response.data.email,
                id: response.data.id,
                status: true,
                roles: resp.data
              })
            setIsLoading(false)
          })
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function NotLoggedRoute({ children }) {
    const auth = authState.status
    return auth ? <Navigate to='/' /> : children
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <NavBar isLoading={isLoading} />
          <Routes>
          <Route path='/' element={<Homepage />}></Route>
            {(!isLoading &&
              <>
                <Route path='/login' element={<NotLoggedRoute><Login /></NotLoggedRoute>}></Route>
                <Route path='/register' element={<NotLoggedRoute><Register /></NotLoggedRoute>}></Route>
              </>
            )}
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div >
  );
}

export default App;