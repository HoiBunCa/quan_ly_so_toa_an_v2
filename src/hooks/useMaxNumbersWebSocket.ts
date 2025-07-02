import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseMaxNumbersWebSocketArgs {
  bookYear: number;
  caseTypeCode: string;
  onNumbersUpdated: () => void; // Callback to notify parent when numbers are updated
}

interface MaxNumbersResult {
  maxNumbersByField: Record<string, string | null>;
  isMaxNumbersLoading: boolean;
  requestMaxNumbersUpdate: () => void;
  getNextNumberForField: (fieldKey: string) => string;
}

export function useMaxNumbersWebSocket({ bookYear, caseTypeCode, onNumbersUpdated }: UseMaxNumbersWebSocketArgs): MaxNumbersResult {
  const [maxNumbersByField, setMaxNumbersByField] = useState<Record<string, string | null>>({});
  const [isMaxNumbersLoading, setIsMaxNumbersLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const requestMaxNumbersUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Requesting all max numbers update...');
      wsRef.current.send(JSON.stringify({ action: 'get_all_max_numbers', year: bookYear }));
    } else {
      console.warn('WebSocket not open. Cannot request max numbers update.');
    }
  }, [bookYear]);

  useEffect(() => {
    if (caseTypeCode === 'HON_NHAN' || caseTypeCode === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
      setIsMaxNumbersLoading(true);
      const ws = new WebSocket('ws://localhost:8003/ws/get-max-so/');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected for max numbers');
        requestMaxNumbersUpdate();
      };

      ws.onmessage = (event) => {
        console.log('WebSocket: Raw message received:', event.data);
        const message = JSON.parse(event.data);
        
        const rawMaxNumbers = message;
        const formattedData: Record<string, string | null> = {};
        for (const key in rawMaxNumbers) {
          if (Object.prototype.hasOwnProperty.call(rawMaxNumbers, key)) {
            formattedData[key] = String(rawMaxNumbers[key]);
          }
        }
        setMaxNumbersByField(formattedData); 
        console.log('WebSocket: Received max numbers map and setting state:', formattedData);
        
        setIsMaxNumbersLoading(false);
        console.log('WebSocket: Setting isMaxNumbersLoading to false.');
        onNumbersUpdated(); // Notify parent that numbers are updated
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected for max numbers');
        setIsMaxNumbersLoading(false);
        wsRef.current = null;
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Lỗi kết nối WebSocket để lấy số tối đa.');
        setIsMaxNumbersLoading(false);
      };

      return () => {
        ws.close();
      };
    } else {
      setIsMaxNumbersLoading(false);
      setMaxNumbersByField({});
    }
  }, [bookYear, caseTypeCode, requestMaxNumbersUpdate, onNumbersUpdated]);

  const getNextNumberForField = useCallback((fieldKey: string) => {
    console.log(`getNextNumberForField called for: ${fieldKey}`);
    console.log('Current maxNumbersByField state:', maxNumbersByField);
    const currentMax = maxNumbersByField[fieldKey];
    console.log(`Current max for ${fieldKey}:`, currentMax, '(Type:', typeof currentMax, ')');

    if (currentMax !== null && currentMax !== undefined && String(currentMax).trim() !== '') {
      const parsedMax = parseInt(String(currentMax), 10);
      console.log('Parsed currentMax:', parsedMax);

      if (!isNaN(parsedMax)) {
        const nextNumber = parsedMax.toString(); 
        console.log(`Generated next number for ${fieldKey}:`, nextNumber);
        return nextNumber;
      }
    }
    console.warn(`Max number for ${fieldKey} is not a valid number or is empty. Falling back to '1'.`);
    return '1';
  }, [maxNumbersByField]);

  return { maxNumbersByField, isMaxNumbersLoading, requestMaxNumbersUpdate, getNextNumberForField };
}