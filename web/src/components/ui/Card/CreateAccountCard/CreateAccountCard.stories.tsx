import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { CreateAccountCard as Component } from './CreateAccountCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
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

export const Default: Story = {
  render: () => (
    <Component
      handleInputChange={() => {}}
      handleGithubAuthentication={() => {}}
      handleCreateAccount={() => {}}
      password=""
      email=""
    />
  ),
};
