import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualKeyboard, KeyStatus } from './VirtualKeyboard';

describe('VirtualKeyboard', () => {
  it('renders all letter keys', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Letter Q/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Letter A/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Letter Z/i })).toBeInTheDocument();
  });

  it('renders ENTER and BACKSPACE action keys', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Submit word/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete last letter/i })).toBeInTheDocument();
  });

  it('calls onKeyPress with correct letter when key is clicked', () => {
    const onKeyPress = vi.fn();
    render(<VirtualKeyboard onKeyPress={onKeyPress} onEnter={vi.fn()} onBackspace={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Letter Q/i }));
    expect(onKeyPress).toHaveBeenCalledWith('Q');
  });

  it('calls onEnter when ENTER is clicked', () => {
    const onEnter = vi.fn();
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={onEnter} onBackspace={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Submit word/i }));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('calls onBackspace when BACKSPACE is clicked', () => {
    const onBackspace = vi.fn();
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={onBackspace} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete last letter/i }));
    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it('applies correct green background for correct status', () => {
    const keyStatuses: Record<string, KeyStatus> = { A: 'correct' };
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} keyStatuses={keyStatuses} />);
    const key = screen.getByRole('button', { name: /Letter A/i });
    expect(key.className).toContain('bg-[var(--tile-correct)]');
  });

  it('applies yellow background for present status', () => {
    const keyStatuses: Record<string, KeyStatus> = { B: 'present' };
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} keyStatuses={keyStatuses} />);
    const key = screen.getByRole('button', { name: /Letter B/i });
    expect(key.className).toContain('bg-[var(--tile-present)]');
  });

  it('applies dark gray background for absent status', () => {
    const keyStatuses: Record<string, KeyStatus> = { C: 'absent' };
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} keyStatuses={keyStatuses} />);
    const key = screen.getByRole('button', { name: /Letter C/i });
    expect(key.className).toContain('bg-[var(--tile-absent)]');
  });

  it('disables all keys when disabled prop is true', () => {
    render(<VirtualKeyboard onKeyPress={vi.fn()} onEnter={vi.fn()} onBackspace={vi.fn()} disabled />);
    const keys = screen.getAllByRole('button');
    keys.forEach((key) => {
      expect(key).toBeDisabled();
    });
  });

  it('does not call handlers when disabled', () => {
    const onKeyPress = vi.fn();
    const onEnter = vi.fn();
    const onBackspace = vi.fn();
    render(<VirtualKeyboard onKeyPress={onKeyPress} onEnter={onEnter} onBackspace={onBackspace} disabled />);
    fireEvent.click(screen.getByRole('button', { name: /Letter Q/i }));
    fireEvent.click(screen.getByRole('button', { name: /Submit word/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete last letter/i }));
    expect(onKeyPress).not.toHaveBeenCalled();
    expect(onEnter).not.toHaveBeenCalled();
    expect(onBackspace).not.toHaveBeenCalled();
  });
});

