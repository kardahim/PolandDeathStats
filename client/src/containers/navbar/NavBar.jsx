import React from 'react'
import './navBar.scss'
import { Link } from 'react-router-dom'

function NavBar() {

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
            <nav className='navbar'>
                <Link to='/' className='navbar-branding'>Logo</Link>
                <ul className='navbar-menu'>
                    <li className='navbar-item'>
                        <Link to='/login' className='navbar-link'>Zaloguj się</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='/register' className='navbar-link'>Zarejestruj się</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='#' className='navbar-link'>Empty</Link>
                    </li>
                </ul>
                <div className='hamburger' onClick={() => toogle()}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </nav>
        </header>
    )
}
export default NavBar