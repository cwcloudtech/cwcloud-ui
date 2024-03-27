import React, { useContext } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import { Tooltip } from '@material-ui/core';
import {Row, Col, Table} from "reactstrap";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TriggersTable = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;

    return (
        <Row>
            <Col md="12">
                <div style={{ background: _mode === "dark" ? "#2C3139" : "#0861AF", padding: "10px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"  }}>
                    <Translate content="dashboard.iot.inputs.triggers.title" />
                    <Tooltip title={context.counterpart('common.button.add')}>
                        <div onClick={() => props.addNewTrigger()}>
                            <AddIcon className="whiteIcon" />
                        </div>
                    </Tooltip>
                </div>
                <Table dark={_mode === "dark" ? true : false} bordered hover >
                    <thead className='text-center'>
                        <tr>
                            <th>#</th>
                            <th><Translate content="dashboard.iot.inputs.triggers.triggerId.name"/></th>
                            { props.triggers?.length > 0 && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {
                            props.triggers?.length === 0
                            ? <tr>
                                <td colSpan="3">
                                    <Translate content="dashboard.iot.inputs.triggers.noTriggers" />
                                </td>
                            </tr>
                            : props.triggers?.map((trigger, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{trigger}</td>
                                    { props.triggers?.length > 0 && 
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                                <div onClick={() => props.editTrigger(index)} style={{ marginRight: '5px' }}>
                                                    <EditIcon className="whiteIcon" />
                                                </div>
                                                <div onClick={() => props.deleteTrigger(index)}>
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

export default TriggersTable;
