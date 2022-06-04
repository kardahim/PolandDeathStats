import React from 'react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useEffect, useState, useLayoutEffect } from 'react';
import './homepage.scss'
// import { resolveTo } from 'react-router/lib/router';
// import components
// import Area from '../../components/charts/area/Area'
// import Pie from '../../components/charts/pie/Pie'
import Table from '../../components/table/Table'
import { CircularProgress } from '@mui/material';

// import { useStyles, options } from "./utils";
// import ListItemIcon from "@mui/material/ListItemIcon";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { years, regionNames, deathCauseNames } from './filter_conf'
import { Button } from '@mui/material';
// import { idID } from '@mui/material/locale';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Homepage() {
    // let navigate = useNavigate();
    // const { setAuthState } = useContext(AuthContext);
    const [deathCauses, setDeathCauses] = useState([]);
    const [deaths, setDeaths] = useState([]);
    const [populations, setPopulations] = useState([]);
    const [regions, setRegions] = useState([]);
    const [jsonData, setJsonData] = useState([])    //all data ready for export
    const [filteredData, setFilteredData] = useState([]) // all data combined after filtration
    const { authState } = useContext(AuthContext);
    // const classes = useStyles();

    // const [filteredDeathCauses, setFilteredDeathCauses] = useState([]);
    // const [filteredDeaths, setFilteredDeaths] = useState([]);
    // const [filteredRegions, setFilteredRegions] = useState([]);

    const [year, setYear] = useState([]);
    const [regionName, setRegionName] = useState([]);
    const [deathCauseName, setDeathCauseName] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useLayoutEffect(() => {
        document.title = "Homepage"

        function fetchData() {
            axios.get("http://localhost:3001/deaths").then((response) => {
                setDeaths(response.data)

                setTimeout(function () {
                    setLoading(false);
                    // console.log('deaths[0]',deaths[0])
                }, 1000);
                if (!deaths) {
                    setLoading(true)
                }
                else {
                    setDefaultData()
                }
            })
            axios.get("http://localhost:3001/regions").then((response) => {
                setRegions(response.data)
            })
            axios.get("http://localhost:3001/deathcauses").then((response) => {
                setDeathCauses(response.data)
            })
            axios.get("http://localhost:3001/populations").then((response) => {
                setPopulations(response.data)
            })

        }
        fetchData()

    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    // const isAllYearSelected =
    // years.length > 0 && year.length === years.length;

    var handleYearChange = async function (event) {
        var value = event.target.value;
        setYear(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value);
        setTimeout(function () {
            //do what you need here
        }, 2000);
        // await filterData()
    };

    var handleRegionChange = async function (event) {
        var value = event.target.value;
        setRegionName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value);
        setTimeout(function () {
            //do what you need here
        }, 2000);
        // await filterData()
    };

    var handleDeathCauseNameChange = async function (event) {
        var value = event.target.value;
        setDeathCauseName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value);
        setTimeout(function () {
            //do what you need here
        }, 2000);
        // await filterData()
    };

    // ustawia w 'filteredData' domyślne dane - wszystkie dane dla chorób na 1999 dla POLSKI
    const setDefaultData = async () => {

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
        })

        // removing RegionId attrib
        data = data.map(({ RegionId, ...keepAttrs }) => keepAttrs)

        // filtering by regionName
        data = data.filter(function (obj) {
            return String(obj.region) === "POLSKA"
        })

        // adding DeathCause(name) attrib
        data.forEach(obj => {
            obj.deathCause = deathCauses.filter((obj2) => {
                return obj.DeathCauseId === obj2.id
            })[0].name
        })

        // removing DeathCauseId attrib
        data = data.map(({ DeathCauseId, ...keepAttrs }) => keepAttrs)

        // filtering by deathCauseName
        data = data.filter(function (obj) {
            return String(obj.deathCause) === "razem"
        })

        // renaming 'value' field to 'deaths'
        data = data.map(({ value, ...rest }) => ({ ...rest, deaths: value }));

        // adding 'id' field ... data order not considered
        var id = 1
        data.forEach(obj => {
            obj.id = id
            id += 1
        })

        // console.log(data[0])
        setFilteredData(data)
        // console.log(filteredData)
    }

    // zatwierdza ustawione filtry do połączonych danych zapisanych w 'filteredData'
    const applyFilters = async () => {

        if (year.length < 1 || regionName.length < 1 || deathCauseName < 1) {
            console.log("some filter is empty")
        }
        else {
            // console.log('year', year)
            // console.log('regionName', regionName)
            // console.log('deathCauseName', deathCauseName)
            var data = deaths
            // filtering by years
            data = data.filter(function (obj) {
                return year.includes(String(obj.year))
            })

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
            })

            // removing RegionId attrib
            data = data.map(({ RegionId, ...keepAttrs }) => keepAttrs)

            // filtering by regionName
            data = data.filter(function (obj) {
                return regionName.includes(String(obj.region))
            })

            // adding DeathCause(name) attrib
            data.forEach(obj => {
                obj.deathCause = deathCauses.filter((obj2) => {
                    return obj.DeathCauseId === obj2.id
                })[0].name
            })

            // removing DeathCauseId attrib
            data = data.map(({ DeathCauseId, ...keepAttrs }) => keepAttrs)

            // filtering by deathCauseName
            data = data.filter(function (obj) {
                return deathCauseName.includes(String(obj.deathCause))
            })

            // renaming 'value' field to 'deaths'
            data = data.map(({ value, ...rest }) => ({ ...rest, deaths: value }));

            // adding 'id' field ... data order not considered
            var id = 1
            data.forEach(obj => {
                obj.id = id
                id += 1
            })

            // console.log('data[0]',data[0])
            // console.log('data[1]',data[1])

            // console.log(data[1])

            //sortowanie ???
            // data.sort((a,b) => a.year - b.year)

            await setFilteredData(data)

            // console.log(filteredData)
        }

    }

    // combine all data into customized array of objects
    const combineData = async () => {
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
        })
        // removing RegionId attrib
        data = data.map(({ RegionId, ...keepAttrs }) => keepAttrs)

        // adding DeathCause(name) attrib
        data.forEach(obj => {
            obj.deathCause = deathCauses.filter((obj2) => {
                return obj.DeathCauseId === obj2.id
            })[0].name
        })

        // removing DeathCauseId attrib
        data = data.map(({ DeathCauseId, ...keepAttrs }) => keepAttrs)

        await setJsonData(data)

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
        { field: 'id', headerName: 'ID', width: 60 },
        { field: 'year', headerName: 'Rok', type: 'string', width: 60 },
        { field: 'region', headerName: 'Region', width: 180 },
        { field: 'population', headerName: 'Populacja', type: 'number', width: 90 },
        { field: 'deaths', headerName: 'Śmierci', type: 'number', width: 90 },
        {
            field: 'rate',
            headerName: 'Współczynnik śmiertelności',
            valueGetter: params => (`${(params.row.deaths / params.row.population * 100).toFixed(2)}%`),
            width: 200
        },
        { field: 'deathCause', headerName: 'Przyczyna śmierci', width: 300 },
    ]

    // const rows = [
    //     { id: 1, year: 1999, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
    //     { id: 2, year: 2000, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
    //     { id: 3, year: 2001, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
    //     { id: 4, year: 2002, region: 'Zadupie', population: 100, deaths: 35, causes: 'Syfilis' },
    //     { id: 5, year: 2003, region: 'Zadupie Dolne', population: 120, deaths: 45, causes: 'Syfilis' },
    //     { id: 6, year: 2004, region: 'Zadupie Dolne', population: 120, deaths: 45, causes: 'Syfilis' },
    //     { id: 7, year: 2005, region: 'Zadupie Górne', population: 150, deaths: 15, causes: 'Syfilis' },
    // ];

    if (isLoading) {
        return <div className="home-container">
            <div className='loading'><CircularProgress size={80} /></div>
        </div>;
    }
    return (
        <div className='home-container'>
            <div className='filter-container'>
                <div className='filters'>


                </div>
            </div>
            <div className='main-container'>
                <div className='chart-container'>
                    {/* <Area
                        title='Tytuł'
                        dataset={dataset} /> */}
                </div>
                <div className='data-container'>
                    <Table
                        rows={filteredData}
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
                            {filteredData
                                // .filter((obj) => {
                                //     return obj.year === 2017
                                // })
                                .map((value, key) => {

                                    return (
                                        <tr className='table-row' key={key}>
                                            <td className='table-cell'>{value.year}</td>
                                            <td className='table-cell'>{value.region}</td>
                                            <td className='table-cell'>{value.population}</td>
                                            <td className='table-cell'>{value.value}</td>
                                            <td className='table-cell'>{(value.value / value.population * 100).toFixed(2)}%</td>
                                            <td className='table-cell'>{value.deathCause}</td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table> */}
                </div>
            </div>
            <div className='side-container'>

                <div className='options-container'>
                    <div className=''>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="year-multiple-checkbox-label">Year</InputLabel>
                            <Select
                                labelId="year-multiple-checkbox-label"
                                id="year-multiple-checkbox"
                                multiple
                                value={year}
                                onChange={handleYearChange}
                                input={<OutlinedInput label="Year" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {/* <MenuItem
                                    value="all"
                                    classes={{
                                        root: isAllYearSelected ? classes.selectedAll : ""
                                    }}
                                    >
                                    <ListItemIcon>
                                        <Checkbox
                                        classes={{ indeterminate: classes.indeterminateColor }}
                                        checked={isAllYearSelected}
                                        indeterminate={
                                            year.length > 0 && year.length < years.length
                                        }
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        classes={{ primary: classes.selectAllText }}
                                        primary="Select All"
                                    />
                                </MenuItem> */}
                                {years.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={year.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className=''>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="region-multiple-checkbox-label">Region</InputLabel>
                            <Select
                                labelId="region-multiple-checkbox-label"
                                id="region-multiple-checkbox"
                                multiple
                                value={regionName}
                                onChange={handleRegionChange}
                                input={<OutlinedInput label="Region" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {regionNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={regionName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className=''>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="region-multiple-checkbox-label">DeathCause</InputLabel>
                            <Select
                                labelId="deathcause-multiple-checkbox-label"
                                id="deathcause-multiple-checkbox"
                                multiple
                                value={deathCauseName}
                                onChange={handleDeathCauseNameChange}
                                input={<OutlinedInput label="DeathCause" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {deathCauseNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={deathCauseName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className=''>
                        <Button className='black' onClick={applyFilters}>Apply filters</Button>
                    </div>
                </div>

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