describe('VirtualKeyboard keyboard navigation', () => {
  const setup = (props: Partial<React.ComponentProps<typeof VirtualKeyboard>> = {}) => {
    const handlers = { onKeyPress: vi.fn(), onEnter: vi.fn(), onBackspace: vi.fn() };
    render(<VirtualKeyboard {...handlers} {...props} />);
    return handlers;
  };
  const key = (name: RegExp) => screen.getByRole('button', { name });
  const press = (el: HTMLElement, pressed: string) => fireEvent.keyDown(el, { key: pressed });
  const focusOn = (name: RegExp) => act(() => key(name).focus());

  describe('Tab moves between rows', () => {
    it('exposes exactly one tab stop per row (the first key by default)', () => {
      setup();
      const tabStops = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '0');
      expect(tabStops.map((b) => b.getAttribute('aria-label'))).toEqual([
        'Letter Q',
        'Letter A',
        'Submit word',
      ]);
    });

    it('keeps every other key out of the Tab order', () => {
      setup();
      const offStops = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '-1');
      expect(offStops).toHaveLength(26 + 2 - 3);
    });

    it('remembers the last focused key of a row as that row\'s tab stop', () => {
      setup();
      focusOn(/Letter W/i);
      focusOn(/Letter S/i);
      expect(key(/Letter W/i)).toHaveAttribute('tabindex', '0');
      expect(key(/Letter S/i)).toHaveAttribute('tabindex', '0');
      expect(key(/Letter Q/i)).toHaveAttribute('tabindex', '-1');
      expect(key(/Letter A/i)).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus to the key above or below with the vertical arrows', () => {
      setup();
      focusOn(/Letter Q/i);
      press(key(/Letter Q/i), 'ArrowDown');
      expect(key(/Letter A/i)).toHaveFocus();
      press(key(/Letter A/i), 'ArrowDown');
      expect(key(/Submit word/i)).toHaveFocus();
      press(key(/Submit word/i), 'ArrowUp');
      expect(key(/Letter A/i)).toHaveFocus();
    });

    it('stays put at the top and bottom edges', () => {
      setup();
      focusOn(/Letter Q/i);
      press(key(/Letter Q/i), 'ArrowUp');
      expect(key(/Letter Q/i)).toHaveFocus();
      focusOn(/Letter Z/i);
      press(key(/Letter Z/i), 'ArrowDown');
      expect(key(/Letter Z/i)).toHaveFocus();
    });
  });

  describe('arrow keys move within a row', () => {
    it('moves right and left', () => {
      setup();
      focusOn(/Letter Q/i);
      press(key(/Letter Q/i), 'ArrowRight');
      expect(key(/Letter W/i)).toHaveFocus();
      press(key(/Letter W/i), 'ArrowRight');
      expect(key(/Letter E/i)).toHaveFocus();
      press(key(/Letter E/i), 'ArrowLeft');
      expect(key(/Letter W/i)).toHaveFocus();
    });

    it('does not wrap past either end of the row', () => {
      setup();
      focusOn(/Letter Q/i);
      press(key(/Letter Q/i), 'ArrowLeft');
      expect(key(/Letter Q/i)).toHaveFocus();
      focusOn(/Letter P/i);
      press(key(/Letter P/i), 'ArrowRight');
      expect(key(/Letter P/i)).toHaveFocus();
    });

    it('reaches the action keys at the ends of the bottom row', () => {
      setup();
      focusOn(/Submit word/i);
      press(key(/Submit word/i), 'ArrowRight');
      expect(key(/Letter Z/i)).toHaveFocus();
      focusOn(/Letter M/i);
      press(key(/Letter M/i), 'ArrowRight');
      expect(key(/Delete last letter/i)).toHaveFocus();
    });

    it('jumps to the first and last key with Home and End', () => {
      setup();
      focusOn(/Letter G/i);
      press(key(/Letter G/i), 'End');
      expect(key(/Letter L/i)).toHaveFocus();
      press(key(/Letter L/i), 'Home');
      expect(key(/Letter A/i)).toHaveFocus();
    });

    it('prevents the page from scrolling on arrow keys', () => {
      setup();
      focusOn(/Letter Q/i);
      const notPrevented = fireEvent.keyDown(key(/Letter Q/i), { key: 'ArrowRight' });
      expect(notPrevented).toBe(false);
    });
  });

  describe('Enter and Space activate the focused key', () => {
    it.each(['Enter', ' '])('types the focused letter with %j', (activation) => {
      const { onKeyPress, onEnter } = setup();
      focusOn(/Letter G/i);
      press(key(/Letter G/i), activation);
      expect(onKeyPress).toHaveBeenCalledTimes(1);
      expect(onKeyPress).toHaveBeenCalledWith('G');
      expect(onEnter).not.toHaveBeenCalled();
    });

    it.each(['Enter', ' '])('submits the word when the ENTER key is focused and %j is pressed', (activation) => {
      const { onEnter, onKeyPress } = setup();
      focusOn(/Submit word/i);
      press(key(/Submit word/i), activation);
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('activates the on-screen backspace key', () => {
      const { onBackspace } = setup();
      focusOn(/Delete last letter/i);
      press(key(/Delete last letter/i), 'Enter');
      expect(onBackspace).toHaveBeenCalledTimes(1);
    });

    it('fires once per key press, not once more from the browser default', () => {
      const { onKeyPress } = setup();
      focusOn(/Letter T/i);
      const notPrevented = fireEvent.keyDown(key(/Letter T/i), { key: 'Enter' });
      expect(notPrevented).toBe(false);
      expect(onKeyPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Backspace and Delete', () => {
    it.each(['Backspace', 'Delete'])('%s deletes the last letter from any focused key', (deletion) => {
      const { onBackspace, onKeyPress } = setup();
      focusOn(/Letter H/i);
      press(key(/Letter H/i), deletion);
      expect(onBackspace).toHaveBeenCalledTimes(1);
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('works from the ENTER key too', () => {
      const { onBackspace, onEnter } = setup();
      focusOn(/Submit word/i);
      press(key(/Submit word/i), 'Backspace');
      expect(onBackspace).toHaveBeenCalledTimes(1);
      expect(onEnter).not.toHaveBeenCalled();
    });
  });

  describe('focus indication', () => {
    it('gives every key a visible focus ring style', () => {
      setup();
      for (const button of screen.getAllByRole('button')) {
        expect(button.className).toContain('focus-visible:ring-2');
        expect(button.className).toContain('focus:outline-none');
      }
    });

    it('marks exactly one key as the focused element', () => {
      setup();
      focusOn(/Letter D/i);
      expect(document.activeElement).toBe(key(/Letter D/i));
      expect(screen.getAllByRole('button').filter((b) => b === document.activeElement)).toHaveLength(1);
    });
  });

  describe('disabled keyboard', () => {
    it('ignores keyboard activation and deletion', () => {
      const { onKeyPress, onEnter, onBackspace } = setup({ disabled: true });
      const q = key(/Letter Q/i);
      press(q, 'Enter');
      press(q, ' ');
      press(q, 'Backspace');
      press(q, 'Delete');
      expect(onKeyPress).not.toHaveBeenCalled();
      expect(onEnter).not.toHaveBeenCalled();
      expect(onBackspace).not.toHaveBeenCalled();
    });
  });
});
