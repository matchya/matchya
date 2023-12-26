import { Meta, StoryObj } from '@storybook/react';

import { PositionSwitcher as Component } from './PositionSwitcher';

import { Position } from '@/types';
import { mockPositions, mockSelectedPosition } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const PositionSwitcher: Story = {
  render: () => (
    <Component
      className="mx-6"
      positions={mockPositions}
      selectedPosition={mockSelectedPosition}
      selectPosition={() => {}}
    />
  ),
};
