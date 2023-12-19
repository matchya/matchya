import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { PositionSwitcher as Component } from './PositionSwitcher';

const meta: Meta<typeof Component> = {
  title: 'Component',
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

export const PositionSwitcher: Story = {
  render: () => {
    const selectedPosition = {
      id: '1',
      name: 'Position 1',
      checklist_status: 'some_status',
      checklist: {
        id: '1',
        repository_names: ['repo1', 'repo2'],
        candidates: [
          {
            id: '1',
            first_name: 'Candidate',
            last_name: 'One',
            email: 'candidate1@example.com',
            github_username: 'candidate1',
            total_score: 100,
            summary: 'Summary for candidate 1',
            assessments: [],
          },
          {
            id: '2',
            first_name: 'Candidate',
            last_name: 'Two',
            email: 'candidate2@example.com',
            github_username: 'candidate2',
            total_score: 90,
            summary: 'Summary for candidate 2',
            assessments: [],
          },
        ],
        criteria: [
          {
            id: '1',
            message: 'Criteria message 1',
            keywords: ['keyword1', 'keyword2'],
            created_at: '2022-01-01T00:00:00Z',
          },
          {
            id: '2',
            message: 'Criteria message 2',
            keywords: ['keyword3', 'keyword4'],
            created_at: '2022-01-02T00:00:00Z',
          },
        ],
      },
    };

    const positions = [
      selectedPosition,
      {
        id: '2',
        name: 'Position 2',
        checklist_status: 'some_status',
        checklist: {
          id: '1',
          repository_names: ['repo1', 'repo2'],
          candidates: [
            {
              id: '1',
              first_name: 'Candidate',
              last_name: 'One',
              email: 'candidate1@example.com',
              github_username: 'candidate1',
              total_score: 100,
              summary: 'Summary for candidate 1',
              assessments: [],
            },
            {
              id: '2',
              first_name: 'Candidate',
              last_name: 'Two',
              email: 'candidate2@example.com',
              github_username: 'candidate2',
              total_score: 90,
              summary: 'Summary for candidate 2',
              assessments: [],
            },
          ],
          criteria: [
            {
              id: '1',
              message: 'Criteria message 1',
              keywords: ['keyword1', 'keyword2'],
              created_at: '2022-01-01T00:00:00Z',
            },
            {
              id: '2',
              message: 'Criteria message 2',
              keywords: ['keyword3', 'keyword4'],
              created_at: '2022-01-02T00:00:00Z',
            },
          ],
        },
      },
    ];

    return (
      <Component
        className="mx-6"
        positions={positions}
        selectedPosition={selectedPosition}
        selectPosition={() => {}}
      />
    );
  },
};
