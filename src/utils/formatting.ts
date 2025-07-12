import { formatDistanceToNow, format } from 'date-fns';

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function formatScore(score: number): string {
  if (score === 0) return '•';
  return formatNumber(score);
}

export function formatTimeAgo(date: Date): string {
  const distance = formatDistanceToNow(date, { addSuffix: false });
  
  // Match Reddit's time formatting with Danish abbreviations
  const parts = distance.split(' ');
  if (parts.length >= 2) {
    const [num, unit] = parts;
    if (unit.startsWith('second')) return 'lige nu';
    if (unit.startsWith('minute')) return `${num} min`;
    if (unit.startsWith('hour')) return `${num} t`;
    if (unit.startsWith('day')) return `${num} d`;
    if (unit.startsWith('month')) return `${num} mdr`;
    if (unit.startsWith('year')) return `${num} år`;
  }
  
  return distance;
}

export function formatFullDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function getPostTypeIcon(type: string): string {
  switch (type) {
    case 'link': return '🔗';
    case 'image': return '🖼️';
    case 'video': return '📹';
    case 'poll': return '📊';
    default: return '📝';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}

export function generateAvatarUrl(username: string): string {
  // Generate a consistent color based on username
  const colors = ['FF4500', '0079D3', '46D160', 'FFB000', '7193FF', 'FF66AC', '4856A3'];
  const index = username.charCodeAt(0) % colors.length;
  return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${index}.png`;
}