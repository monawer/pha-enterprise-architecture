
import { useState, useCallback } from 'react';

export const useModal = <T = any>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = useCallback((item?: T) => {
    if (item) {
      setSelectedItem(item);
      setIsEditing(true);
    } else {
      setSelectedItem(null);
      setIsEditing(false);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  }, []);

  return {
    isOpen,
    selectedItem,
    isEditing,
    openModal,
    closeModal
  };
};
