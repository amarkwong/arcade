import { Story, Meta } from '@storybook/react';
import { GameSlot, GameSlotProps } from './GameSlot';

export default {
  title: 'Components/GameSlot',
  component: GameSlot,
} as Meta;

const Template: Story<GameSlotProps> = (args) => <GameSlot {...args} />;

export const Default = Template.bind({});
Default.args = {
  href: '/game1',
  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYY3OsM-omdLPBKjEn0-sWVC_CDVMFLgKA4A&usqp=CAU',
  caption: 'Emoji Movie',
};