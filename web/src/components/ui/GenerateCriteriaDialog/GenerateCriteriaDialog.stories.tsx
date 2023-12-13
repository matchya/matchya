import { Meta, StoryObj } from '@storybook/react';

import { GenerateCriteriaDialog } from './GenerateCriteriaDialog';

const meta: Meta<typeof GenerateCriteriaDialog> = {
  component: GenerateCriteriaDialog,
};

export default meta;

type Story = StoryObj<typeof GenerateCriteriaDialog>;

export const Default: Story = {
  render: () => <GenerateCriteriaDialog />,
};
