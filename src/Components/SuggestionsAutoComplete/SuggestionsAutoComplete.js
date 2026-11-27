import { Autocomplete } from "@mui/material";
import Translate from "../Translate/Translate";
import { Form, FormFeedback, FormGroup, FormText } from "reactstrap";

const SuggestionsAutoComplete = ({ id, onChange, options, renderInput, feedbackMessage, hint, length, value, defaultValue }) => {
    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
                <Autocomplete
                    defaultValue={ defaultValue ? defaultValue : ""}
                    value={value ? value : ""}
                    disablePortal
                    id={id}
                    onChange={onChange}
                    freeSolo
                    options={options}
                    md={{ width: length ? length : 300 }}
                    renderInput={renderInput}
                />
                <FormFeedback>
                    <Translate content={feedbackMessage} />
                </FormFeedback>
                <FormText>
                    <Translate content={hint} />
                </FormText>
            </FormGroup>
        </Form>
    );
}

export default SuggestionsAutoComplete;