import { Meta, StoryObj } from '@storybook/react';

import Component from './PositionSetupPage';

import { Header } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const PositionSetupPage: Story = {
  render: () => (
    <>
      <Header authenticated={true} />
      <Component
        selectedType="frontend"
        selectedLevel="mid"
        handleSelectType={() => {}}
        handleSelectLevel={() => {}}
        handleSubmit={() => {}}
      />
    </>
  ),
};
