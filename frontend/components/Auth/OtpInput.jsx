'use client';

import React, { useRef } from 'react';

// One box per digit: typing moves forward, Backspace moves back, and pasting
// (or SMS autofill into the first box) spreads the code across all boxes.
const OtpInput = ({ value, onChange, length = 6, autoFocus = false, disabled = false }) => {
  const inputs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const focusBox = (index) => {
    const box = inputs.current[Math.max(0, Math.min(index, length - 1))];
    box?.focus();
    box?.select();
  };

  const fillFrom = (index, text) => {
    const incoming = text.replace(/\D/g, '');
    if (!incoming) return;
    const next = [...digits];
    incoming.slice(0, length - index).split('').forEach((d, i) => { next[index + i] = d; });
    onChange(next.join('').slice(0, length));
    focusBox(index + incoming.length);
  };

  const handleChange = (index, e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    // More than one character means autofill or a fast paste into a single box
    if (typed.length > 1) return fillFrom(index, typed);
    const next = [...digits];
    next[index] = typed;
    onChange(next.join(''));
    focusBox(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        focusBox(index - 1);
      }
      onChange(next.join(''));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    fillFrom(index, e.clipboardData.getData('text'));
  };

  return (
    <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={i === 0 ? length : 1}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          aria-label={`OTP digit ${i + 1}`}
          className={`w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold caret-transparent selection:bg-transparent border rounded-xl ${digit ? 'bg-white border-primary/50' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 disabled:opacity-50`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
