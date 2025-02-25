import { useCallback } from 'react';
import debounce from 'lodash/debounce';

export const useDebounce = (callback, delay) => {
  return useCallback(
    debounce((...args) => callback(...args), delay),
    [callback, delay]
  );
}; 