import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidatesPage';

import { Header } from '@/components';
import { mockedCandidates } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidatesPage: Story = {
  render: () => (
    <>
      <Header />
      <Component candidates={mockedCandidates} isLoading={false} />
    </>
  ),
};
