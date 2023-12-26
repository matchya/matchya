import { Meta, StoryObj } from '@storybook/react';

import { ChecklistTable as Component } from '@/components/ui/Table/ChecklistTable/ChecklistTable';
import { mockChecklist } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Checklist: Story = {
  render: () => <Component checklist={mockChecklist} />,
};
