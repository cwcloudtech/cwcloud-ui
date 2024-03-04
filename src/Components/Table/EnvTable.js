import React, { useContext, useState } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import { Tooltip } from '@material-ui/core';
import {Row, Col, Table} from "reactstrap";
import AddIcon from '@mui/icons-material/Add';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EnvTable = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [envVarCopied, setEnvVarCopied] = useState(false)
    const [selectedVariableIndex, setSelecteVariableIndex] = useState(0)

    const handleCopyEnvVariable = (index) => {
        var selectedVariable = props.envVars[index]
        setSelecteVariableIndex(index)
        navigator.clipboard.writeText(`${selectedVariable.name}=${selectedVariable.value}`)
        setEnvVarCopied(true)
        setTimeout(() => {
            setEnvVarCopied(false)
        } , 1000)
    }

    return (
        <Row>
            <Col md="12">
                <div style={{ background: _mode === "dark" ? "#2C3139" : "#0861AF", padding: "10px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"  }}>
                    <Translate content="dashboard.function.inputs.env_vars.title" />
                    <Tooltip title={context.counterpart('common.button.add')}>
                        <div onClick={() => props.addNewEnvVar()}>
                            <AddIcon className="whiteIcon" />
                        </div>
                    </Tooltip>
                </div>
                <Table dark={_mode === "dark" ? true : false} bordered hover >
                    <thead className='text-center'>
                        <tr>
                            <th>#</th>
                            <th><Translate content="common.word.key"/></th>
                            <th><Translate content="common.word.value"/></th>
                            { props.envVars?.length > 0 && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {
                            props.envVars?.length === 0
                            ? <tr>
                                <td colSpan="3">
                                    <Translate content="dashboard.function.inputs.env_vars.noEnvVars" />
                                </td>
                            </tr>
                            : props.envVars?.map((variable, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{variable.name}</td>
                                    <td>****</td>
                                    { props.envVars?.length > 0 && 
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                                <div onClick={() => handleCopyEnvVariable(index)} style={{ marginRight: '5px' }}>
                                                    {
                                                        envVarCopied && selectedVariableIndex === index 
                                                        ? <CheckIcon className="whiteIcon" />
                                                        : <ContentPasteIcon className="whiteIcon" />
                                                    }
                                                </div>
                                                <div onClick={() => props.editEnvVar(index)} style={{ marginRight: '5px' }}>
                                                    <EditIcon className="whiteIcon" />
                                                </div>
                                                <div onClick={() => props.deleteEnvVar(index)}>
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

export default EnvTable;
