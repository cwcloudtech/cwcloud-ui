import React, { useContext } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Box, Button, Stack } from "@mui/material";
import LoadingButton from "../LoadingButton/LoadingButton";
import GlobalContext from "../../Context/GlobalContext";
import classes from "./Modal.module.css";
import colors from "../../Context/Colors";

const UploadFileModal = (props) => {
  const inputRef = React.useRef(null);
  const [fileName, setFileName] = React.useState(null);
  const { counterpart } = useContext(GlobalContext);
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const modalStyle = {
    maxWidth: "350px", // Default maxWidth for small screens
    width: "100%",
  };

  // Media query for large screens (LG)
  const mediaQueryLarge = window.matchMedia("(min-width: 1200px)");

  // Check if the screen size is large and set maxWidth and height accordingly
  if (mediaQueryLarge.matches) {
    modalStyle.maxWidth = "550px";
    modalStyle.height = "800px";
  } else {
    modalStyle.height = "600px";
  }

  const toggle = () => {
    setFileName(null);
    props.toggle();
  };

  return (
    <Modal centered isOpen={props.isOpen} toggle={toggle} style={modalStyle}>
      <ModalHeader toggle={toggle}>{props.title}</ModalHeader>
      <ModalBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (e.target[0].files[0]) {
              setFileName(null);
              props.onUpload(e);
            }
          }}
        >
          <Stack
            spacing={2}
            display={"flex"}
          >
            <Stack spacing={1}
              textAlign={"center"}
              display={"flex"}
              alignItems={"center"}>
              <input
                type="file"
                id={"file_input"}
                style={{ display: "none" }}
                ref={inputRef}
                accept={props.accept}
                onChange={(e) => {
                  if (e.target.files[0]) setFileName(e.target.files[0].name);
                }}
              />
              <i
                className="fa-solid fa-cloud-arrow-up"
                style={{ fontSize: "75px" }}
                onClick={() => inputRef.current.click()}
              ></i>
              {props.subtitle && (
                <span
                  className={classes.subtitle}
                  style={{ color: colors.secondText[_mode] }}
                >
                  {props.subtitle}
                </span>
              )}
              {fileName && (
                <Box
                  sx={{
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {fileName}
                </Box>
              )}
              <Button
                variant="contained"
                onClick={() => inputRef.current.click()}
              >
                {counterpart("common.button.browseFiles")}
              </Button>
              {props.textIndicator &&
                <span
                  className={classes.subtitle}
                  style={{ color: colors.secondText[_mode], textAlign: "center" }}
                >
                  {props.textIndicator}
                </span>
              }
            </Stack>
            {props.children}
            <LoadingButton
              loading={props.loading}
              icon="fa-solid fa-floppy-disk"
              type="submit"
              style={{ width: "100%", marginTop: "25px" }}
            >
              {props.btnText}
            </LoadingButton>
          </Stack>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UploadFileModal;
