import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Component from './Dashboard';

import { Header } from '@/components/ui/Header/Header';
import { Position } from '@/types';

const meta: Meta<typeof Component> = {
  title: 'Template',
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

export const Dashboard: Story = {
  render: () => {
    const positions: Position[] = [
      {
        id: '1',
        name: 'Position 1',
        checklist: {
          id: '1',
          repository_names: ['Repo 1', 'Repo 2'],
          criteria: [],
          candidates: [],
        },
        checklist_status: 'active',
      },
      {
        id: '2',
        name: 'Position 2',
        checklist: {
          id: '2',
          repository_names: ['Repo 3', 'Repo 4'],
          criteria: [],
          candidates: [],
        },
        checklist_status: 'active',
      },
    ];

    const selectedPosition: Position = {
      id: '1',
      name: 'Position 1',
      checklist: {
        id: '1',
        repository_names: ['Repo 1', 'Repo 2'],
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
        candidates: [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            github_username: 'johndoe',
            total_score: 100,
            summary: 'Summary 1',
            assessments: [],
          },
          {
            id: '2',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane.doe@example.com',
            github_username: 'janedoe',
            total_score: 90,
            summary: 'Summary 2',
            assessments: [],
          },
        ],
      },
      checklist_status: 'active',
    };
    const selectedCandidateId = '1';

    return (
      <>
        <Header
          positions={positions}
          selectPosition={() => {}}
          selectedPosition={selectedPosition}
          abbreviatedName="KO"
          companyName={'Coinmiles'}
          email={'email'}
          handleLogout={() => {}}
        />
        <Component
          selectedPosition={selectedPosition}
          selectedCandidateId={selectedCandidateId}
          onCandidateSelect={() => {}}
        />
      </>
    );
  },
};
