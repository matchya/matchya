import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AllCandidatesCard as Component } from './AllCandidatesCard';

import { Candidate } from '@/types';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AllCandidates: Story = {
  render: () => {
    const candidates: Candidate[] = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        github_username: 'johndoe',
        total_score: 85,
        summary: 'Experienced software developer',
        status: 'active',
        created_at: '2022-01-01T00:00:00Z',
        assessments: [
          {
            criterion: {
              id: '1',
              keywords: ['Problem Solving'],
              message: 'Ability to solve problems',
              created_at: '2022-01-01T00:00:00Z',
            },
            score: 4,
            reason: 'Good problem solving skills',
          },
          {
            criterion: {
              id: '2',
              keywords: ['Communication'],
              message: 'Ability to communicate effectively',
              created_at: '2022-01-01T00:00:00Z',
            },
            score: 4,
            reason: 'Good communication skills',
          },
        ],
      },
      {
        id: '2',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        github_username: 'janedoe',
        total_score: 90,
        summary: 'Skilled frontend developer',
        status: 'active',
        created_at: '2022-01-01T00:00:00Z',
        assessments: [
          {
            criterion: {
              id: '1',
              keywords: ['Problem Solving'],
              message: 'Ability to solve problems',
              created_at: '2022-01-01T00:00:00Z',
            },
            score: 5,
            reason: 'Excellent problem solving skills',
          },
          {
            criterion: {
              id: '2',
              keywords: ['Communication'],
              message: 'Ability to communicate effectively',
              created_at: '2022-01-01T00:00:00Z',
            },
            score: 4,
            reason: 'Good communication skills',
          },
        ],
      },
    ];
    return <Component candidates={candidates} />;
  },
};
