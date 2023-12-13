import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ChecklistSheet } from './ChecklistSheet';

import { Button } from '@/components/ui/Button/Button';
import { Sheet, SheetTrigger } from '@/components/ui/Sheet/Sheet';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Checklist: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <ChecklistSheet />
    </Sheet>
  ),
};
