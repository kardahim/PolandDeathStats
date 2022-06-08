import React from 'react'
// import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useState, useLayoutEffect } from 'react';
import './homepage.scss'
// import { resolveTo } from 'react-router/lib/router';
// import components
import Area from '../../components/charts/area/Area'
import Table from '../../components/table/Table'
import { CircularProgress } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Download from '@mui/icons-material/Download';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Drawer, Box, Typography } from '@mui/material'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import Input from '@mui/material/Input';
// axios
import axios from '../../api/axios';

import { Button } from '@mui/material';

import { years, regionNames, deathCauseNames } from './filter_conf'
import json2xml from './functions/json2xml'
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
    const [combinedData, setCombinedData] = useState([])
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

    // drawer
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false)
    const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false)

    // comment to delete
    const send = event => {
        const data = new FormData();
        data.append("file", file);
        console.log(data)

        axios.post("/files/import", data).then((res) => {
            console.log(res)
            setTimeout(() => {
                // alert("Import zakończony.");
                window.location.reload(false);
            }, 4000)
        }).catch(err => {
            // console.log(err)
            alert("Import się nie powiódł!\n\nSprawdź plik!\n\nPrzywracanie danych domyślnych...")
            restoreDefaultData()
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
        document.title = "PolandDeathStats"
        // console.log(Array.from(new Set(populations.map(e => String(e.year)))).sort())
        // console.log(years)
        function fetchData() {
            axios.get("/deaths").then((response) => {
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
                    combineAllData()
                }
            })
            axios.get("/regions").then((response) => {
                setRegions(response.data)
                // setTimeout(()=> {
                //     let newRegions = Array.from(new Set(regions.map(e => e.name))).sort()
                //     setRegionName(newRegions)
                // },2000)
            })
            axios.get("/deathcauses").then((response) => {
                setDeathCauses(response.data)
                // setTimeout(() => {
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
                // }, 100)
            })
            axios.get("/populations").then((response) => {
                setPopulations(response.data)
                setTimeout(() => {
                    setYear(Array.from(new Set(populations.map(e => String(e.year)))).sort())
                }, 100)
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

    const combineAllData = async () => {
        var data = deaths
        // // filtering by years
        // data = data.filter(function (obj) {
        //     return year.includes(String(obj.year))
        // })

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

        // // filtering by regionName
        // data = data.filter(function (obj) {
        //     return regionName.includes(String(obj.region))
        // })

        // adding DeathCause(name) attrib
        data.forEach(obj => {
            obj.deathCause = deathCauses.filter((obj2) => {
                return obj.DeathCauseId === obj2.id
            })[0].name
        })

        // // removing DeathCauseId attrib
        // data = data.map(({ DeathCauseId, ...keepAttrs }) => keepAttrs)

        // // filtering by deathCauseName
        // data = data.filter(function (obj) {
        //     return deathCauseName.includes(String(obj.deathCause))
        // })

        // renaming 'value' field to 'deaths'
        data = data.map(({ value, ...rest }) => ({ ...rest, deaths: value }));

        // adding 'id' field ... data order not considered
        var id = 1
        data.forEach(obj => {
            obj.id = id
            id += 1
        })

        setCombinedData(data)

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
        dataXml = "<root>" + dataXml + "</root>"
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
        axios.post("/files/restore", data).then((res) => {
            // console.log(res)
        }).catch(err => {
            // console.log(err)
        })
        setTimeout(() => {
            // alert("Import zakończony.");
            window.location.reload(false);
        }, 4000)
    }

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

    if (isLoading) {
        return <div className="home-container">
            <div className='loading'><CircularProgress size={80} /></div>
        </div>;
    }
    return (
        <div className='home-container'>
            <Fab className='user-drawer-button' onClick={() => setIsUserDrawerOpen(true)}>
                <AddIcon />
            </Fab>
            {authState.roles.some(e => e.RoleId === 2) && (
                <Fab className='admin-drawer-button' onClick={() => setIsAdminDrawerOpen(true)}>
                    <SettingsIcon />
                </Fab>
            )}
            <Drawer
                anchor='left'
                open={isAdminDrawerOpen}
                onClose={() => setIsAdminDrawerOpen(false)}>
                <Box p={2} minWidth='350px' textAlign='center' role='presentation'>
                    <Typography variant='h6' component='div' fontFamily='Roboto' fontWeight='bold' className='typo'>
                        Zarządzanie bazą danych
                    </Typography>
                    <Stack spacing={2} justifyContent='center' alignItems='center'>
                        <Button className='option-button' variant='contained' onClick={restoreDefaultData}> Przywróć domyślne dane</Button>
                        <Input className='file-input' type="file" id="file" accept=".json, .xml, .csv" onChange={event => {
                            const file = event.target.files[0];
                            setFile(file);
                            setImportJsonButtonState(false)
                        }} />
                        <Button id='import-json-button' className='import-confirm-button' variant='contained' onClick={send} disabled={importJsonButtonState}>Zaimportuj</Button>
                    </Stack>
                </Box>
            </Drawer>
            <Drawer
                anchor='left'
                open={isUserDrawerOpen}
                onClose={() => setIsUserDrawerOpen(false)}>
                <Box p={2} minWidth='350px' textAlign='center' role='presentation'>
                    <Typography variant='h6' component='div' fontFamily='Roboto' fontWeight='bold' className='typo'>
                        Wypełnianie tabeli
                    </Typography>
                    <Stack spacing={2} justifyContent='center' alignItems='center'>
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
                                MenuProps={MenuProps}>
                                {Array.from(new Set(populations.map(e => String(e.year)))).sort().map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={year.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <span className='single-filter-button' onClick={changeSelectedYearFilters}>» zaznacz/odznacz wszystkie</span>
                        </FormControl>
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
                            <span className='single-filter-button' onClick={changeSelectedRegionFilters}>» zaznacz/odznacz wszystkie</span>
                        </FormControl>
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
                            <span className='single-filter-button' onClick={changeSelectedDeathCauseFilters}>» zaznacz/odznacz wszystkie</span>
                        </FormControl>
                        <Button className='import-confirm-button' variant='contained' onClick={applyFilters}>Zastosuj filtry</Button>
                    </Stack>
                </Box>
            </Drawer>
            <div className='main-container'>
                {authState.roles.some(e => e.RoleId === 1) && (
                    <div className='admin-container'>
                    </div>
                )}
                <div className='chart-container'>
                    <Area
                        // dataset={filteredData}
                        dataset={combinedData}  //upgrade; teraz nie trzeba klikać "zastosuj filtry" żeby filterki nad wykresem dobrze dziłąły ;p 
                        // regions={regionName}
                        regions={Array.from(new Set(regions.map(e => e.name)))} // upgrade
                        // causes={deathCauseName}
                        causes={Array.from(new Set(deathCauses.map(e => String(e.name))))} //upgrade
                        years={year} />
                </div>
                <div className='divider'></div>
                <div className='data-container'>
                    {authState.roles.some(e => e.RoleId === 1) && (
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={exportToCSV} >Pobierz CSV</Button>
                            <Button variant="contained" onClick={exportToJSON}>Pobierz JSON</Button>
                            <Button variant="contained" onClick={exportToXML}>Pobierz XML</Button>
                        </Stack>
                    )}
                    <Table
                        rows={filteredData}
                        columns={columns}
                        pageSize={20} />
                </div>
            </div>
        </div >
    )
}

export default Homepage