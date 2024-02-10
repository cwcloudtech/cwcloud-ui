import React, { useContext, useState } from 'react';
import './EditorActions.css';
import { Tooltip } from '@material-ui/core';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import GlobalContext from '../../Context/GlobalContext';
import DoneIcon from '@mui/icons-material/Done';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';

const EditorActions = (props) => {
    const context = useContext(GlobalContext);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(props.textToCopy)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="copy-button-container">
            <Tooltip title={context.counterpart('common.button.goFullScreen')}>
                <FullscreenOutlinedIcon className='fullscreenbtn' onClick={props.handleFullScreen} style={{ height: "30px" }} />
            </Tooltip>
            {copied ?
                <div>
                    <DoneIcon style={{ height: "30px" }} /> 
                    <Translate content="common.state.copied" />!
                </div>
                : 
                <Tooltip title={counterpart("common.button.copy")}>
                    <ContentPasteOutlinedIcon className="copybtn" onClick={handleCopy} style={{ height: "30px" }}/>
                </Tooltip>
            }
        </div>
    );
};

export default EditorActions;
