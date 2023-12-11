import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserAuthForm } from './UserAuthForm';

const meta: Meta<typeof UserAuthForm> = {
  component: UserAuthForm,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UserAuthForm>;

export const Register: Story = {
  render: () => (
    <UserAuthForm
      authType="signup"
      className="mx-6"
      onSubmit={() => {}}
      isLoading={false}
      userInput={{
        companyName: '',
        email: '',
        githubUsername: '',
        password: '',
      }}
      onUserInputChange={() => {}}
    />
  ),
};

export const Login: Story = {
  render: () => (
    <UserAuthForm
      authType="login"
      className="mx-6"
      onSubmit={() => {}}
      isLoading={false}
      userInput={{
        companyName: '',
        email: '',
        githubUsername: '',
        password: '',
      }}
      onUserInputChange={() => {}}
    />
  ),
};
