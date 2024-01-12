import { Meta, StoryObj } from '@storybook/react';

import Component from './TestTable';

import { mockedTests } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Test: Story = {
  render: () => <Component tests={mockedTests} />,
};
