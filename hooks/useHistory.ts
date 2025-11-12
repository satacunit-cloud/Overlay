import { useState, useCallback } from 'react';

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const set = useCallback((newState: T | ((prevState: T) => T)) => {
    setHistory(currentHistory => {
      const newPresent = newState instanceof Function ? newState(currentHistory.present) : newState;
      if (newPresent === currentHistory.present) {
        return currentHistory;
      }
      return {
        past: [...currentHistory.past, currentHistory.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    setHistory(currentHistory => {
      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setHistory(currentHistory => {
      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);
      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  return { state: history.present, set, undo, redo, canUndo, canRedo };
};
