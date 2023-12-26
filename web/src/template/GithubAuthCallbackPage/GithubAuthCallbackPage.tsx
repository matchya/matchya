import { Button, Icons } from '@/components';

interface GithubAuthCallbackPageTemplateProps {
  isLoginFailed: boolean;
  onRetryLogin: () => void;
}

const GithubAuthCallbackPageTemplate = ({
  isLoginFailed,
  onRetryLogin,
}: GithubAuthCallbackPageTemplateProps) => (
  <div className="h-screen flex justify-center items-center">
    <div className="flex flex-col justify-center items-center mb-5">
      {!isLoginFailed && (
        <Icons.spinner className="mb-3 h-10 w-10 animate-spin" />
      )}
      <p className="text-xl">
        {!isLoginFailed
          ? 'Logging in with GitHub...'
          : 'Login with GitHub Failed. Please try again.'}
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

export default GithubAuthCallbackPageTemplate;
