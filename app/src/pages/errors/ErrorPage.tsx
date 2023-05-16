import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as { [index: string]: any };

  return (
    <div>
      <span>Unexpected Error Occurred</span>
      <br />

      <span>{error?.statusText || error?.message}</span>
    </div>
  );
};

export default ErrorPage;
