import { StoryFn } from '@storybook/react';
import { Header } from '../src/components';

export const LayoutDecorator = (Story: StoryFn) => (
  <>
    <Header />
    <div className="mx-auto max-w-[1280px]">
      <Story />
    </div>
  </>
);
