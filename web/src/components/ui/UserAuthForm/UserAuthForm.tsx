import * as React from 'react';

import { Button } from '@/components/ui/Button/Button';
import { Icons } from '@/components/ui/Icons/Icons';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { githubClientId } from '@/config';
import { cn } from '@/lib/utils';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  authType: 'login' | 'signup';
  onSubmit: (event: any) => void;
  isLoading: boolean;
  userInput: {
    companyName: string;
    email: string;
    githubUsername: string;
    password: string;
  };
  onUserInputChange: (fieldName: string, value: string) => void;
}

export function UserAuthForm({
  className,
  authType,
  onSubmit,
  isLoading,
  userInput,
  onUserInputChange,
  ...props
}: UserAuthFormProps) {
  const handleGithubLogin = () => {
    const redirectUri = 'http://127.0.0.1:5173/auth/github/callback';
    const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = loginUrl;
  };

  const renderInputs = () => {
    const commonInputs = (
      <>
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={userInput.email}
            onChange={e => onUserInputChange('email', e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="password"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            value={userInput.password}
            onChange={e => onUserInputChange('password', e.target.value)}
          />
        </div>
      </>
    );
    if (authType === 'login') {
      return commonInputs;
    }
    return (
      <>
        <div className="grid gap-1">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Instagram"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            value={userInput.companyName}
            onChange={e => onUserInputChange('companyName', e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="githubUsername">Github Username</Label>
          <Input
            id="githubUsername"
            placeholder="kokiebisu"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            value={userInput.githubUsername}
            onChange={e => onUserInputChange('githubUsername', e.target.value)}
          />
        </div>
        {commonInputs}
      </>
    );
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {React.useMemo(
            () => renderInputs(),
            [authType, isLoading, userInput]
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </div>
      </form>
      {/* To be implemented soon */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGithubLogin}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
        GitHub
      </Button>
    </div>
  );
}
