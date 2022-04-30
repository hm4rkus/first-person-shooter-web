import { useEffect, useRef } from "react";

export const useVariable = (state) => {
  const varRef = useRef(state);

  useEffect(() => {
    varRef.current = state;
  }, [state]);

  return varRef;
};
