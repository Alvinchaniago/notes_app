import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  /* THE LINE BELOW ALLOWS US TO GET THE REMAINING PROPERTIES */
  /* PASS IT AS ...PROPS BELOW */
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: TextInputFieldProps) => {
  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      {/* SPREAD OPERATOR CONNECTS THIS FORM TO REACT HOOK FORM */}
      {/* !!ERRORS SIMPLY TURNS INTO BOOL, IF UNDEFINED FALSE, IF THERE'S AN ERROR TRUE */}
      <Form.Control
        {...props}
        {...register(name, registerOptions)}
        isInvalid={!!error}
      />
      {/* THIS DISPLAYS THE ERROR MESSAGE ONLY WHEN THERE'S AN ERROR AS SHOWN INSIDE ISINVALID */}
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
