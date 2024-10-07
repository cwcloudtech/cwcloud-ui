import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import LoadingButton from "../../LoadingButton/LoadingButton";
import Translate from "react-translate-component";

const TransferModal = ({ isOpen, toggle, onSave, loading, users, title }) => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!isOpen) setUserEmail("");
  }, [isOpen]);

  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <Translate content={title} />
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <h5 style={{ fontSize: "14px" }}>
              <Translate content="common.fields.userEmail" />
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Autocomplete
              disablePortal
              id="combo-box-email"
              onChange={(event, newValue) => setUserEmail(newValue)}
              freeSolo
              options={users.map((u) => u.email)}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Email"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              )}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <LoadingButton
          loading={loading}
          onClick={() => onSave(userEmail)}
          style={{ width: "100%" }}
        >
          Save
        </LoadingButton>
      </ModalFooter>
    </Modal>
  );
};

export default TransferModal;
