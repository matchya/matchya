import { Meta, StoryObj } from '@storybook/react';

import Component from './GithubAuthCallbackPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const GithubAuthCallbackPage: Story = {
  render: () => <Component isLoginFailed={false} onRetryLogin={() => {}} />,
};
