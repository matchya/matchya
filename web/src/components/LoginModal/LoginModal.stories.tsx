import { Meta, StoryObj } from '@storybook/react';

import LoginModal from './LoginModal';

export default {
  title: 'Components/LoginModal',
  component: LoginModal,
} as Meta;

const Template: StoryObj<typeof LoginModal> = {
  args: {
    login: () => console.log('Logged in'),
  },
};

export const Default = Template;
