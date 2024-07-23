import {
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { useContext} from "react";
import CardComponent from "../Cards/CardComponent/CardComponent";
import GlobalContext from "../../Context/GlobalContext";
import colors from "../../Context/Colors";
import Translate from "react-translate-component";

function EnvArgsForm({ title, subtitle, args, argsValues, setArgsValues, isInvalid }) {
  const context = useContext(GlobalContext);
  const { counterpart, mode } = context;
  const placeholderPrefix = counterpart("common.word.enter");

  if (!args || args.length === 0 || !argsValues) return null;

  return (
    <CardComponent
      containerStyles="pt-3"
      title={title}
      subtitle={subtitle}
    >
      <Form>
        {args.map((arg, index) => (
          <FormGroup key={`env-arg-${index}`}>
            <Label for={arg} style={{ color: colors.title[mode] }}>
              {arg.charAt(0).toUpperCase() + arg.slice(1)}
            </Label>
            <Input
              className="blackableInput"
              placeholder={`${placeholderPrefix} ${arg} ...`}
              id={arg}
              value={argsValues[arg]}
              onChange={(e) => setArgsValues({ ...argsValues, [arg]: e.target.value })}
              invalid={isInvalid && argsValues[arg] === ""}
            />
            <FormFeedback>
              <Translate
                className="errorText"
                content="common.message.thisFieldIsRequired"
              />
            </FormFeedback>
          </FormGroup>
        ))}
      </Form>
    </CardComponent>
  );
}

export default EnvArgsForm;
