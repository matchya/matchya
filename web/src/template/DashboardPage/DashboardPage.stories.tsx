import { Meta, StoryObj } from '@storybook/react';

import Component from './DashboardPage';

import { Header } from '@/components';
import {
  mockPositions,
  mockSelectedCandidate,
  mockSelectedPosition,
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
      <Header authenticated={true} />
      <Component
        positions={mockPositions}
        selectedPosition={mockSelectedPosition}
        selectedCandidate={mockSelectedCandidate}
      />
    </>
  ),
};

export const InterviewQuestions: Story = {
  render: () => (
    <>
      <Header authenticated={true} />
      <Component
        positions={mockPositions}
        selectedPosition={mockSelectedPosition}
        selectedCandidate={mockSelectedCandidate}
      />
    </>
  ),
};
