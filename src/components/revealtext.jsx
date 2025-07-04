
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [copied, setCopied] = useState(false);
  const [prevText, setPrevText] = useState('');

  useEffect(() => {
    if (!text || text === prevText) return;
    scrambleEffect(text, ref, () => setPrevText(text));
  }, [text]);

  const handleClick = async () => {
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


const RevealOnHover = ({ text = "" }) => {
  const ref = useRef();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile || ref.current?.textContent === text) return;
    scrambleEffect(text, ref, () => setRevealed(true));
  };

  const handleMouseLeave = () => {
    if (isMobile || !revealed) return;
    scrambleEffect(
      text,
      ref,
      () => {
        if (ref.current) ref.current.textContent = "*".repeat(text.length);
        setRevealed(false);
      },
      "*".repeat(text.length)
    );
  };
  const toggleReveal = (e) => {
    e.stopPropagation();

    if (revealed) {
      if (ref.current) {
        ref.current.textContent = "*".repeat(text.length);
      }
      setRevealed(false);
    } else {
      scrambleEffect(text, ref, () => setRevealed(true));
    }
  };
  const handleCopy = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        fontFamily: "monospace",
      }}
    >
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        style={{
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: copied ? 'var(--color3)' : 'inherit',
        }}
      >
        {"*".repeat(text.length)}
      </span>
      <span
        onClick={toggleReveal}
        style={{ marginLeft: "8px", cursor: "pointer" }}
        title={revealed ? "Hide password" : "Show password"}
      >
        {revealed ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export { RevealOnHover, RevealOnce };

