import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { MultiSelect } from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  component: MultiSelect,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: () => <MultiSelect options={[]} placeholder="Repositories" />,
};
