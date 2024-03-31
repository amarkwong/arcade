import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Coverflow from './Coverflow';

export default {
  title: 'components/Coverflow',
  component: Coverflow,
} as Meta;

const Template: Story<{ covers: string[] }> = (args) => <Coverflow {...args} />;


const movieCards= [
  {
    movie: 'https://m.media-amazon.com/images/M/MV5BNmQ0ODBhMjUtNDRhOC00MGQzLTk5MTAtZDliODg5NmU5MjZhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg',
    emoji: '🧙💎',
    riddler: 'Feifan'
  },
  {
    movie:'https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTAtYmU5Mi00NGRmLTljYjgtMDkyODQ4MjNkMGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    emoji: '🗡️💵⃣️⃣',
    riddler: 'Feifan'
  },
  {
    movie: 'https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg',
    emoji: '️⛓️‍💥🤠',
    riddler: 'Feifan'
  }
]


const covers = movieCards.map((card) => card.movie);

export const Default = Template.bind({});
Default.args = {
  cards: movieCards,
  covers: covers
};