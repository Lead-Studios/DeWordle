import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualKeyboard, KeyStatus } from '../components/VirtualKeyboard';

describe('VirtualKeyboard', () => {
  it('renders all letter keys', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    expect(screen.getByRole('button', { name: /letter q/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /letter p/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /letter a/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /letter l/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /letter m/i })).toBeInTheDocument();
  });

  it('renders ENTER and BACKSPACE action keys', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    expect(screen.getByRole('button', { name: /submit word/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete last letter/i })).toBeInTheDocument();
  });

  it('calls onKeyPress with correct letter when key clicked', () => {
    const onKeyPress = vi.fn();
    render(<VirtualKeyboard onKeyPress={onKeyPress} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /letter q/i }));
    expect(onKeyPress).toHaveBeenCalledWith('Q');
  });

  it('calls onEnter when ENTER clicked', () => {
    const onEnter = vi.fn();
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={onEnter} onBackspace={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('calls onBackspace when BACKSPACE clicked', () => {
    const onBackspace = vi.fn();
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={onBackspace} />);
    fireEvent.click(screen.getByRole('button', { name: /delete last letter/i }));
    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it('applies correct status styles', () => {
    const statuses: Record<string, KeyStatus> = { Q: 'correct', W: 'present', E: 'absent' };
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} keyStatuses={statuses} />);
    const qButton = screen.getByRole('button', { name: /letter q/i });
    expect(qButton.className).toContain('bg-[var(--tile-correct)]');
    const wButton = screen.getByRole('button', { name: /letter w/i });
    expect(wButton.className).toContain('bg-[var(--tile-present)]');
  });

  it('disables all keys when disabled prop is true', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} disabled={true} />);
    const qButton = screen.getByRole('button', { name: /letter q/i });
    expect(qButton).toBeDisabled();
    const enterButton = screen.getByRole('button', { name: /submit word/i });
    expect(enterButton).toBeDisabled();
  });

  it('has accessible group label', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    expect(screen.getByRole('group', { name: /virtual keyboard/i })).toBeInTheDocument();
  });

  it('renders 3 rows of keys', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    const group = screen.getByRole('group', { name: /virtual keyboard/i });
    expect(group.children.length).toBe(3);
  });

  it('defaults idle status for keys without explicit status', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    const qButton = screen.getByRole('button', { name: /letter q/i });
    expect(qButton.className).toContain('bg-dark-300');
  });
});
