import { Meta, StoryObj } from '@storybook/react';

import { ChecklistTable as Component } from '@/components/ui/ChecklistTable/ChecklistTable';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const checklist = [
  {
    keywords: ['react', 'typescript', 'firebase', 'yo'],
    description: 'This is a description for the first item in the checklist',
  },
  {
    keywords: ['react', 'typescript'],
    description: 'This is a description for the second item in the checklist',
  },
  {
    keywords: ['react', 'typescript'],
    description: 'This is a description for the third item in the checklist',
  },
  {
    keywords: ['react', 'typescript'],
    description: 'This is a description for the fourth item in the checklist',
  },
  {
    keywords: ['react', 'typescript'],
    description: 'This is a description for the fifth item in the checklist',
  },
];

export const Checklist: Story = {
  render: () => <Component checklist={checklist} />,
};
