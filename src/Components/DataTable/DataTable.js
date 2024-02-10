import React, { useContext, useState }  from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import classes from './DataTable.module.css';
import CustomDeleteIcon from '../CustomDeleteIcon/CustomDeleteIcon'
import { Stack } from '@mui/material';
import LoadingButton from '../LoadingButton/LoadingButton';
import GlobalContext from '../../Context/GlobalContext';
import colors from "../../Context/Colors";
import { useNavigate } from 'react-router-dom';

const DataTable = (props) => {
    const { counterpart } = useContext(GlobalContext);
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [selectedItems, setSelectedItems] = useState([])
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate()
    return (
        <div style={{ height: 400, width: '100%', backgroundColor: colors.secondBackground[_mode], borderRadius: "5px", marginTop: "5px"}}>
            <DataGrid style={{color: colors.secondText[_mode], borderColor: colors.gridBorder[_mode]}}
                components={{
                    NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                            {props.icon && <i className={props.icon} style={{ fontSize: "45px", color: colors.blue[_mode] }}></i>}
                            <h5 style={{ textAlign: 'center', fontSize: '14px', marginTop: '10px', color: colors.mainText[_mode] }}>{
                                props.emptyMessage || counterpart('common.table.emptyRowsMessage')
                            }</h5>
                            {(!props.noCreate && props.createMessage) && <div style={{ zIndex: '999', marginTop: '10px'}}>
                                <LoadingButton
                                    onClick={() => navigate(props.createUrl)}
                                    style={{ fontSize: '13px', textTransform: 'none', whiteSpace: 'nowrap', width: 'auto'}}>
                                    {props.createMessage}
                                </LoadingButton>
                            </div>}
                        </Stack>
                    )
                }}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                GridLinesVisibility='None'
                onSelectionModelChange={(e) => { setSelectedItems(e) }}
                rows={props.rows}
                selectionModel={selectedItems}
                columns={props.columns}
                disableColumnSelector
                disableSelectionOnClick
                checkboxSelection={props.checkboxSelection}
            />
            {selectedItems.length > 0 && < div className={classes.selectionDeleteContainer}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckBox color='primary' onClick={() => setSelectedItems([])} />
                    <h5 className={classes.selectionText}>
                        {`${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected`}
                    </h5>
                </div>
                <div>
                    <CustomDeleteIcon onClick={() => props.onDeleteSelection(selectedItems)} />
                </div>
            </div >
            }
        </div>
    );
}

export default DataTable