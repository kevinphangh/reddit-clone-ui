// User count management with localStorage
// Since backend doesn't have a user count endpoint yet, 
// we'll track it locally and increment when users register

const USER_COUNT_KEY = 'via_forum_user_count';
const USER_COUNT_TIMESTAMP = 'via_forum_user_count_timestamp';
const INITIAL_COUNT = 347; // Known count at launch

export const getUserCount = (): number => {
  const stored = localStorage.getItem(USER_COUNT_KEY);
  if (stored) {
    return parseInt(stored, 10);
  }
  // Initialize with known count
  localStorage.setItem(USER_COUNT_KEY, INITIAL_COUNT.toString());
  localStorage.setItem(USER_COUNT_TIMESTAMP, Date.now().toString());
  return INITIAL_COUNT;
};

export const incrementUserCount = (): number => {
  const current = getUserCount();
  const newCount = current + 1;
  localStorage.setItem(USER_COUNT_KEY, newCount.toString());
  localStorage.setItem(USER_COUNT_TIMESTAMP, Date.now().toString());
  return newCount;
};

export const setUserCount = (count: number): void => {
  localStorage.setItem(USER_COUNT_KEY, count.toString());
  localStorage.setItem(USER_COUNT_TIMESTAMP, Date.now().toString());
};

export const getUserCountAge = (): number => {
  const timestamp = localStorage.getItem(USER_COUNT_TIMESTAMP);
  if (!timestamp) return Infinity;
  return Date.now() - parseInt(timestamp, 10);
};