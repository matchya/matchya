import { Meta, StoryObj } from '@storybook/react';

import Home from './Home';

export default {
  title: 'Components/Home',
  component: Home,
} as Meta;

export const Default: StoryObj<typeof Home> = {
  args: {},
};
