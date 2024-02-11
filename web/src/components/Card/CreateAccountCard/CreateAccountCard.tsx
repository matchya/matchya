import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components';

interface CreateAccountProps {
  password: string;
  email: string;
  handleCreateAccount: () => void;
  handleInputChange: (
    field: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const CreateAccountCard = ({
  handleInputChange,
  handleCreateAccount,
  password,
  email,
}: CreateAccountProps) => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
};

export default CreateAccountCard;
