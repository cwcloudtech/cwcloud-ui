import { useContext, useState, useEffect } from "react";
import CardComponent from "../../../../../Components/Cards/CardComponent/CardComponent";
import { Col, Row } from "reactstrap"
import classes from "./AttachInstance.module.css"
import axios from "../../../../../utils/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify";
import GlobalContext from "../../../../../Context/GlobalContext";
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import Translate from 'react-translate-component';
import LoadingButton from "../../../../../Components/LoadingButton/LoadingButton";
import colors from "../../../../../Context/Colors";
import MiniCardComponent from "../../../../../Components/Cards/MiniCardComponent/MiniCardComponent";

function AttachInstance(props) {
    const [instanceInfo, setInstanceInfo] = useState({ type: "" })
    const [loading, setLoading] = useState(false)
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [project, setProject] = useState([])
    const [prices, setPrices] = useState([])
    const [zone, setZone] = useState(null)
    const { projectId } = useParams()
    const navigate = useNavigate()
    const priceUnit = process.env.REACT_APP_PRICE_UNIT

    useEffect(() => {
        context.setIsGlobal(false)
        axios.get(`/project/${projectId}`)
            .then(async (res) => {
                setProject(res.data)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (zone) {
            axios.get(`/provider/${context.selectedProvider.name}/instance/${context.region.name}/${zone}/pricing`)
                .then(res => {
                    setPrices(res.data.types)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zone])

    const attachInstanceHandler = () => {
        setLoading(true)
        axios.post(`/instance/${context.selectedProvider.name}/${context.region.name}/${zone}/attach/${project.id}`, { ...instanceInfo })
            .then(response => {
                setLoading(false)
                toast.success(context.counterpart('dashboard.attachInstance.message.successAdd'))
                navigate(`/instance/${response.data.id}`)
            }).catch(err => {
                setLoading(false)

            })
    }

    return (
        <div>
            <Row>
                <Col>
                    <div className={classes.goBack}>
                        <NavLink to='/projects' className={classes.link}>
                            <i className={["fa-solid fa-arrow-left", `${classes.iconStyle}`].join(" ")}></i>
                            <Translate content="dashboard.attachInstance.back" />
                        </NavLink>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Col>
                    <h5 className={classes.titleStyle} style={{color: colors.title[_mode]}}><Translate content="dashboard.attachInstance.mainTitle" />
                        {' '}<span style={{ fontWeight: '700' }}>{project.name}</span>
                    </h5>
                </Col>
            </Row>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart("dashboard.attachInstance.inputs.playbook.title")}
                subtitle={context.counterpart("dashboard.attachInstance.inputs.playbook.subtitle")}>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">
                        <Translate content="dashboard.attachInstance.inputs.playbook.instanceName" />
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={instanceInfo.name || 'none'}
                        onChange={(e) => setInstanceInfo({ ...instanceInfo.type, name: e.target.value })}
                        input={<OutlinedInput label="Name" />}
                    >
                        {project.playbooks?.map(p => p.split('playbook-')[1]).filter(playbookName => (
                            !project.instances.some(instance => instance.name === playbookName)
                        )).map(filteredPlaybookName => (
                            <MenuItem
                                key={filteredPlaybookName}
                                value={filteredPlaybookName}
                            >
                                {filteredPlaybookName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart('dashboard.attachInstance.inputs.zone.title')}>
                <Select
                    value={zone || 'none'}
                    style={{ paddingLeft: '10px', margin: '10px', minWidth: '100px' }}
                    onChange={(e) => { setZone(e.target.value); }}
                >
                    <MenuItem disabled value={'none'} >
                        <Translate content="dashboard.attachInstance.inputs.zone.placeholder" />
                    </MenuItem>
                    {context.region.zones.map(zone => (
                        <MenuItem value={zone} key={zone}>
                            <span>{zone}</span>
                        </MenuItem>
                    ))}
                </Select>
            </CardComponent>
            <CardComponent
                containerStyles={props.containerStyles}
                title={context.counterpart("dashboard.attachInstance.inputs.type.title")}
                subtitle={context.counterpart("dashboard.attachInstance.inputs.type.subtitle")}>
                <Row horizontal="center" >
                    {prices.map(price =>
                        <MiniCardComponent
                            instancetitle={price.name}
                            value={priceUnit + ' ' + price.price}
                            key={price.name}
                            checked={instanceInfo.type === price.name}
                            onClick={() => setInstanceInfo({ ...instanceInfo, type: price.name })} />
                    )}
                </Row>
            </CardComponent>
            <Row style={{ marginTop: '20px', marginBottom: '20px' }}  >
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton loading={loading} onClick={attachInstanceHandler} style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "0" }}>
                        <Translate content="common.button.create" />
                    </LoadingButton>
                </Col>
            </Row>
        </div >
    )
}

export default AttachInstance;
