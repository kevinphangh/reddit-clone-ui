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
  return format(date, 'd. MMM yyyy', { locale: undefined });
}

export function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}