import React from "react";
import BlocklyWorkspace from "../BlocklyWorkspace/BlocklyWorkspace";
import CustomModal from "../CustomModal/CustomModal";

const BlocklyModal = (props) => {
    return (
        <CustomModal isOpen={props.isOpen} toggle={props.toggle}>
            <BlocklyWorkspace
                workspaceHeight="800px"
                showBlocklyFullScreen={props.isOpen}
                code={props.code}
                state={props.state}
                _mode={props._mode}
                onWorkspaceChange={props.onWorkspaceChange}
            />
        </CustomModal>
    );
};

export default BlocklyModal;
