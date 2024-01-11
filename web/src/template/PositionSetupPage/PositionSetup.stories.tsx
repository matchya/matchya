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
      <Header />
      <Component
        inputRef={{} as React.RefObject<HTMLInputElement>}
        isLoading={false}
        phase={1}
        selectedRepositories={[]}
        integrateGitHub={() => {}}
        handleNext={() => {}}
        handlePrev={() => {}}
        handleUnselect={() => {}}
        handleKeyDown={() => {}}
        handleAddItem={() => {}}
        selectedType="frontend"
        selectedLevel="mid"
        handleSelectType={() => {}}
        handleSelectLevel={() => {}}
      />
    </>
  ),
};
