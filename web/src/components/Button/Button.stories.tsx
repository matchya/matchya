import { Meta, StoryObj } from '@storybook/react';

import ShadcnComponent from './Button.shadcn';

const meta: Meta<typeof ShadcnComponent> = {
  title: 'Component/Button',
  component: ShadcnComponent,
};

export default meta;

type Story = StoryObj<typeof ShadcnComponent>;

export const Shadcn: Story = {
  render: () => <ShadcnComponent>Hello</ShadcnComponent>,
};
