import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidatesPage';

import { Header } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidatesPage: Story = {
  render: () => (
    <>
      <Header />
      <Component />
    </>
  ),
};
