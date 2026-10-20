'use client';

import React, { useCallback, useRef, useState } from 'react';

export type KeyStatus = 'correct' | 'present' | 'absent' | 'idle';

export interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyStatuses?: Record<string, KeyStatus>;
  disabled?: boolean;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

const STATUS_STYLES: Record<KeyStatus, string> = {
  correct: 'bg-[var(--tile-correct)] text-[var(--tile-correct-fg)] border-[var(--tile-correct-border)]',
  present: 'bg-[var(--tile-present)] text-[var(--tile-present-fg)] border-[var(--tile-present-border)]',
  absent: 'bg-[var(--tile-absent)] text-[var(--tile-absent-fg)] border-[var(--tile-absent-border)]',
  idle: 'bg-dark-300 text-white border-dark-400 hover:bg-dark-400',
};

interface KeyButtonProps {
  label: string;
  status: KeyStatus;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
  row: number;
  col: number;
  /** Roving tabindex: only the active key of each row is a Tab stop. */
  tabIndex: 0 | -1;
  onKeyNav: (event: React.KeyboardEvent<HTMLButtonElement>, row: number, col: number) => void;
  onKeyFocus: (row: number, col: number) => void;
  register: (row: number, col: number, element: HTMLButtonElement | null) => void;
}

function areKeyButtonPropsEqual(prev: KeyButtonProps, next: KeyButtonProps): boolean {
  return (
    prev.label === next.label &&
    prev.status === next.status &&
    prev.disabled === next.disabled &&
    prev.wide === next.wide &&
    prev.tabIndex === next.tabIndex &&
    prev.onClick === next.onClick
  );
}

const KeyButton = React.memo(function KeyButton({
  label,
  status,
  onClick,
  disabled = false,
  wide = false,
  row,
  col,
  tabIndex,
  onKeyNav,
  onKeyFocus,
  register,
}: KeyButtonProps) {
  const isAction = label === 'ENTER' || label === 'BACKSPACE';
  const displayLabel = label === 'BACKSPACE' ? '⌫' : label;

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(event) => onKeyNav(event, row, col)}
      onFocus={() => onKeyFocus(row, col)}
      ref={(element) => register(row, col, element)}
      tabIndex={tabIndex}
      disabled={disabled}
      aria-label={label === 'BACKSPACE' ? 'Delete last letter' : label === 'ENTER' ? 'Submit word' : `Letter ${label}`}
      className={`
        flex items-center justify-center rounded-md border font-bold uppercase select-none
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2
        ${wide ? 'w-16 sm:w-20 text-xs' : 'w-9 sm:w-11 text-sm'}
        h-12 sm:h-14
        ${STATUS_STYLES[status]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
    >
      {displayLabel}
    </button>
  );
}, areKeyButtonPropsEqual);

export function VirtualKeyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  keyStatuses = {},
  disabled = false,
}: VirtualKeyboardProps) {
  const handleKeyClick = (key: string) => {
    if (disabled) return;
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  // Roving tabindex: one Tab stop per row (its last-focused key), arrow keys
  // move within and between rows.
  const [activeCols, setActiveCols] = useState<number[]>(() => ROWS.map(() => 0));
  const keyRefs = useRef<(HTMLButtonElement | null)[][]>(ROWS.map((row) => row.map(() => null)));

  const register = useCallback((row: number, col: number, element: HTMLButtonElement | null) => {
    keyRefs.current[row][col] = element;
  }, []);

  const onKeyFocus = useCallback((row: number, col: number) => {
    setActiveCols((current) => (current[row] === col ? current : current.map((c, r) => (r === row ? col : c))));
  }, []);

  const focusKey = (row: number, col: number) => {
    const clampedRow = Math.min(Math.max(row, 0), ROWS.length - 1);
    const clampedCol = Math.min(Math.max(col, 0), ROWS[clampedRow].length - 1);
    keyRefs.current[clampedRow][clampedCol]?.focus();
  };

  const onKeyNav = (event: React.KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusKey(row, col + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusKey(row, col - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusKey(row + 1, col);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusKey(row - 1, col);
        break;
      case 'Home':
        event.preventDefault();
        focusKey(row, 0);
        break;
      case 'End':
        event.preventDefault();
        focusKey(row, ROWS[row].length - 1);
        break;
      case 'Enter':
      case ' ':
        // Handled here (not left to the browser's click synthesis) so Enter and
        // Space behave identically everywhere; preventDefault avoids a second click.
        event.preventDefault();
        handleKeyClick(ROWS[row][col]);
        break;
      case 'Backspace':
      case 'Delete':
        // Delete the last letter from whichever key has focus.
        event.preventDefault();
        if (!disabled) onBackspace();
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5" role="group" aria-label="Virtual keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {row.map((key, colIndex) => (
            <KeyButton
              key={key}
              label={key}
              row={rowIndex}
              col={colIndex}
              tabIndex={activeCols[rowIndex] === colIndex ? 0 : -1}
              onKeyNav={onKeyNav}
              onKeyFocus={onKeyFocus}
              register={register}
              status={keyStatuses[key] ?? 'idle'}
              onClick={() => handleKeyClick(key)}
              disabled={disabled}
              wide={key === 'ENTER' || key === 'BACKSPACE'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
