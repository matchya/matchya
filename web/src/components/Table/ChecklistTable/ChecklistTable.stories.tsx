import { Meta, StoryObj } from '@storybook/react';

import Component from '@/components/Table/ChecklistTable/ChecklistTable';
import { mockedChecklist } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Checklist: Story = {
  render: () => <Component checklist={mockedChecklist} />,
};
