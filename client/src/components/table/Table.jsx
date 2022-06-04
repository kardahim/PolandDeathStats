import React from 'react'
import { DataGrid, plPL } from '@mui/x-data-grid';

function Table(props) {

    return (
        <div>
            <DataGrid
                autoHeight
                disableSelectionOnClick
                disableColumnMenu
                rows={props.rows}
                columns={props.columns}
                pageSize={props.pageSize}
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText} />
        </div >
    )
}

export default Table