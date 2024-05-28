import { FC } from "react";
import CardWrapper from "@/components/auth/CardWrapper";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocials
    >
      Login Form
    </CardWrapper>
  );
};

export default LoginForm;
