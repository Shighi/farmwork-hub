import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with TypeScript support
 * Provides automatic JSON serialization/deserialization and error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage and state
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (valueToStore === undefined || valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing boolean flags in localStorage
 * Useful for feature toggles, user preferences, etc.
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void, (value: boolean) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);

  const setTrue = useCallback(() => {
    setValue(true);
  }, [setValue]);

  const setFalse = useCallback(() => {
    setValue(false);
  }, [setValue]);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, [setValue]);

  return [value, toggle, setTrue, setFalse, set, removeValue];
}

/**
 * Hook for managing arrays in localStorage
 * Provides helper methods for common array operations
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [
  T[],
  {
    add: (item: T) => void;
    remove: (index: number) => void;
    removeByValue: (item: T) => void;
    update: (index: number, item: T) => void;
    clear: () => void;
    set: (items: T[]) => void;
  }
] {
  const [items, setItems, removeItems] = useLocalStorage(key, initialValue);

  const add = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, [setItems]);

  const remove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, [setItems]);

  const removeByValue = useCallback((item: T) => {
    setItems(prev => prev.filter(i => JSON.stringify(i) !== JSON.stringify(item)));
  }, [setItems]);

  const update = useCallback((index: number, item: T) => {
    setItems(prev => prev.map((i, idx) => idx === index ? item : i));
  }, [setItems]);

  const clear = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const set = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, [setItems]);

  return [
    items,
    {
      add,
      remove,
      removeByValue,
      update,
      clear,
      set,
    }
  ];
}

/**
 * Hook for managing search history in localStorage
 * Automatically manages duplicates and limits history size
 */
export function useSearchHistory(key: string, maxItems: number = 10) {
  const [history, setHistory] = useLocalStorage<string[]>(key, []);

  const addSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setHistory(prev => {
      // Remove existing occurrence if it exists
      const filtered = prev.filter(item => item !== searchTerm);
      // Add to beginning and limit size
      return [searchTerm, ...filtered].slice(0, maxItems);
    });
  }, [setHistory, maxItems]);

  const removeSearch = useCallback((searchTerm: string) => {
    setHistory(prev => prev.filter(item => item !== searchTerm));
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
  };
}

/**
 * Hook for managing user preferences with default values
 * Useful for theme, language, notification settings, etc.
 */
export function useUserPreferences<T extends Record<string, any>>(
  key: string,
  defaultPreferences: T
): [T, (preferences: Partial<T>) => void, () => void] {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    key,
    defaultPreferences
  );

  const updatePreferences = useCallback((newPreferences: Partial<T>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences, defaultPreferences]);

  return [preferences, updatePreferences, resetPreferences];
}

/**
 * Hook for managing form data in localStorage
 * Automatically saves and restores form data to prevent data loss
 */
export function useFormPersistence<T extends Record<string, any>>(
  key: string,
  initialData: T
) {
  const [formData, setFormData] = useLocalStorage(key, initialData);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, [setFormData]);

  const updateFields = useCallback((fields: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [setFormData, initialData]);

  const clearForm = useCallback(() => {
    setFormData({} as T);
  }, [setFormData]);

  return {
    formData,
    updateField,
    updateFields,
    resetForm,
    clearForm,
    setFormData,
  };
}

/**
 * Hook for managing recently viewed items
 * Automatically manages duplicates and limits recent items
 */
export function useRecentItems<T extends { id: string }>(
  key: string,
  maxItems: number = 20
) {
  const [recentItems, setRecentItems] = useLocalStorage<T[]>(key, []);

  const addRecentItem = useCallback((item: T) => {
    setRecentItems(prev => {
      // Remove existing occurrence if it exists
      const filtered = prev.filter(i => i.id !== item.id);
      // Add to beginning and limit size
      return [item, ...filtered].slice(0, maxItems);
    });
  }, [setRecentItems, maxItems]);

  const removeRecentItem = useCallback((itemId: string) => {
    setRecentItems(prev => prev.filter(item => item.id !== itemId));
  }, [setRecentItems]);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
  };
}