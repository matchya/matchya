import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { CandidateDetailCard as Component } from './CandidateDetailCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
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

export const CandidateDetail: Story = {
  render: () => <Component />,
};
