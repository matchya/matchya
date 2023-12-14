import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { MultiSelect as Component } from './MultiSelect';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const MultiSelect: Story = {
  render: () => (
    <Component
      options={[]}
      placeholder="Repositories"
      selected={[]}
      onUnselect={() => {}}
      onKeyDown={() => {}}
      onAddItem={() => {}}
      inputRef={React.createRef<HTMLInputElement>()}
    />
  ),
};
