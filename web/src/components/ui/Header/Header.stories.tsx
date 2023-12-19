import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Header as Component } from './Header';

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

export const Header: Story = {
  render: () => (
    <Component
      abbreviatedName="JD"
      companyName="Acme Corp"
      email="johndoe@acme.com"
      handleLogout={() => console.log('Logout')}
      positions={[
        { id: '1', name: 'Position 1' },
        { id: '2', name: 'Position 2' },
      ]}
      selectPosition={position => console.log(position)}
      selectedPosition={{ id: '1', name: 'Position 1' }}
    />
  ),
};
