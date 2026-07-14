export function isSameDay(timestamp: number, reference: Date): boolean {
  const a = new Date(timestamp);
  return (
    a.getFullYear() === reference.getFullYear() &&
    a.getMonth() === reference.getMonth() &&
    a.getDate() === reference.getDate()
  );
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
