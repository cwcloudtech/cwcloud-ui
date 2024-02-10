import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Input, Form, FormGroup, FormFeedback, FormText, Col, Row } from "reactstrap";
import classes from "./AdminAddBucket.module.css"
import axios from "../../../../../utils/axios";
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import colors from "../../../../../Context/Colors";
import { TextField } from "@mui/material";
import Translate from 'react-translate-component';
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import ServiceNotAvailable from "../../../../../Components/ServiceNotAvailable/ServiceNotAvailable";
import MiniCardComponent from "../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";
import SuggestionsAutoComplete from "../../../../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete";

function AdminAddBucket(props) {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [bucketInfo, setBucketInfo] = useState({ type: "" })
    const [disabled, setdisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [serviceNotAvailable, setServiceNotAvailable] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        context.setIsGlobal(false)
        setServiceNotAvailable(false)
        if (!context.selectedProvider.bucket_available_regions.includes(context.region.name))
            return setServiceNotAvailable(true)
        axios.get("/admin/user/all")
            .then(res => {
                setUsers(res.data.result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.region.name])

    useEffect(() => {
        if (bucketInfo.email) {
            const userIndex = users.findIndex(u => u.email === bucketInfo.email)
            setSelectedUser({ ...users[userIndex] })
        }
    }, [bucketInfo, users])

    const addBucketHandler = () => {
        setLoading(true)
        setdisabled(!bucketInfo.name)
        if (bucketInfo.email == null) {
            setLoading(false)
            return toast.error(context.counterpart('dashboard.addBucket.errors.missingEmailInput'))
        }
        axios.post(`/admin/bucket/${context.selectedProvider.name}/${context.region.name}/provision`, { ...bucketInfo, email: selectedUser.email })
            .then(response => {
                setLoading(false)
                toast.success(context.counterpart('dashboard.addBucket.message.successAdd'))
                navigate(`/admin/bucket/${response.data.id}`)
            }).catch(err => {
                setLoading(false)
            })
    }
    if (serviceNotAvailable)
        return (
            <ServiceNotAvailable region={context.region.name} backLink={'/admin/buckets'} />
        )
    return (
        <div>
            <Row>
                <Col>
                    <div className={classes.goBack}>
                        <NavLink to='/admin/buckets' className={classes.link}>
                            <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                            <Translate content="dashboard.addBucket.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "30px", marginBottom: "20px", margin: "10px 0px 0px" }}>
                <Col className={classes.borderCol} style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                    <h5 className={classes.textTitle} style={{color: colors.title[_mode]}}>
                        <Translate content="dashboard.addBucket.mainTitle" />
                    </h5>
                </Col>
            </Row>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addBucket.inputs.name.title')}>
                <Form>
                    <FormGroup>
                        <Input className="blackableInput" placeholder={context.counterpart('dashboard.addBucket.inputs.name.placeholder')}
                            value={bucketInfo.name}
                            onChange={(e) => setBucketInfo({ ...bucketInfo, name: e.target.value })} invalid={disabled} />
                        <FormFeedback>
                            <Translate content="common.message.thisFieldIsRequired" />
                        </FormFeedback>
                        <FormText>
                            <Translate content="dashboard.addBucket.inputs.name.hint" />
                        </FormText>
                    </FormGroup>
                </Form>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addBucket.inputs.type.title')}
                subtitle={context.counterpart('dashboard.addBucket.inputs.type.subtitle')} >

                <Row horizontal="center" >
                    {context.selectedProvider.bucket_types.map(type =>
                        <MiniCardComponent
                            instancetitle={type}
                            key={type}
                            checked={bucketInfo.type === type}
                            onClick={() => setBucketInfo({ ...bucketInfo, type: type })} />
                    )}

                </Row>
            </CardComponent>

            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.addBucket.inputs.email.title')}
                subtitle={context.counterpart('dashboard.addBucket.inputs.email.subtitle')}>
                <Form>
                    <SuggestionsAutoComplete
                        id="combo-box-email"
                        onChange={(event, newValue) => {
                            setBucketInfo({ ...bucketInfo, email: newValue });
                        }}
                        options={users.map(u => u.email)}
                        renderInput={(params) =>
                            <TextField onChange={(e) => setBucketInfo({ ...bucketInfo, email: e.target.value })} {...params} label={context.counterpart('dashboard.addBucket.inputs.email.placeholder')} />}
                        feedbackMessage="common.message.thisFieldIsRequired"
                        hint="dashboard.addBucket.inputs.email.feedback"
                    />
                </Form>
            </CardComponent>
            <Row style={{ marginTop: '30px' }}  >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton icon="fa-solid fa-floppy-disk" loading={loading} onClick={addBucketHandler}  >
                        <Translate content="common.button.create" />
                    </LoadingButton>
                </Col>
            </Row>
        </div >
    )
}

export default AdminAddBucket;
