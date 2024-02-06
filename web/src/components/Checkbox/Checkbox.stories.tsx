import { Meta, StoryObj } from '@storybook/react';

import DisplayingComponent from './Checkbox';
import ShadcnComponent from './Checkbox.shadcn';

const meta: Meta<typeof DisplayingComponent> = {
  title: 'Component/Checkbox',
  component: DisplayingComponent,
};

export default meta;

type Story = StoryObj<typeof DisplayingComponent>;

export const Shadcn: Story = {
  render: () => <ShadcnComponent />,
};
