import { Meta, StoryObj } from '@storybook/react';

import Component from './OnboardingCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Onboarding: Story = {
  render: () => <Component title="Step 1" link="/dashboard" />,
};
