import { FC } from "react";
import CardWrapper from "@/components/auth/CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorCardProps {}

const ErrorCard: FC<ErrorCardProps> = () => {
  return (
    <CardWrapper
      headerLabel="Oops, something went wrong!"
      backButtonHref="/login"
      backButtonLabel="back to login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
