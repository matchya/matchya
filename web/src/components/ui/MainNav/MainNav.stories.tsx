import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { MainNav } from './MainNav';

const meta: Meta<typeof MainNav> = {
  component: MainNav,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MainNav>;

export const Default: Story = {
  render: () => <MainNav className="mx-6" />,
};
