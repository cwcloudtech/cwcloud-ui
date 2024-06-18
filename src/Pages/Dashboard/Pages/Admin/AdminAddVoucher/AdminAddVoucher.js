import { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from "reactstrap"
import classes from "./AdminAddVoucher.module.css"
import '../../../../../common.css'
import axios from "../../../../../utils/axios";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import { Autocomplete } from '@mui/material';

function AdminAddVoucher() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [userEmail, setUserEmail] = useState(null)
    const [users, setUsers] = useState([])
    const [voucher, setVoucher] = useState({});

    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClickButtonPreview = () => {
        setLoadingPreview(true)
        axios.post(`/admin/voucher`, { ...voucher, email: userEmail }).then((res) => {
            toast.success("Voucher sucessfully generated")
            setLoadingPreview(false)
        }).catch(err => {
            setLoadingPreview(false)
        })
    }

    return (
        <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }} >
            <Row>
                <Col className="formContainer" style={{backgroundColor: colors.formBackground[_mode]}}>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col className={classes.estwicol}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-email"
                                onChange={(event, newValue) => {
                                    setUserEmail(newValue);
                                }}
                                freeSolo
                                options={users.map(u => u.email)}
                                sx={{ width: "100%" }}
                                renderInput={(params) =>
                                    <TextField 
                                        onChange={(e) => setUserEmail(e.target.value)} {...params} 
                                        label={context.counterpart('dashboard.adminVouchersPage.email')} />}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col className={classes.estwicol}>
                            <TextField
                                sx={{ width: "100%" }}
                                onChange={(e) => setVoucher({ ...voucher, code: e.target.value })}
                                label={context.counterpart('dashboard.adminVouchersPage.table.code')} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col className={classes.estwicol}>
                            <TextField
                                sx={{ width: "100%" }}
                                onChange={(e) => setVoucher({ ...voucher, price: e.target.value })}
                                label={context.counterpart('dashboard.adminVouchersPage.table.price')} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px", marginBottom: "30px", marginRight: "0", marginLeft: "0", display: "flex", justifyContent: "center" }}>
                        <Col className={classes.estwicol}>
                            <TextField
                                type='number'
                                sx={{ width: "100%" }}
                                onChange={(e) => setVoucher({ ...voucher, validity: e.target.value })}
                                label={context.counterpart('dashboard.adminVouchersPage.table.validity')} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingButton loading={loadingPreview} icon="fa-solid fa-floppy-disk" onClick={handleClickButtonPreview} >
                                <Translate content="common.button.save" />
                            </LoadingButton>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default AdminAddVoucher

