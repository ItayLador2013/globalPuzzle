import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingTextAnimation = ({ text, speed }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    let timer = setInterval(() => {
      if (visibleText.length === text.length) {
        setVisibleText('');
        return;
      }

      setVisibleText(text.slice(0, visibleText.length + 1));
    }, speed);

    return () => clearInterval(timer);
  }, [visibleText]);

  return <Text style={{color: "white", fontSize: 16}}>{visibleText}</Text>;
};

export default TypingTextAnimation; 