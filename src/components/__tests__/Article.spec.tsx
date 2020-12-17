import React from 'react';
import { render } from '@testing-library/react';
import Article from '../Article';

jest.mock('../Loading', () => {
  return () => <span>Loading</span>
});

describe('<Article />', () => {
  it('Article Render', () => {
    const { getByText, rerender, container } = render(
      <Article
        loading={false}
        className={``}
      />
    );
    expect(container.firstChild).toHaveClass('common-article');
    rerender(
      <Article
        loading={true}
        className={``}
      />
    );
    getByText('Loading');
  });
});