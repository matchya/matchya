import { Meta, StoryObj } from '@storybook/react';

import DisplayingComponent from './Badge';
import ShadcnComponent from './Badge.shadcn';

const meta: Meta<typeof DisplayingComponent> = {
  title: 'Component/Badge',
  component: DisplayingComponent,
};

export default meta;

type Story = StoryObj<typeof DisplayingComponent>;

export const Shadcn: Story = {
  render: () => <ShadcnComponent>Hello</ShadcnComponent>,
};
