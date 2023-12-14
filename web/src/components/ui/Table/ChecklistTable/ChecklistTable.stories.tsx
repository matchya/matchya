import { Meta, StoryObj } from '@storybook/react';

import { ChecklistTable as Component } from '@/components/ui/Table/ChecklistTable/ChecklistTable';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const checklist = [
  {
    id: '1',
    message: 'First message',
    created_at: '2022-01-01',
    keywords: ['react', 'typescript', 'firebase', 'yo'],
    description: 'This is a description for the first item in the checklist',
  },
  {
    id: '2',
    message: 'Second message',
    created_at: '2022-01-02',
    keywords: ['react', 'typescript'],
    description: 'This is a description for the second item in the checklist',
  },
  {
    id: '3',
    message: 'Third message',
    created_at: '2022-01-03',
    keywords: ['react', 'typescript'],
    description: 'This is a description for the third item in the checklist',
  },
  {
    id: '4',
    message: 'Fourth message',
    created_at: '2022-01-04',
    keywords: ['react', 'typescript'],
    description: 'This is a description for the fourth item in the checklist',
  },
  {
    id: '5',
    message: 'Fifth message',
    created_at: '2022-01-05',
    keywords: ['react', 'typescript'],
    description: 'This is a description for the fifth item in the checklist',
  },
];

export const Checklist: Story = {
  render: () => <Component checklist={checklist} />,
};
