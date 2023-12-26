import { Meta, StoryObj } from '@storybook/react';

import { CandidateDetailCard as Component } from './CandidateDetailCard';

import { Candidate } from '@/types';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidateDetail: Story = {
  render: () => {
    const candidate: Candidate = {
      id: '2',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      github_username: 'janedoe',
      total_score: 90,
      summary: 'Skilled frontend developer',
      status: 'succeeded',
      created_at: '2022-01-01T00:00:00Z',
      assessments: [
        {
          criterion: {
            id: '1',
            keywords: ['skill 1'],
            message: 'Problem Solving',
            created_at: '2022-01-01T00:00:00Z',
          },
          score: 5,
          reason: 'Excellent problem solving skills',
        },
        {
          criterion: {
            id: '2',
            keywords: ['skill 1'],
            message: 'Communication',
            created_at: '2022-01-01T00:00:00Z',
          },
          score: 4,
          reason: 'Good communication skills',
        },
      ],
    };
    return <Component candidate={candidate} />;
  },
};
