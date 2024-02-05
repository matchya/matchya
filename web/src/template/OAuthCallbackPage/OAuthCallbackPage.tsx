import { Button, Icons } from '@/components';

interface OuthCallbackPageTemplateProps {
  isLoginFailed: boolean;
  onRetryLogin: () => void;
  authType: string;
}

const OAuthCallbackPageTemplate = ({
  isLoginFailed,
  onRetryLogin,
  authType,
}: OuthCallbackPageTemplateProps) => (
  <div className="h-screen flex justify-center items-center">
    <div className="flex flex-col justify-center items-center mb-5">
      {!isLoginFailed && <Icons.spinner className="spinner mb-2 h-10 w-10" />}
      <p className="text-xl">
        {!isLoginFailed
          ? `Logging in with ${authType}...`
          : `Login with ${authType} Failed. Please try again.`}
      </p>
      {isLoginFailed && (
        <Button
          variant="outline"
          className="mt-5 h-12 text-xl bg-black text-white"
          onClick={onRetryLogin}
        >
          Retry Log In
        </Button>
      )}
    </div>
  </div>
);

export default OAuthCallbackPageTemplate;
