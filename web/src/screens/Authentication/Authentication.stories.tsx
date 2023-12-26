import { Meta, StoryObj } from '@storybook/react';

import Authentication from './Authentication';

const meta: Meta<typeof Authentication> = {
  component: Authentication,
};

export default meta;

type Story = StoryObj<typeof Authentication>;

export const Default: Story = {
  render: () => <Authentication />,
};
