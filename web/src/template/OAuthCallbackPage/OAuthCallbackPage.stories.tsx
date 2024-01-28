import { Meta, StoryObj } from '@storybook/react';

import Component from './OAuthCallbackPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const OAuthCallbackPage: Story = {
  render: () => (
    <Component
      isLoginFailed={false}
      onRetryLogin={() => {}}
      authType="Google"
    />
  ),
};
