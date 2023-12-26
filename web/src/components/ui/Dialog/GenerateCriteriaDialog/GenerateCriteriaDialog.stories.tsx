import { Meta, StoryObj } from '@storybook/react';

import { GenerateCriteriaDialog as Component } from './GenerateCriteriaDialog';

const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const GenerateCriteria: Story = {
  render: () => <Component shouldOpen={true} onClose={() => {}} />,
};
