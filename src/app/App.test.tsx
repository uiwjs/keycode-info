import { render, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders with text "Press any key to get the JavaScript event keycode"', () => {
    let container: HTMLDivElement | null = null;
    act(() => {
      container = render(<App />).container as HTMLDivElement;
    });
    expect((container as unknown as HTMLDivElement).textContent).toBe('Press any key to get the JavaScript event keycode');
    expect(container).toMatchSnapshot();
  });
});
