import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './Header';

export default {
  title: 'Components/Header',
  component: Header,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
} as Meta;

const Template: StoryObj<typeof Header> = {};

export const Default = Template;
