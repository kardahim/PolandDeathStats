import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import containers
import NavBar from './containers/navbar/NavBar'
import Login from './containers/login/Login'
import Register from './containers/register/Register'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          {/* <Route path='/' element={<Home />}></Route> */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </Router>
    </div >
  );
}

export default App;