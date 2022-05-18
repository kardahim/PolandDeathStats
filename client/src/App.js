import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import pages
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
// import containers
import NavBar from './containers/navbar/NavBar'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </Router>
    </div >
  );
}

export default App;