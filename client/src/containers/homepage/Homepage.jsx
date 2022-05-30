import React from 'react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useEffect, useState } from 'react';
import './homepage.scss'
// import { resolveTo } from 'react-router/lib/router';

function Homepage() {
    // let navigate = useNavigate();
    // const { setAuthState } = useContext(AuthContext);
    // const [deathCauses, setDeathCauses] = useState([]);
    // const [deaths, setDeaths] = useState([]);
    // const [populations, stPopulations] = useState([]);
    // const [regions, setRegions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);

    const { authState } = useContext(AuthContext);

    useEffect(()=>{
        document.title = "Homepage"


    }, []); // eslint-disable-line react-hooks/exhaustive-deps



    const exportToJSON = () => {

    }

    const exportToXML = () => {

    }
    
    const exportToCSV = () => {

    }

    const fillDBWithDefaults = () => {

    }

    const importFromJSON = () => {

    }

    const importFromXML = () => {

    }

    const importFromCSV = () => {

    }


    
    return (
        <div className='home-container'>
            <div className='main-container'>
                <div className='chart-container'>
                    chart
                </div>
                <div className='data-container'>
                    data
                </div>
            </div>
            <div className='side-container'>
                {!authState.status && (
                    <>
                    <div className='options-container'>
                        <div className='option-group'>
                        <h4>Zaloguj się aby uzyskać dostęp do zapisu prezentowanych danych</h4>
                        </div>
                    </div>
                    </>
                )}
                {authState.status && (
                    <>
                    <div className='options-container'>
                        {authState.roles.some(e => e.RoleId === 3) && (
                            <>
                            <div className='option-group'>
                                <h3>Opcje użytkownika</h3>
                                <div className='option'>
                                    <button className='option-button' onClick={exportToJSON}> Export to .json</button>
                                </div>
                                <div className='option'>
                                    <button className='option-button' onClick={exportToXML}> Export to .xml</button>
                                </div>
                                <div className='option'>
                                    <button className='option-button' onClick={exportToCSV}> Export to .csv</button>
                                </div>
                            </div>
                            </>
                        )}
                        {authState.roles.some(e => e.RoleId === 4) &&  (
                            <>
                            <div className='option-group'>
                                <h3>Opcje administratora</h3>
                                <div className='option'>
                                    <button className='option-button' onClick={fillDBWithDefaults}> Fill db with defaults</button>
                                </div>
                                <div className='option'>
                                    <button className='option-button' onClick={importFromJSON}> Import from .json</button>
                                </div>
                                <div className='option'>
                                    <button className='option-button' onClick={importFromXML}> Import from .xml</button>
                                </div>
                                <div className='option'>
                                    <button className='option-button' onClick={importFromCSV}> Import from .csv</button>
                                </div>
                            </div>
                            </>
                        )}

                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Homepage