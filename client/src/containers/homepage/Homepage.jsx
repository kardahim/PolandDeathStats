import React from 'react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useEffect, useState } from 'react';
import './homepage.scss'
// import { resolveTo } from 'react-router/lib/router';
// import components
import Area from '../../components/area/Area'
import Table from '../../components/table/Table'

function Homepage() {
    // let navigate = useNavigate();
    // const { setAuthState } = useContext(AuthContext);
    const [deathCauses, setDeathCauses] = useState([]);
    const [deaths, setDeaths] = useState([]);
    const [populations, setPopulations] = useState([]);
    const [regions, setRegions] = useState([]);
    const [jsonData, setJsonData] = useState([])

    const { authState } = useContext(AuthContext);

    useEffect(() => {
        document.title = "Homepage"

        axios.get("http://localhost:3001/regions").then((response) => {
            setRegions(response.data)
        })
        axios.get("http://localhost:3001/deathcauses").then((response) => {
            setDeathCauses(response.data)
        })
        axios.get("http://localhost:3001/populations").then((response) => {
            setPopulations(response.data)
        })
        axios.get("http://localhost:3001/deaths").then((response) => {
            setDeaths(response.data)
        })

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // combine all data into customized array of objects
    const combineData = () => {
        var data = deaths
        // removing id, createdAt, updatedAt attribs
        data = data.map(({ id, createdAt, updatedAt, ...keepAttrs }) => keepAttrs)
        // adding Population(count) attrib
        data.forEach(obj => {
            obj.population = populations.filter(function (obj2) {
                return obj.RegionId === obj2.RegionId && obj.year === obj2.year
            })[0].value
        })
        // adding Region(name) attrib
        data.forEach(obj => {
            obj.region = regions.filter((obj2) => {
                return obj.RegionId === obj2.id
            })[0].name
            // obj.region = regions.find( ({id}) => id = obj.RegionId).name
        })
        // removing RegionId attrib
        data = data.map(({ RegionId, ...keepAttrs }) => keepAttrs)
        // adding DeathCause(name) attrib
        data.forEach(obj => {
            obj.deathCause = deathCauses.filter((obj2) => {
                return obj.DeathCauseId === obj2.id
            })[0].name
            // obj.deathCause = deathCauses.find( ({id}) => id = obj.DeathCauseId).name
        })
        // removing DeathCauseId attrib
        data = data.map(({ DeathCauseId, ...keepAttrs }) => keepAttrs)

        // console.log(data)
        setJsonData(data)

        // console.log(jsonData[1])
    }

    const exportToJSON = () => {
        combineData()

        if (jsonData.length > 0) {
            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                JSON.stringify(jsonData)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "data.json";

            link.click();
        }
    }

    const exportToXML = () => {

    }

    // I think that table has export to csv (excel format is for enterprise)
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

    // example area chart's dataset
    const dataset = [
        { x: new Date("2000"), y: 1000 },
        { x: new Date("2001"), y: 1367 },
        { x: new Date("2002"), y: 973 },
        { x: new Date("2003"), y: 973 },
        { x: new Date("2004"), y: 953 },
        { x: new Date("2005"), y: 4173 },
        { x: new Date("2006"), y: 973 },
        { x: new Date("2007"), y: 332 },
        { x: new Date("2008"), y: 973 },
        { x: new Date("2009"), y: 7273 },
        { x: new Date("2010"), y: 973 },
        { x: new Date("2011"), y: 2373 },
        { x: new Date("2012"), y: 913 },
        { x: new Date("2013"), y: 1273 },
        { x: new Date("2014"), y: 176 },
    ]

    // example table's dataset
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'year', headerName: 'Rok', type: 'time' },
        { field: 'region', headerName: 'Region', width: 150 },
        { field: 'population', headerName: 'Populacja', type: 'number', width: 150 },
        { field: 'deaths', headerName: 'Śmierci', type: 'number', width: 150 },
        {
            field: 'rate',
            headerName: 'Współczynnik śmiertelności',
            valueGetter: params => (`${(params.row.deaths / params.row.population * 100).toFixed(2)}%`),
            width: 300
        },
        { field: 'causes', headerName: 'Przyczyna śmierci', width: 300 },
    ]

    const rows = [
        { id: 1, year: 1999, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
        { id: 2, year: 2000, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
        { id: 3, year: 2001, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
        { id: 4, year: 2002, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
        { id: 5, year: 2003, region: 'Zadupie Dolne', population: 120, deaths: 45, causes: 'Syfilis' },
        { id: 6, year: 2004, region: 'Zadupie Dolne', population: 120, deaths: 45, causes: 'Syfilis' },
        { id: 7, year: 2005, region: 'Zadupie Górne', population: 150, deaths: 15, causes: 'Syfilis' },
    ];


    return (
        <div className='home-container'>
            <div className='main-container'>
                <div className='chart-container'>
                    <Area
                        title='Tytuł'
                        dataset={dataset} />
                </div>
                <div className='data-container'>
                    <Table
                        rows={rows}
                        columns={columns}
                        pageSize={20} />
                    {/* <table className='table'>
                        <thead>
                            <tr className='table-header'>
                                <th>Rok</th>
                                <th>Region</th>
                                <th>Populacja</th>
                                <th>Śmierci</th>
                                <th>Współczynnik śmiertelności</th>
                                <th>Przyczyna śmierci</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deaths
                                // .filter((obj) => {
                                //     return obj.year === 2017
                                // })
                                .map((value, key) => {

                                    return (
                                        <tr className='table-row' key={key}>
                                            <td className='table-cell'>{value.year}</td>
                                            <td className='table-cell'>{regions.find((element) => { return element.id === value.RegionId }).name}</td>
                                            <td className='table-cell'>{populations.find((element) => { return element.RegionId === value.RegionId && element.year === value.year }).value}</td>
                                            <td className='table-cell'>{value.value}</td>
                                            <td className='table-cell'>{(value.value / populations.find((element) => { return element.RegionId === value.RegionId && element.year === value.year }).value * 100).toFixed(2)}%</td>
                                            <td className='table-cell'>{deathCauses.find((element) => { return element.id === value.DeathCauseId }).name}</td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table> */}
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
                            {authState.roles.some(e => e.RoleId === 4) && (
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