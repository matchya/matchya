import { Meta, StoryObj } from '@storybook/react';

import Dashboard from './Dashboard';

export default {
  title: 'Screens/Dashboard',
  component: Dashboard,
} as Meta;

export const Default: StoryObj<typeof Dashboard> = {
  args: {},
};
