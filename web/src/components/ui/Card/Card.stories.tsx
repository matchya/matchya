import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Button } from '../Button/Button';
import { Icons } from '../Icons/Icons';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-6">
          <Button onClick={() => {}} variant="outline">
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
            value=""
            onChange={() => {}}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input value="" onChange={() => {}} id="password" type="password" />
        </div>
      </CardContent>
      <div>
        <Button onClick={() => {}} className="w-full">
          Create account
        </Button>
      </div>
    </Card>
  ),
};
