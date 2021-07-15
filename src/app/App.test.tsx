import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('App Click!`', async () => {
  const { getByTitle } = render(<App />);
  fireEvent.keyDown(document, { key: 'J', code: 'KeyJ', ctrlKey: true, shiftKey: true });
  const input = getByTitle('event.keyCode');
  expect(input.className).toEqual('deprecated');
  fireEvent.click(input);
  fireEvent.click(input);
  expect(input.parentElement!.className).toEqual('w-copy-to-clipboard copied');
});
