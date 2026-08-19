import { useEffect, useRef, useState } from "react";

export const useDebounce = (value: string, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debounceValue;
};