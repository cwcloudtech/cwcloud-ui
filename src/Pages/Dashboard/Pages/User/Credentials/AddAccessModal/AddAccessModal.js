import { useContext, useState, useEffect, Fragment } from "react";
import { MenuItem, Select } from "@mui/material";
import Translate from "react-translate-component";
import colors from "../../../../../../Context/Colors";
import GlobalContext from "../../../../../../Context/GlobalContext";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Input,
} from "reactstrap";
import LoadingButton from "../../../../../../Components/LoadingButton/LoadingButton";

const AddAccessModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [access, setAccess] = useState({})
    const [objects, setObjects] = useState([])
    useEffect(() => {
        if (!props.isOpen)
            setAccess({})
    }, [props.isOpen])
    useEffect(() => {
        if (access.object_type) {
            switch (access.object_type) {
                case 'project':
                    setObjects(props.userProjects)
                    break;
                case 'instance':
                    setObjects(props.userInstances)

                    break;
                case 'bucket':
                    setObjects(props.userBuckets)

                    break;
                case 'registry':
                    setObjects(props.userRegistries)
                    break;
                default:
                    break;
            }
        }
    }, [access.object_type, props.userProjects, props.userInstances, props.userRegistries, props.userBuckets])
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="iam.access.generate" />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>
                            <Translate content="iam.access.email" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input onChange={(e) => setAccess({ ...access, email: e.target.value })} value={access.email || ''} className="blackableInput" />
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>
                            <Translate content="iam.access.objectType" />
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Select
                            value={access.object_type}
                            style={{ marginLeft: '10px', marginRight: '10px' }}
                            onChange={(e) => { setAccess({ ...access, object_type: e.target.value }); }}
                        >
                            {['project', 'instance', 'bucket', 'registry'].map(object_type => (
                                <MenuItem value={object_type} key={object_type}>
                                    {object_type}
                                </MenuItem>
                            ))}
                        </Select>

                    </Col>

                </Row>
                {access.object_type &&
                    <Fragment>
                        <Row style={{ marginTop: '20px' }}>
                            <Col>
                                <h5 style={{ fontSize: '14px', color: colors.smallTitle[_mode] }}>Object</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Select
                                    value={access.user_id}
                                    style={{ marginLeft: '10px', marginRight: '10px' }}
                                    onChange={(e) => { setAccess({ ...access, object_id: e.target.value }); }}
                                >
                                    {objects.map(object => (
                                        <MenuItem key={object.id} value={object.id}>
                                            {object.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                            </Col>

                        </Row>

                    </Fragment>
                }
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    loading={props.loading}
                    onClick={() => props.onSave(access)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.button.save" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default AddAccessModal;
