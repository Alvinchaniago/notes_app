import { useForm } from "react-hook-form";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

/* PROJECT IMPORT */
import { User } from "../models/user";
import { SignUpCredentials } from "../network/users_api";
import * as UsersApi from "../network/users_api";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { ConflictError } from "../errors/http_errors";

interface SignUpModalProps {
  onDismiss: () => void;
  onSuccessfulSignUp: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSuccessfulSignUp }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();
  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await UsersApi.signUp(credentials);
      onSuccessfulSignUp(newUser);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Pick a good username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
          />
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Your email address"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Make a strong password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <Button
            className={styleUtils.width100}
            type="submit"
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;

/* =========================== NOTE =========================== */
/* FORM ID ISN'T REQUIRED SINCE THE BUTTON IS ALREADY LOCATED INSIDE THE FORM */
/* FORM ID IS REQUIRED IF THE BUTTON IS OUTSIDE THE FORM */
