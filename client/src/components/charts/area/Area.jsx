import { React, useState } from 'react'
import {
    YAxis,
    XAxis,
    HorizontalGridLines,
    VerticalGridLines,
    AreaSeries,
    Crosshair,
    FlexibleWidthXYPlot,
} from "react-vis";

import "react-vis/dist/style.css";

function Area(props) {

    const [crosshair, setCrosshair] = useState({
        crosshairValues: []
    })
    const _onMouseLeave = () => {
        setCrosshair({ crosshairValues: [] })
    }

    const _onNearestX = ({ x, y }, e) => {
        setCrosshair({ crosshairValues: [props.dataset[e.index]] })
    };

    return (

        // <CanvasJSChart options={options} />
        <div>
            <h1 style={{ textAlign: 'center' }}>{props.title}</h1>
            <FlexibleWidthXYPlot
                onMouseLeave={_onMouseLeave}
                height={400}
                xType='time'>
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
                    data={props.dataset}
                    color="black"
                    opacity={0.5}
                    curve="curveMonotoneX"
                />
                <Crosshair values={crosshair.crosshairValues} />
            </FlexibleWidthXYPlot>
        </div>
    )
}
export default Area