import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserAuthForm as Component } from './UserAuthForm';

const meta: Meta<typeof Component> = {
  title: 'Component/Form',
  component: Component,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Register: Story = {
  render: () => (
    <Component
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
    <Component
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
