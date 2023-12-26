import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ChecklistSheet as Component } from './ChecklistSheet';

import { Button } from '@/components/ui/Button/Button';
import { Sheet, SheetTrigger } from '@/components/ui/Sheet/Sheet';
import { Position } from '@/types';

const meta: Meta<typeof Component> = {
  title: 'Component/Sheet',
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

export const Checklist: Story = {
  render: () => {
    const position: Position = {
      id: '1',
      name: 'Position 1',
      checklist_status: 'succeeded',
      checklist: {
        id: '1',
        repository_names: ['repo1', 'repo2'],
        criteria: [
          {
            id: '1',
            message: 'Criteria 1',
            keywords: ['keyword1', 'keyword2'],
            created_at: '2022-01-01T00:00:00Z',
          },
          {
            id: '2',
            message: 'Criteria 2',
            keywords: ['keyword3', 'keyword4'],
            created_at: '2022-01-02T00:00:00Z',
          },
        ],
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
          status: 'status1',
          created_at: '2022-01-01T00:00:00Z',
          assessments: [
            {
              criterion: {
                id: '1',
                message: 'Criteria 1',
                keywords: ['keyword1', 'keyword2'],
                created_at: '2022-01-01T00:00:00Z',
              },
              score: 5,
              reason: '',
            },
            {
              criterion: {
                id: '2',
                message: 'Criteria 2',
                keywords: ['keyword3', 'keyword4'],
                created_at: '2022-01-02T00:00:00Z',
              },
              score: 4,
              reason: '',
            },
          ],
        },
      ],
    };
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <Component selectedPosition={position} />
      </Sheet>
    );
  },
};
