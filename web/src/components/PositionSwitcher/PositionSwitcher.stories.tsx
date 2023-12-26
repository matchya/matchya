import { Meta, StoryObj } from '@storybook/react';

import Component from './PositionSwitcher';

import { mockPositions, mockSelectedPosition } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const PositionSwitcher: Story = {
  render: () => (
    <Component
      positions={mockPositions}
      selectedPosition={mockSelectedPosition}
      selectPosition={() => {}}
    />
  ),
};
