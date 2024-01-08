import { Meta, StoryObj } from '@storybook/react';

import Component from './OnboardingPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const OnboardingPage: Story = {
  render: () => (
    <Component
      email={''}
      setEmail={() => {}}
      onSubmit={() => {}}
      scrollDown={() => {}}
    />
  ),
};
