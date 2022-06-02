import { React } from 'react'
import axios from 'axios';
import './navBar.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../helpers/AuthContext'
import { useState, useEffect } from "react"

function NavBar() {

  const [authState, setAuthState] = useState({
    username: "",
    id: "0",
    status: false
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
          setAuthState(
            {
              email: response.data.email,
              id: response.data.id,
              status: true
            }
          )
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      email: "",
      id: "0",
      status: false
    });
    window.location.pathname = "/"
  };

  // hamburger function
  function toogle() {
    document.querySelector(".navbar-menu").classList.toggle("active")

    document.querySelectorAll(".navbar-link").forEach(n => {
      n.addEventListener("click", () => {
        document.querySelector(".navbar-menu").classList.remove("active")
      })
    });
  }

  return (
    <header>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <nav className='navbar'>
          <Link to='/' className='navbar-branding'>&lt;Logo&gt; PolandDeathStats</Link>
          <ul className='navbar-menu'>
            {!authState.status && (
              <>
                <li className='navbar-item'>
                  <Link to='/login' className='navbar-link'>Zaloguj się</Link>
                </li>
                <li className='navbar-item'>
                  <Link to='/register' className='navbar-link'>Zarejestruj się</Link>
                </li>
              </>
            )}
            {authState.status && (
              <>
                <li className='navbar-item'>
                  <Link to='/' onClick={logout} className='navbar-link'>Wyloguj się {authState.username}</Link>
                </li>
              </>
            )}



            {/* <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li> */}
          </ul>
          <div className='hamburger' onClick={() => toogle()}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </nav>
      </AuthContext.Provider>
    </header>
  )
}
export default NavBar