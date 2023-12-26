import { Meta, StoryObj } from '@storybook/react';

import Component from './CreateAccountCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CreateAccount: Story = {
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
