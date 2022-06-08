import { React, useState } from 'react'
import { DataGrid, plPL } from '@mui/x-data-grid';

function Table(props) {

    const [pageSize, setPageSize] = useState(props.pageSize)

    return (
        <div>
            <DataGrid
                autoHeight
                autoWidth
                disableSelectionOnClick
                // disableColumnMenu
                rows={props.rows}
                columns={props.columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText} />
        </div >
    )
}

export default Table