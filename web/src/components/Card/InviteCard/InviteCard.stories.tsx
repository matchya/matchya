import { Meta, StoryObj } from '@storybook/react';

import Component from './InviteCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Invite: Story = {
  render: () => <Component candidates={[]} assessmentId='' />,
};
