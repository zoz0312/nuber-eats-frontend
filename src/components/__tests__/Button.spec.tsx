import React from 'react';
import Button from '../Button';
import { render } from '@testing-library/react';

describe('<Button />', () => {
  it('Render OK with props', () => {
    const { debug, getByText, rerender, container } = render(
      <Button
        canClick={true}
        loading={false}
        actionText={'test'}
      />
    );
    getByText('test');
    rerender(
      <Button
        canClick={false}
        loading={true}
        actionText={'test'}
      />
    );
    getByText('Loadding...');
    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});