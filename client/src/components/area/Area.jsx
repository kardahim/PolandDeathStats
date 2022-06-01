import React from 'react'
import { CanvasJSChart, CanvasJS } from 'canvasjs-react-charts'

function Area(props) {

    const options = {
        theme: "light2",
        title: {
            text: `${props.title}`
        },
        axisX: {
            title: "Lata",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Zgony",
            valueFormatString: "0",
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
            }
        },
        data: [{
            type: "area",
            dataPoints: props.dataset
        }]
    }

    return (
        <CanvasJSChart options={options} />
    )
}
export default Area