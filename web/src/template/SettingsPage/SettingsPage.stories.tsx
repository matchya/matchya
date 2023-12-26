import { Meta, StoryObj } from '@storybook/react';

import Component from './SettingsPage';

import { mockCompanyInfo } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const SettingsPage: Story = {
  render: () => (
    <Component
      companyName={mockCompanyInfo.name}
      email={mockCompanyInfo.email}
      githubUsername={mockCompanyInfo.github_username}
      onSubmit={() => {}}
      onCompanyNameChange={() => {}}
      onEmailChange={() => {}}
      onGithubUsernameChange={() => {}}
    />
  ),
};
