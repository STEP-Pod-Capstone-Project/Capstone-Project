import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders TestApi test', () => {
  render(<App />);
  const testApiID = document.getElementById("testApiID")
  expect(testApiID).toBeInTheDocument();
});