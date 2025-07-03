
import { useEffect, useRef, useState } from 'react';

const scrambleEffect = (targetText, ref, onDone) => {
  const chars = '!@#$%^&*()_+-=[]{}|;:",.<>?';
  let iterations = 0;
  const interval = setInterval(() => {
    const scrambled = targetText
      .split('')
      .map((char, i) =>
        i < iterations ? char : chars[Math.floor(Math.random() * chars.length)]
      )
      .join('');
    if (ref.current) ref.current.textContent = scrambled;
    iterations += 1 / 2;
    if (iterations >= targetText.length) {
      clearInterval(interval);
      if (ref.current) ref.current.textContent = targetText;
      if (onDone) onDone();
    }
  }, 5);
};

const RevealOnce = ({ text = '' }) => {
  const ref = useRef();
  const [prevText, setPrevText] = useState('');

  useEffect(() => {
    if (!text || text === prevText) return;
    scrambleEffect(text, ref, () => setPrevText(text));
  }, [text]);

  return (
    <span
      ref={ref}
      style={{
        fontFamily: 'monospace',
        userSelect: 'none',
        whiteSpace: 'pre',
      }}
    >
      {'*'.repeat(text.length)}
    </span>
  );
};

const RevealOnHover = ({ text = '' }) => {
  const ref = useRef();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMouseEnter = () => {
    if (ref.current?.textContent === text) return;
    scrambleEffect(text, ref, () => setRevealed(true));
  };

  const handleMouseLeave = () => {
    if (!revealed) return;
    scrambleEffect(text, ref, () => {
      if (ref.current) ref.current.textContent = '*'.repeat(text.length);
      setRevealed(false);
    }, '*'.repeat(text.length));
  };

  const handleClick = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={copied ? 'Copied!' : 'Click to copy'}
      style={{
        fontFamily: 'monospace',
        userSelect: 'none',
        whiteSpace: 'pre',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
        color: copied ? 'var(--color3)' : 'inherit',
      }}
    >
      {'*'.repeat(text.length)}
    </span>
  );
};
export { RevealOnHover, RevealOnce };

