'use client';

import { useState, useEffect } from 'react';

export default function TypedText({ items = ['Designer', 'Developer', 'Freelancer', 'Photographer'] }) {
  const [text, setText] = useState('');
  const [itemIndex, setItemIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const currentWord = items[itemIndex % items.length].trim();
    let timer;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, 110);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, 60);
      } else {
        setIsDeleting(false);
        setItemIndex((prev) => (prev + 1) % items.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, itemIndex, items]);

  return (
    <span className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 font-bold">
      <span>{text}</span>
      <span className="inline-block w-[3px] h-6 ml-1 bg-cyan-400 animate-pulse" />
    </span>
  );
}
