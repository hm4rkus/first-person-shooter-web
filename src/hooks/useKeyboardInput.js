import { useCallback, useEffect, useState } from "react";

export const useKeyboardInput = (keysToListen = []) => {
  const getKeys = useCallback(() => {
    const lowerCaseArray = [];
    const hookReturn = {};

    keysToListen.forEach((key) => {
      const lowerCaseKey = key.toLowerCase();
      lowerCaseArray.push(lowerCaseKey);
      hookReturn[lowerCaseKey] = false;
    });

    return {
      lowerCaseArray,
      hookReturn
    };
  }, [keysToListen]);

  const [keysPressed, setPressedKeys] = useState(getKeys().hookReturn);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const lowerKey = e.key.toLowerCase();
      if (getKeys().lowerCaseArray.includes(lowerKey)) {
        setPressedKeys((keysPressed) => ({ ...keysPressed, [lowerKey]: true }));
      }
    };
    const handleKeyUp = (e) => {
      const lowerKey = e.key.toLowerCase();
      if (getKeys().lowerCaseArray.includes(lowerKey)) {
        setPressedKeys((keysPressed) => ({
          ...keysPressed,
          [lowerKey]: false
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [keysToListen, getKeys]);

  return keysPressed;
};
