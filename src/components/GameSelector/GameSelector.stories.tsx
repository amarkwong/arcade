import { Story, Meta } from '@storybook/react/types-6-0';
import { GameSelector } from './GameSelector';

export default {
  title: 'Components/GameSelector',
  component: GameSelector,
} as Meta;

const Template: Story = (args) => <GameSelector {...args} />;

export const Default = Template.bind({});