import React, { useContext, useEffect, useState } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import { Tooltip } from '@material-ui/core';
import {Row, Col, Table} from "reactstrap";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { isEmpty } from "../../utils/common";

const CallbackTable = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        props.callbacks?.map((callback, index) => {
            if(isEmpty(callback.token) === false){
                setShowToken(true);
            }
            return null;
        });
    }, [props.callbacks]);

    return (
        <Row>
            <Col md="12">
                <div style={{ background: _mode === "dark" ? "#2C3139" : "#0861AF", padding: "10px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"  }}>
                    <Translate content="dashboard.function.inputs.callbacks.title" />
                    <Tooltip title={context.counterpart('common.button.add')}>
                        <div onClick={() => props.addNewCallback()}>
                            <AddIcon className="whiteIcon" />
                        </div>
                    </Tooltip>
                </div>
                <Table dark={_mode === "dark" ? true : false} bordered hover>
                    <thead className='text-center'>
                        <tr>
                            <th>#</th>
                            <th><Translate content="dashboard.function.inputs.callbacks.callbackEndpoint"/></th>
                            { showToken && <th><Translate content="dashboard.function.inputs.callbacks.callbackToken"/></th>}
                            <th><Translate content="dashboard.function.inputs.callbacks.callbackType"/></th>
                            { props.callbacks?.length > 0 && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {
                            props.callbacks?.length === 0
                            ? <tr>
                                <td colSpan="4">
                                    <Translate content="dashboard.function.inputs.callbacks.noCallbacks" />
                                </td>
                            </tr>
                            : props.callbacks?.map((callback, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{callback.endpoint}</td>
                                    {showToken && <td>****</td>}
                                    <td>{callback.type.toUpperCase()}</td>
                                    { props.callbacks?.length > 0 && 
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                                <div onClick={() => props.editCallback(index)} style={{ marginRight: '5px' }}>
                                                    <EditIcon className="whiteIcon" />
                                                </div>
                                                <div onClick={() => props.deleteCallback(index)}>
                                                    <DeleteIcon className="whiteIcon" />
                                                </div>
                                            </div>
                                        </td>                                                                                               
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default CallbackTable;
