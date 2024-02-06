import { Meta, StoryObj } from '@storybook/react';

import DisplayingComponent from './Avatar';
import ShadcnComponent from './Avatar.shadcn';

const meta: Meta<typeof DisplayingComponent> = {
  title: 'Component/Avatar',
  component: DisplayingComponent,
};

export default meta;

type Story = StoryObj<typeof DisplayingComponent>;

export const Shadcn: Story = {
  render: () => <ShadcnComponent />,
};
