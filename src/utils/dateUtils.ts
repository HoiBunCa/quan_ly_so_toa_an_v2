export const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';

  // Try to parse as a Date object first for robustness
  const dateObj = new Date(dateString);

  // Check if the date is valid and not "Invalid Date"
  if (!isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`; // Format to DD-MM-YYYY
  }

  // Fallback if Date parsing fails (e.g., if it's already DD-MM-YYYY)
  const parts = dateString.split('-');
  if (parts.length === 3) {
    // If it's YYYY-MM-DD, convert it
    if (parts[0].length === 4) { // Likely YYYY-MM-DD
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    // If it's DD-MM-YYYY already, return as is
    return dateString;
  }

  return dateString; // Return as is if still not in expected format
};

export const combineNumberAndDate = (num: string | undefined, date: string | undefined): string => {
  const parts = [];
  if (num) parts.push(`Số: ${num}`);
  if (date) parts.push(`Ngày: ${formatDateForDisplay(date)}`);
  return parts.filter(Boolean).join('\n');
};

export const parseNumberDateString = (combinedString: string) => {
  const lines = String(combinedString || '').split('\n');
  let number = '';
  let date = '';
  if (lines[0]?.startsWith('Số: ')) {
    number = lines[0].substring('Số: '.length);
  }
  if (lines[1]?.startsWith('Ngày: ')) {
    const extractedDateStr = lines[1].substring('Ngày: '.length);
    const dateParts = extractedDateStr.split('-');
    if (dateParts.length === 3) {
      // Check if it's already YYYY-MM-DD (e.g., '2024-01-01')
      if (dateParts[0].length === 4) {
        date = extractedDateStr; // Keep as YYYY-MM-DD
      } else {
        // Assume it's DD-MM-YYYY and convert to YYYY-MM-DD
        date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    } else {
      date = extractedDateStr; // If not 3 parts, keep as is (might be empty or malformed)
    }
  }
  return { number, date };
};