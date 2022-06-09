import React from 'react'
import { AuthContext } from '../../helpers/AuthContext'
import { useContext, useState, useLayoutEffect } from 'react';
// axios
import axios from '../../api/axios';
import { years } from './filter_conf'
import json2xml from './functions/json2xml'
import json2csv from './functions/json2csv'
// stylesheets
import './homepage.scss'
// components etc.
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
import Stack from '@mui/material/Stack';
import { Drawer, Box, Typography } from '@mui/material'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';

// Select menu properties
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

    const [importJsonButtonState, setImportJsonButtonState] = useState(true)

    const [file, setFile] = useState();

    // drawer
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false)
    const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false)

    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState("success")
    const showAlert = () => {
        setOpen(true);
    };

    const closeAlert = function (event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const send = event => {
        const data = new FormData();
        data.append("file", file);

        axios.post("/files/import", data, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((res) => {
            setAlertType("success")
            setAlertMessage("Import zakończony pomyślnie.")
            showAlert()

            setTimeout(() => {
                window.location.reload(false);
            }, 5000)
        }).catch(err => {
            setAlertType("error")
            setAlertMessage(err.response.data.message)
            showAlert()
        })
    }

    useLayoutEffect(() => {
        document.title = "PolandDeathStats"
        function fetchData() {
            axios.get("/deaths").then((response) => {
                setDeaths(response.data)

                setTimeout(function () {
                    setLoading(false);
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
            })
            axios.get("/deathcauses").then((response) => {
                setDeathCauses(response.data)
            })
            axios.get("/populations").then((response) => {
                setPopulations(response.data)
                setTimeout(() => {
                    setYear(Array.from(new Set(populations.map(e => String(e.year)))).sort())
                }, 100)
            })

        }
        fetchData()

    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    var handleYearChange = async function (event) {
        var value = event.target.value;
        setYear(typeof value === 'string' ? value.split(',') : value);
    };

    var handleRegionChange = async function (event) {
        var value = event.target.value;
        setRegionName(typeof value === 'string' ? value.split(',') : value);
    };

    var handleDeathCauseNameChange = async function (event) {
        var value = event.target.value;
        setDeathCauseName(typeof value === 'string' ? value.split(',') : value);
    };

    // set 'filteredData' <- default data
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
        setFilteredData(data)
    }

    const combineAllData = async () => {
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

        // renaming 'value' field to 'deaths'
        data = data.map(({ value, ...rest }) => ({ ...rest, deaths: value }));

        // adding 'id' field (data order not being considered)
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

            setFilteredData(data)
        }
    }

    const changeSelectedYearFilters = () => {
        if (year.length < Array.from(new Set(populations.map(e => String(e.year)))).length) {
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

        if (dataXml.length > 0) {
            const xmlString = `data:text/xml;chatset=utf-8,${encodeURIComponent(
                dataXml
            )}`;
            const link = document.createElement("a");
            link.href = xmlString;
            link.download = "data.xml";

            link.click();
        }
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
        axios.post("/files/restore", data, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((res) => {
            //  console.log(res)
            setAlertType("success")
            setAlertMessage("Rozpoczęto przywracanie danych domyślnych.")
            showAlert()

        }).catch(err => {
            setAlertType("error")
            setAlertMessage("Operacja się nie powiodła.")
            showAlert()
        })

        setTimeout(() => {
            window.location.reload(false);
        }, 7000)
    }

    // table's column props
    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        { field: 'year', headerName: 'Rok', type: 'string', width: 60 },
        { field: 'region', headerName: 'Region', width: 200 },
        { field: 'population', headerName: 'Populacja', type: 'number' },
        { field: 'deaths', headerName: 'Śmierci', type: 'number', width: 100 },
        {
            field: 'rate',
            headerName: 'Współczynnik śmiertelności',
            valueGetter: params => (`${(params.row.deaths / params.row.population * 100).toFixed(2)}%`),
            width: 200
        },
        { field: 'deathCause', headerName: 'Przyczyna śmierci', width: 1000 },
    ]

    if (isLoading) {
        return <div className="home-container">
            <div className='loading'><CircularProgress size={80} /></div>
        </div>;
    }
    return (
        <div className='home-container'>
            <Snackbar open={open} autoHideDuration={6000} onClose={closeAlert}>
                <Alert onClose={closeAlert} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Fab className='user-drawer-button' color='primary' onClick={() => setIsUserDrawerOpen(true)}>
                <AddIcon />
            </Fab>
            {authState.roles.some(e => e.RoleId === 2) && (
                <Fab className='admin-drawer-button' color='primary' onClick={() => setIsAdminDrawerOpen(true)}>
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
                        Filtrowanie tabeli
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
                                    <MenuItem key={name} value={name} title={name}>
                                        <Checkbox checked={deathCauseName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <span className='single-filter-button' onClick={changeSelectedDeathCauseFilters}>» zaznacz/odznacz wszystkie</span>
                        </FormControl>
                        <Button variant='contained' onClick={applyFilters}>Zastosuj filtry</Button>
                        {authState.roles.some(e => e.RoleId === 1) && (

                            <div>
                                <div className='divider'></div>
                                <Typography variant='h6' component='div' fontFamily='Roboto' fontWeight='bold' className='typo'>
                                    Pobieranie przefiltrowanych danych
                                </Typography>
                                <Button className='export-button' variant="contained" onClick={exportToCSV} >Pobierz CSV</Button>
                                <Button className='export-button' variant="contained" onClick={exportToJSON}>Pobierz JSON</Button>
                                <Button className='export-button' variant="contained" onClick={exportToXML}>Pobierz XML</Button>
                            </div>
                        )}
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
                        dataset={combinedData}
                        // regions={regionName}
                        regions={Array.from(new Set(regions.map(e => e.name)))} // upgrade
                        // causes={deathCauseName}
                        causes={Array.from(new Set(deathCauses.map(e => String(e.name))))} //upgrade
                        years={year} />
                </div>
                <div className='divider'></div>
                <div className='data-container'>
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