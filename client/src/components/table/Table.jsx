import React from 'react'
import { DataGrid, plPL } from '@mui/x-data-grid';

function Table(props) {

    return (
        <div style={{ height: props.rows.length * 52 + 150 }}>
            <DataGrid
                rows={props.rows}
                columns={props.columns}
                pageSize={props.pageSize}
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText} />
        </div >
    )
}

export default Table