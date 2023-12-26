import { Meta, StoryObj } from '@storybook/react';

import Component from './AuthenticationPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AuthenticationPage: Story = {
  render: () => <Component isLoading={false} onGithubLogin={() => {}} />,
};
