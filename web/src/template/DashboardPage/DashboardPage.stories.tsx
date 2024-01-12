import { Meta, StoryObj } from '@storybook/react';

import Component from './DashboardPage';

import { Header } from '@/components';
import {
  mockedPositions,
  mockedSelectedCandidate,
  mockedSelectedPosition,
} from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template/DashboardPage',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const GithubAnalysis: Story = {
  render: () => (
    <>
      <Header />
      <Component
        positions={mockedPositions}
        selectedPosition={mockedSelectedPosition}
        selectedCandidate={mockedSelectedCandidate}
      />
    </>
  ),
};

export const InterviewQuestions: Story = {
  render: () => (
    <>
      <Header />
      <Component
        positions={mockedPositions}
        selectedPosition={mockedSelectedPosition}
        selectedCandidate={mockedSelectedCandidate}
      />
    </>
  ),
};
