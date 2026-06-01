import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardContent } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Hello world</p></Card>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="my-custom">Content</Card>);
    expect(container.firstChild).toHaveClass('my-custom');
  });

  it('applies hover class when hover prop is true', () => {
    const { container } = render(<Card hover>Hoverable</Card>);
    expect((container.firstChild as HTMLElement).className).toContain('hover:shadow-md');
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader><h2>Title</h2></CardHeader>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent><span>Body text</span></CardContent>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });
});
