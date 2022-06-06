import React from 'react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useState, useLayoutEffect} from 'react';
import './homepage.scss'
// import { resolveTo } from 'react-router/lib/router';
// import components
import Area from '../../components/charts/area/Area'
import Table from '../../components/table/Table'
import { CircularProgress } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import { Button } from '@mui/material';

import { years, regionNames, deathCauseNames } from './filter_conf'
import json2xml from './functions/json2xml'
import xml2json from './functions/xml2json'
import json2csv from './functions/json2csv'
import { useFilePicker } from "use-file-picker";

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

    const [year, setYear] = useState(years);
    const [regionName, setRegionName] = useState(['POLSKA']);
    const [deathCauseName, setDeathCauseName] = useState(['razem']);
    const [isLoading, setLoading] = useState(true);

    const [uploadedJsonFile, setUploadedJsonFile] = useState([])
    const [importJsonButtonState, setImportJsonButtonState] = useState(true)
    const [uploadedXmlFile, setUploadedXmlFile] = useState([])
    const [importXmlButtonState, setImportXmlButtonState] = useState(true)
    const [uploadedCsvFile, setUploadedCsvFile] = useState([])
    const [importCsvButtonState, setImportCsvButtonState] = useState(true)

    const [file, setFile] = useState();
    
    const send = event => {
        const data = new FormData();
        data.append("file",file);
        console.log(data)

        axios.post("http://localhost:3001/files/import", data).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: ".json, .xml, .csv"
    });
    // const [openXmlFileSelector, { xmlFilesContent, xmlLoading }] = useFilePicker({
    //     accept: ".xml"
    // });
    // const [openCsvFileSelector, { csvFilesContent, csvLoading }] = useFilePicker({
    //     accept: ".xml"
    // });

    useLayoutEffect(() => {
        document.title = "Homepage"
        // console.log(Array.from(new Set(populations.map(e => String(e.year)))).sort())
        // console.log(years)
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
                // setTimeout(()=> {
                //     setRegionName(Array.from(new Set(regions.map(e => e.name))).sort()[0])
                // },1000)
            })
            axios.get("http://localhost:3001/deathcauses").then((response) => {
                setDeathCauses(response.data)
                setTimeout(()=> {
                    // let cont=true
                    // setTimeout(()=> {
                    //     let cause = Array.from(new Set(deathCauses.map(e => String(e.name))))
                    //     if(String(cause[0])){
                    //         setDeathCauseName(String(cause[0]))
                    //     }
                    // console.log("dcN,",deathCauseName)
                    // console.log("cause", String(cause[0]))
                    // },100)
                        // deathCauseNames.forEach(el => {
                        //     if (el && cont && Array.from(new Set(deathCauses.map(e => String(e.name)))).sort().includes(el)){
                        //         console.log(el)
                        //         setDeathCauseName()
                        //         cont=false
                        //     }
                        // })
                    
                    // setDeathCauseName(Array.from(new Set(deathCauses.map(e => String(e.name)))).sort())
                },100)
            })
            axios.get("http://localhost:3001/populations").then((response) => {
                setPopulations(response.data)
                setTimeout(()=> {
                    setYear(Array.from(new Set(populations.map(e => String(e.year)))).sort())
                },100)
            })
            

        }
        fetchData()
        // var y = Array.from(new Set(populations.map(e => e.year)))
        // // console.log(y)
        // setYear(y)
        // setRegions(regions)
        // setRegionName(regions[0])

    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const changeSelectedYearFilters = () => {
        if (year.length < years.length) {
            setYear(Array.from(new Set(populations.map(e => String(e.year)))).sort())
        }
        else {
            setYear([])
        }
    }

    const changeSelectedRegionFilters = () => {
        if (regionName.length < regions.length) {
            setRegionName(Array.from(new Set(regions.map(e => e.name))).sort())
        }
        else {
            setRegionName([])
        }
    }

    const changeSelectedDeathCauseFilters = () => {
        if (deathCauseName.length < deathCauses.length) {
            setDeathCauseName(Array.from(new Set(deathCauses.map(e => String(e.name)))))
        }
        else {
            setDeathCauseName([])
        }
    }

    const exportToJSON = () => {
        var data = filteredData

        //removing id attrib
        data = data.map(({ id, ...keepAttrs }) => keepAttrs)
        setJsonData(data)

        if (jsonData.length > 0) {
            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                JSON.stringify(data, null, ' ')
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "data.json";

            link.click();
        }
    }

    const exportToXML = () => {
        var data = filteredData
        //removing id attrib
        data = data.map(({ id, ...keepAttrs }) => keepAttrs)
        setJsonData(data)

        var dataXml = json2xml(jsonData)
        dataXml = "<root>"+dataXml+"</root>"
        // console.log(dataXml)

        if (dataXml.length > 0) {
            const xmlString = `data:text/xml;chatset=utf-8,${encodeURIComponent(
                dataXml
            )}`;
            const link = document.createElement("a");
            link.href = xmlString;
            link.download = "data.xml";

            link.click();
        }
        // let parser = new DOMParser()
        // var parsed = parser.parseFromString(dataXml,"text/xml")
        // var reverse = xml2json(parsed," ")
        // var reverse = xml2json(String(parsed))
        // console.log(reverse)

    }

    const exportToCSV = () => {
        var data = filteredData
        //removing id attrib
        data = data.map(({ id, ...keepAttrs }) => keepAttrs)
        setJsonData(data)

        var dataCsv = json2csv(jsonData)
        dataCsv = "year,population,region,deathCause,deaths\n" + dataCsv

        if (dataCsv.length > 0) {
            const csvString = `data:text/csv;chatset=utf-8,${encodeURIComponent(
                dataCsv
            )}`;
            const link = document.createElement("a");
            link.href = csvString;
            link.download = "data.csv";

            link.click();
        }
    }

    const restoreDefaultData = () => {
        let data = ""
        axios.post("http://localhost:3001/files/restore", data).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
    
    // const importFromJSON = () => {
    //     openFileSelector()

    //     updateButtons('.json')

    // }

    // const importUploadedJSON = () => {
    //     if (filesContent[0]) {
    //         setUploadedJsonFile(filesContent[0].content)
    //         setTimeout(function() {
    //             console.log("uploadedJsonFile", uploadedJsonFile)
    //         },2000)

    //         console.log("button clicked - ok")
    //         // actual import to DB
    //         // ...
    //     }
    //     else {
    //         console.log("button clicked - not ok")
    //     }
    // }

    // const importFromXML = () => {
    //     openFileSelector()

    //     updateButtons('.xml')
    // }

    // const importUploadedXML = () => {
    //     if (filesContent[0]) {
    //         setUploadedXmlFile(filesContent[0].content)
    //         setTimeout(function() {
    //             console.log("uploadedXmlFile", uploadedXmlFile)
    //         },2000)

            
    //         console.log("button clicked - ok")
    //         // actual import to DB
    //         // ...
    //     }
    //     else {
    //         console.log("button clicked - not ok")
    //     }
    // }

    // const updateButtons = function(ext) {
    //     setTimeout(function () {
    //         switch(ext)
    //         {
    //             case '.json':
    //                 setImportJsonButtonState(false)
    //                 setImportXmlButtonState(true)
    //                 setImportCsvButtonState(true)
    //             break;
    //             case '.xml':
    //                 setImportJsonButtonState(true)
    //                 setImportXmlButtonState(false)
    //                 setImportCsvButtonState(true)
    //             break;
    //             case '.csv':
    //                 setImportJsonButtonState(true)
    //                 setImportXmlButtonState(true)
    //                 setImportCsvButtonState(false)
    //             break;
    //             default:
    //                 setImportJsonButtonState(true)
    //                 setImportXmlButtonState(true)
    //                 setImportCsvButtonState(true)
    //             break;
    //         }
            // if(filesContent[0].name.includes('.json'))
            // {
            //     setImportJsonButtonState(false)
            //     setImportXmlButtonState(true)
            //     setImportCsvButtonState(true)
            // }
            // else if(filesContent[0].name.includes('.xml'))
            // {
            //     setImportJsonButtonState(true)
            //     setImportXmlButtonState(false)
            //     setImportCsvButtonState(true)
            // }
            // else if(filesContent[0].name.includes('.csv'))
            // {
            //     setImportJsonButtonState(true)
            //     setImportXmlButtonState(true)
            //     setImportCsvButtonState(false)
            // }
    //     }, 7000)
    // }

    // const importFromCSV = () => {
    //     openFileSelector()

    //     updateButtons('.csv')
    // }

    // const importUploadedCSV = () => {
    //     if (filesContent[0]) {
    //         setUploadedCsvFile(filesContent[0].content)
    //         setTimeout(function() {
    //             console.log("uploadedCsvFile", uploadedCsvFile)
    //         },2000)

    //         console.log("button clicked - ok")
    //         // actual import to DB
    //         // ...
    //     }
    //     else {
    //         console.log("button clicked - not ok")
    //     }
    // }

    // example area chart's dataset
    // const dataset = [
    //     { x: new Date("2000"), y: 1000 },
    //     { x: new Date("2001"), y: 1367 },
    //     { x: new Date("2002"), y: 973 },
    //     { x: new Date("2003"), y: 973 },
    //     { x: new Date("2004"), y: 953 },
    //     { x: new Date("2005"), y: 4173 },
    //     { x: new Date("2006"), y: 973 },
    //     { x: new Date("2007"), y: 332 },
    //     { x: new Date("2008"), y: 973 },
    //     { x: new Date("2009"), y: 7273 },
    //     { x: new Date("2010"), y: 973 },
    //     { x: new Date("2011"), y: 2373 },
    //     { x: new Date("2012"), y: 913 },
    //     { x: new Date("2013"), y: 1273 },
    //     { x: new Date("2014"), y: 176 },
    // ]

    // example table's dataset
    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        { field: 'year', headerName: 'Rok', type: 'string', width: 60 },
        { field: 'region', headerName: 'Region', width: 180 },
        { field: 'population', headerName: 'Populacja', type: 'number', width: 90 },
        { field: 'deaths', headerName: 'Śmierci', type: 'number', width: 200 },
        {
            field: 'rate',
            headerName: 'Współczynnik śmiertelności',
            valueGetter: params => (`${(params.row.deaths / params.row.population * 100).toFixed(2)}%`),
            width: 200
        },
        { field: 'deathCause', headerName: 'Przyczyna śmierci', width: 450 },
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
                    <Area
                        dataset={filteredData}
                        regions={regionName}
                        causes={deathCauseName}
                        years={year} />
                </div>
                <div className='data-container'>
                    <Table
                        rows={filteredData}
                        columns={columns}
                        pageSize={20} />
                </div>
            </div>
            <div className='side-container'>

                <div className='options-container'>
                    <div className='filter first-filter'>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="year-multiple-checkbox-label">Rok</InputLabel>
                            <Select
                                labelId="year-multiple-checkbox-label"
                                id="year-multiple-checkbox"
                                multiple
                                value={year}
                                onChange={handleYearChange}
                                input={<OutlinedInput label="Rok" />}
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
                                {Array.from(new Set(populations.map(e => String(e.year)))).sort().map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={year.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <div className=''>
                                <button className='single-filter-button' onClick={changeSelectedYearFilters}>» zaznacz/odznacz wszystkie</button>
                            </div>
                        </FormControl>
                    </div>
                    <div className='filter'>
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
                                {Array.from(new Set(regions.map(e => e.name))).map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={regionName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <div className=''>
                                <button className='single-filter-button' onClick={changeSelectedRegionFilters}>» zaznacz/odznacz wszystkie</button>
                            </div>
                        </FormControl>
                    </div>
                    <div className='filter'>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="region-multiple-checkbox-label">Przyczyna zgonów</InputLabel>
                            <Select
                                labelId="deathcause-multiple-checkbox-label"
                                id="deathcause-multiple-checkbox"
                                multiple
                                value={deathCauseName}
                                onChange={handleDeathCauseNameChange}
                                input={<OutlinedInput label="Przyczyna zgonów" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {Array.from(new Set(deathCauses.map(e => String(e.name)))).map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={deathCauseName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <div className=''>
                                <button className='single-filter-button' onClick={changeSelectedDeathCauseFilters}>» zaznacz/odznacz wszystkie</button>
                            </div>
                        </FormControl>
                    </div>
                    <div className='option'>
                        <button className='import-confirm-button' onClick={applyFilters}>Zastosuj filtry</button>
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
                            {authState.roles.some(e => e.RoleId === 1) && (
                                <>
                                    <div className='option-group'>
                                        <p className='option-group-header'>Opcje użytkownika</p>
                                        <div className='option'>
                                            <button className='option-button' onClick={exportToJSON}> Eksport do .json</button>
                                        </div>
                                        <div className='option'>
                                            <button className='option-button' onClick={exportToXML}> Eksport do .xml</button>
                                        </div>
                                        <div className='option'>
                                            <button className='option-button' onClick={exportToCSV}> Eksport do .csv</button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {authState.roles.some(e => e.RoleId === 2) && (
                                <>
                                    <div className='option-group'>
                                        <p className='option-group-header'>Opcje administratora</p>
                                        <div className='option'>
                                            <p className='option-label'>♦ Przywróć domyślne dane</p>
                                            <button className='option-button' onClick={restoreDefaultData}> Przywróć domyślne dane</button>
                                        </div>
                                        {/* <div className='option'>
                                            <p>Import z pliku .json / .xml / .csv</p>
                                            <button className='option-button' onClick={importFromJSON}> Wybierz plik</button>
                                            <button id='import-json-button' className='import-confirm-button' onClick={importUploadedJSON} disabled={importJsonButtonState}>Zaimportuj</button>
                                        </div> */}
                                        <div className='option'>
                                        <p className='option-label'>♦ Import z pliku .json / .xml / .csv</p>
                                            <input className='file-input' type="file" id="file" accept=".json, .xml, .csv" onChange={event => {
                                                const file=event.target.files[0]; 
                                                setFile(file);
                                                setImportJsonButtonState(false)
                                            }} />
                                            <button id='import-json-button' className='import-confirm-button' onClick={send} disabled={importJsonButtonState}>Zaimportuj</button>
                                        </div>
                                        {/* <div className='option'>
                                            <p>Import z pliku .xml</p>
                                            <button className='option-button' onClick={importFromXML}> Wybierz plik</button>
                                            <button id='import-xml-button' className='import-confirm-button' onClick={importUploadedXML} disabled={importXmlButtonState}>Zaimportuj</button>
                                        </div> */}
                                        {/* <div className='option'>
                                            <p>Import z pliku .csv</p>
                                            <button className='option-button' onClick={importFromCSV}> Wybierz plik</button>
                                            <button id='import-csv-button' className='import-confirm-button' onClick={importUploadedCSV} disabled={importCsvButtonState}>Zaimportuj</button>
                                        </div> */}
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