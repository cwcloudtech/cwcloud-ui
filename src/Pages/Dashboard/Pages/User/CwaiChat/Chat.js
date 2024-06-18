import { useContext, useState, useEffect, Fragment } from 'react';
import { Col, Row, Container } from "reactstrap";
import classes from "./Chat.module.css";
import '../../../../../common.css';
import axios from "../../../../../utils/axios";
import { Autocomplete, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Translate from 'react-translate-component';
import GlobalContext from '../../../../../Context/GlobalContext';
import colors from '../../../../../Context/Colors';
import LoadingButton from '../../../../../Components/LoadingButton/LoadingButton';
import ChatMessage from '../../../../../Components/ChatMessage/ChatMessage';
import ChatMessageEntered from '../../../../../Components/ChatMessage/ChatMessageEntered';
import { BarLoader } from 'react-spinners';

function CwaiChat() {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [prevPrompt, setPrevPrompt] = useState({})
    const [prompt, setPrompt] = useState({})
    const [models, setModels] = useState([])
    const [cwaiAnswer, setCwaiAnswer] = useState('');
    const [conversation, setConversation] = useState([])

    useEffect(() => {
        context.setIsGlobal(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        context.setIsGlobal(true)
        axios.get("/ai/models")
            .then(res => {
                setModels(res.data.models)
            }).catch(err => {
                toast.error(context.counterpart("error_codes.cwaiapi_not_enabled"))
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCwai = (prompt) => {
        setLoadingSubmit(true)
        setCwaiAnswer(null)
        axios.post(`/ai/prompt`, prompt)
            .then(response => {
                const interaction = {
                    "prompt": prompt.message,
                    "answer": response.data.response[0]
                }
                setConversation(prevConversation => [...prevConversation, interaction])
                setLoadingSubmit(false)
                setCwaiAnswer(response.data.response[0])
            }).catch(err => {
                setLoadingSubmit(false)
            })
        setPrevPrompt(prompt);
    }

    const handleMainPrompt = () => {
        handleCwai(prompt)
        setPrompt({ ...prompt, message: '' })
    }

    const handleRegenerateResponse = () => {
        const newConversation = [...conversation]
        newConversation.pop()
        setConversation(newConversation)
        handleCwai(prevPrompt)
    }
        
    const handleCwaiKeyboard = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        handleCwai(prompt)
        setPrompt({ ...prompt, message: '' })
    }

    return (
        <div>
            <Container fluid style={{ padding: "5px 20px 20px 20px", marginTop: "20px" }}>
                <Row>
                    <Col className="borderCol" style={{boxShadow: "0 3px " + colors.bottomShaddow[_mode]}}>
                        <h5 className="textTitle" style={{color: colors.title[_mode]}}>
                            <Translate content="dashboard.cwai.mainTitle" />
                        </h5>
                    </Col>
                </Row>
                    <Row className={classes.rowContainer} style={{ maxHeight: '450px', overflow: 'auto', display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px', marginTop: '20px' }}>
                        {conversation.map((item, index) => (
                        <Fragment key={index}>
                            <ChatMessageEntered text={item.prompt} />
                            <ChatMessage text={item.answer} />
                        </Fragment>
                        ))}
                        {loadingSubmit &&
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "20px"}}>
                                <BarLoader
                                    color={colors.title[_mode]}
                                    loading={loadingSubmit}
                                    size={10}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        }
                    </Row>
                <Row style={{ margin: "30px 0px" }}>
                    <Col md="2">
                        <Autocomplete
                            style={{ paddingBottom: "15px", height: "50px"}}
                            disablePortal
                            id="combo-box-models"
                            onChange={(event, newValue) => {
                                setPrompt({ ...prompt, model: newValue });
                            }}
                            freeSolo
                            options={models}
                            renderInput={(params) => <TextField id="model" onChange={(e) => setPrompt({ ...prompt, model: e.target.value })} {...params} label={context.counterpart('dashboard.cwai.model.placeholder')} fullWidth />}
                        />
                    </Col>
                    <Col md="8">
                        <TextField
                            style={{ height: "50px" }}
                            id="message"
                            label={context.counterpart('dashboard.cwai.prompt.placeholder')}
                            onChange={(e) => setPrompt({ ...prompt, message: e.target.value })}
                            onKeyDown={(e) => {handleCwaiKeyboard(e);}}
                            size="small"
                            fullWidth
                            value={prompt.message}
                        />
                    </Col>
                    <Col style={{ display: "flex", alignItems: "center" }}>
                            <LoadingButton icon="fa-solid fa-paper-plane" loading={loadingSubmit} onClick={handleMainPrompt} style={{ width: "100px", height: "60px" }} variant="outlined" />
                    </Col>
                </Row>
                {cwaiAnswer && <Row>
                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "20px" }}>
                        <LoadingButton icon="fa-solid fa-refresh" loading={loadingSubmit} onClick={handleRegenerateResponse} style={{ width: "250px", height: "50px" }} variant="outlined">
                            <Translate content="dashboard.cwai.regenerate" />
                        </LoadingButton>
                    </Col>
                </Row>}
            </Container>
        </div >
    )
}
export default CwaiChat
