import React, { useContext, useState } from "react";
import { Select } from "@material-ui/core";
import { MenuItem } from "@mui/material";
import Translate from "react-translate-component";
import GlobalContext from "../../../../../../../../Context/GlobalContext";
import colors from "../../../../../../../../Context/Colors";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import LoadingButton from "../../../../../../../../Components/LoadingButton/LoadingButton";

const ConfirmPaymentModal = (props) => {
    const _mode = useContext(GlobalContext).mode;
    const [selectedVoucher, setSelectedVoucher] = useState(null)
    return (
        <Modal centered isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>
                <Translate content="common.confirm" />{' '}
                <Translate content={props.resourceName} />
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <Row>
                            <div style={{ marginBottom: "10%", marginTop: "10px", color: colors.secondText[_mode] }}>
                                {props.message}
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 style={{color: colors.title[_mode]}}>Available Vouchers</h5>
                        <Select style={{ width: '100%' }}
                            onChange={(e) => setSelectedVoucher(e.target.value)}
                            value={selectedVoucher || 'none'}>
                            <MenuItem value='none'> None</MenuItem>
                            {props.vouchers.map(voucher => (
                                <MenuItem value={voucher.id}>
                                    {voucher.code}
                                </MenuItem>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <LoadingButton
                    onClick={() => props.onConfirm(selectedVoucher)}
                    style={{ width: "100%" }}
                >
                    <Translate content="common.ok" />
                </LoadingButton>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmPaymentModal;
