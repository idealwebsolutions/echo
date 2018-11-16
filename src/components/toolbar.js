import React from 'react';
import Style from 'style-it';

const Level = ({ children }) => (
  <Style>
    {` 
      .level { 
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 1px;
        margin-bottom: 5px;
      } 
    `}
    <nav className="level">{children}</nav>
  </Style>
)

const LevelItem = (props) => (
  <Style>
    {`
      .level-item {
        flex: ${props.flex};
      }
    `}
    <div className="level-item">{props.children}</div>
  </Style>
)

const options = [
  { value: 'new', label: 'Sort by Newest' },
  { value: 'old', label: 'Sort by Oldest' },
  { value: 'best', label: 'Sort by Best' }
]

export default (props) =>
  <Level>
    <LevelItem flex={5}>0 comments</LevelItem>
    <LevelItem></LevelItem>
  </Level>
