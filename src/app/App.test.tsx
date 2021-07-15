import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('MDEditor commands code `ctrlcmd+j`', async () => {
  const { getByTitle } = render(<App />);
  // const input = getByTitle('test');
  fireEvent.keyDown(document, { key: 'J', code: 'KeyJ', ctrlKey: true, shiftKey: true });
  // expect(handleChange).toHaveReturnedWith('```\nHello\n```');
});
