import { React, useState, useEffect } from 'react'
import {
    YAxis,
    XAxis,
    HorizontalGridLines,
    VerticalGridLines,
    AreaSeries,
    LineSeries,
    Crosshair,
    FlexibleWidthXYPlot,
} from "react-vis";
import "react-vis/dist/style.css";
// mui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function Area(props) {

    const [crosshair, setCrosshair] = useState({
        crosshairValues: []
    })
    const _onMouseLeave = () => {
        setCrosshair({ crosshairValues: [] })
    }

    const _onNearestX = ({ x, y }, e) => {
        setCrosshair({ crosshairValues: [data1[e.index]] })
    };

    const handleChangeRegion = (event) => {
        setCurrentRegion(event.target.value)
    };

    const handleChangeCause = (event) => {
        setCurrentCause(event.target.value)
    };

    const [currentCause, setCurrentCause] = useState('razem')
    const [currentRegion, setCurrentRegion] = useState('POLSKA')

    const [data1, setData1] = useState([])
    // const [data2, setData2] = useState([])
    useEffect(() => {
        setTimeout(() => {
            let data1 = []
            // let data2 = []
            props.dataset.map((v, k) => {
                if (v.region === currentRegion && v.deathCause == currentCause && props.years.includes(`${v.year}`)) {
                    data1.push({ x: (`${v.year}`), y: v.deaths })
                    // data2.push({ x: (`${v.year}`), y: v.population })
                }
            })
            data1.sort((a, b) => {
                return a.x - b.x;
            });
            // console.log(props.years)
            // console.log(data2)
            // console.log(`array length: ${data.length}}`)
            // console.log(props.dataset)
            if (data1.length > 0) {
                // console.log("R")`
                setData1(data1)
                // setData2(data2)
            }
            // console.log('crash?')
        }, 300)
    })

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Region</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currentRegion}
                        label="Region"
                        onChange={handleChangeRegion}>
                        {props.regions.map((v, k) => {
                            return (<MenuItem value={v} key={k}>{v}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Przyczyna</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currentCause}
                        label="Przyczyna"
                        onChange={handleChangeCause}>
                        {props.causes.map((v, k) => {
                            return (<MenuItem value={v}>{v}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </div>
            <FlexibleWidthXYPlot
                onMouseLeave={_onMouseLeave}
                height={400}
                xType='ordinal'>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis
                    title="Lata"
                    position="middle"
                    style={{
                        line: { stroke: 'black' },
                        ticks: { stroke: 'black' },
                        text: { stroke: 'none', fill: '#6b6b76', fontWeight: 'bold' },
                        title: { stroke: 'none', fill: '#6b6b76', fontWeight: 'bold', fontSize: 20 },

                    }} />
                <YAxis title="Zgony" style={{
                    line: { stroke: 'black' },
                    ticks: { stroke: 'black' },
                    text: { stroke: 'none', fill: '#6b6b76', fontWeight: 'bold' },
                    title: { stroke: 'none', fill: '#6b6b76', fontWeight: 'bold', fontSize: 20 },
                }} />
                <AreaSeries
                    onNearestX={_onNearestX}
                    data={data1}
                    color="black"
                    opacity={0.5}
                    curve="curveMonotoneX"
                />
                <LineSeries
                    onNearestX={_onNearestX}
                    data={data1}
                    color="black"
                    opacity={0.3}
                    curve="curveMonotoneX"
                />
                <Crosshair values={crosshair.crosshairValues} />
            </FlexibleWidthXYPlot>
        </div >
    )
}
export default Area