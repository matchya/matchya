import { Meta, StoryObj } from '@storybook/react';

import Component from './PositionSwitcher';

import { mockedPositions, mockedSelectedPosition } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const PositionSwitcher: Story = {
  render: () => (
    <Component
      positions={mockedPositions}
      selectedPosition={mockedSelectedPosition}
      selectPosition={() => {}}
    />
  ),
};
