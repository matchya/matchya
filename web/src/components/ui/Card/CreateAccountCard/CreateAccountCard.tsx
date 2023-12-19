import { Button } from '@/components/ui/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card/Card';
import { Icons } from '@/components/ui/Icons/Icons';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';

export interface CreateAccountProps {
  handleInputChange: (
    field: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleGithubAuthentication: () => void;
  handleCreateAccount: () => void;
  password: string;
  email: string;
}

export function CreateAccountCard({
  handleInputChange,
  handleGithubAuthentication,
  handleCreateAccount,
  password,
  email,
}: CreateAccountProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-6">
          <Button onClick={handleGithubAuthentication} variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={e => handleInputChange('email', e)}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            onChange={e => handleInputChange('password', e)}
            id="password"
            type="password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateAccount} className="w-full">
          Create account
        </Button>
      </CardFooter>
    </Card>
  );
}
