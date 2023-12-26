import { Meta, StoryObj } from '@storybook/react';

import { Header as Component } from './Header';

import { Position } from '@/types';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Header: Story = {
  render: () => {
    const selectedPosition: Position = {
      id: '1',
      name: 'Position 1',
      checklist_status: 'status1',
      checklist: {
        id: '1',
        repository_names: ['repo1', 'repo2'],
        criteria: [],
      },
      candidates: [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          github_username: 'johndoe',
          total_score: 85,
          summary: 'Good candidate',
          status: 'reviewed',
          created_at: '2022-01-01T00:00:00Z',
          assessments: [
            {
              criterion: {
                id: '1',
                message: 'Criteria 1',
                keywords: ['keyword1', 'keyword2'],
                created_at: '2022-01-01T00:00:00Z',
              },
              score: 4,
              reason: 'Met all the criteria',
            },
            {
              criterion: {
                id: '2',
                message: 'Criteria 2',
                keywords: ['keyword3', 'keyword4'],
                created_at: '2022-01-02T00:00:00Z',
              },
              score: 3,
              reason: 'Met most of the criteria',
            },
          ],
        },
      ],
    };

    const positions: Position[] = [
      selectedPosition,
      {
        id: '2',
        name: 'Position 2',
        checklist_status: 'status2',
        checklist: {
          id: '2',
          repository_names: ['repo3', 'repo4'],
          criteria: [],
        },
        candidates: [
          {
            id: '2',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane.doe@example.com',
            github_username: 'janedoe',
            total_score: 0,
            summary: 'No summary provided',
            status: 'reviewed',
            created_at: '2022-01-01T00:00:00Z',
            assessments: [],
          },
        ],
      },
    ];

    return (
      <Component
        abbreviatedName="JD"
        companyName="Acme Corp"
        email="johndoe@acme.com"
        handleLogout={() => console.log('Logout')}
        positions={positions}
        selectPosition={position => console.log(position)}
        selectedPosition={selectedPosition}
      />
    );
  },
};
