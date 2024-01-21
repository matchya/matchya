import { Meta, StoryObj } from '@storybook/react';

import Component from './SettingsPage';

import { mockedCompanyInfo } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const SettingsPage: Story = {
  render: () => (
    <Component
      companyName={mockedCompanyInfo.name}
      email={mockedCompanyInfo.email}
      githubUsername={mockedCompanyInfo.githubUsername}
      onSubmit={() => {}}
      onCompanyNameChange={() => {}}
      onEmailChange={() => {}}
      onGithubUsernameChange={() => {}}
    />
  ),
};
