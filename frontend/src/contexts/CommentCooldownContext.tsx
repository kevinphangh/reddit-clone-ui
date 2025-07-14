import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CommentCooldownContextType {
  isInCooldown: boolean;
  remainingTime: number;
  startCooldown: () => void;
  canComment: boolean;
}

const CommentCooldownContext = createContext<CommentCooldownContextType | null>(null);

export const useCommentCooldown = () => {
  const context = useContext(CommentCooldownContext);
  if (!context) {
    throw new Error('useCommentCooldown must be used within CommentCooldownProvider');
  }
  return context;
};

const COOLDOWN_DURATION = 10000; // 10 seconds in milliseconds

export const CommentCooldownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastCommentTime, setLastCommentTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);

  const updateCooldownStatus = useCallback(() => {
    if (!lastCommentTime) {
      setIsInCooldown(false);
      setRemainingTime(0);
      return;
    }

    const now = Date.now();
    const elapsed = now - lastCommentTime;
    const remaining = COOLDOWN_DURATION - elapsed;

    if (remaining <= 0) {
      setIsInCooldown(false);
      setRemainingTime(0);
      setLastCommentTime(null);
    } else {
      setIsInCooldown(true);
      setRemainingTime(Math.ceil(remaining / 1000)); // Convert to seconds
    }
  }, [lastCommentTime]);

  useEffect(() => {
    updateCooldownStatus();

    if (lastCommentTime) {
      const interval = setInterval(updateCooldownStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [lastCommentTime, updateCooldownStatus]);

  const startCooldown = useCallback(() => {
    setLastCommentTime(Date.now());
  }, []);

  const canComment = !isInCooldown;

  return (
    <CommentCooldownContext.Provider value={{
      isInCooldown,
      remainingTime,
      startCooldown,
      canComment
    }}>
      {children}
    </CommentCooldownContext.Provider>
  );
};