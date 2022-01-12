import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('App Click!`', async () => {
  render(<App />);
  fireEvent.keyDown(document, { key: 'J', code: 'KeyJ', ctrlKey: true, shiftKey: true });
  const input = screen.getByTitle<HTMLElement>('event.keyCode');
  expect(input.className).toEqual('deprecated');
  fireEvent.click(input);
  fireEvent.click(input);
  // eslint-disable-next-line testing-library/no-node-access
  expect(input.parentElement?.className).toEqual('w-copy-to-clipboard copied');
});
