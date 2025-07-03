import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CaseBook, CaseType } from '../types/caseTypes'; // Import CaseType
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';
import PlaintiffInfoModal from './case-management/PlaintiffInfoModal';
import DefendantInfoModal from './case-management/DefendantInfoModal';
import RelatedPartyInfoModal from './case-management/RelatedPartyInfoModal'; // Import new modal
import NumberDateInputModal from '../common/NumberDateInputModal';
import CombinedNumberDateTextModal from '../common/CombinedNumberDateTextModal'; // Import new modal
import AdvancedSearchModal, { AdvancedSearchCriteria } from './case-management/AdvancedSearchModal'; // Import new modal and interface
import ParticipantInfoModal from './case-management/ParticipantInfoModal'; // NEW: Import ParticipantInfoModal
import PartyAndCourtInfoModal from './case-management/PartyAndCourtInfoModal'; // NEW: Import PartyAndCourtInfoModal

// Import new modular components and hook
import CaseManagementHeader from './case-management/CaseManagementHeader';
import CaseTable from './case-management/CaseTable';
import CaseInstructions from './case-management/CaseInstructions';
import { useCasesData } from '../../hooks/useCasesData';
import { getHandsontableConfig } from '../../utils/handsontableConfig';
import { parseNumberDateString, combineNumberAndDate, parseNumberDateAndTextString, combineDateAndText, parseDateAndTextString } from '../../utils/dateUtils'; // Import new parse utility
import { authenticatedFetch } from '../../utils/api'; // Import authenticatedFetch
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [maxNumbersByField, setMaxNumbersByField] = useState<Record<string, string | null>>({});
  const [isMaxNumbersLoading, setIsMaxNumbersLoading] = useState(true);

  const [showPlaintiffInfoModal, setShowPlaintiffInfoModal] = useState(false);
  const [currentCaseIdForPlaintiffEdit, setCurrentCaseIdForPlaintiffEdit] = useState<string | null>(null);
  const [currentPlaintiffInfo, setCurrentPlaintiffInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingPlaintiffInfo, setIsSavingPlaintiffInfo] = useState(false);

  const [showDefendantInfoModal, setShowDefendantInfoModal] = useState(false);
  const [currentCaseIdForDefendantEdit, setCurrentCaseIdForDefendantEdit] = useState<string | null>(null);
  const [currentDefendantInfo, setCurrentDefendantInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingDefendantInfo, setIsSavingDefendantInfo] = useState(false);

  // New state for Related Party Info Modal
  const [showRelatedPartyInfoModal, setShowRelatedPartyInfoModal] = useState(false);
  const [currentCaseIdForRelatedPartyEdit, setCurrentCaseIdForRelatedPartyEdit] = useState<string | null>(null);
  const [currentRelatedPartyInfo, setCurrentRelatedPartyInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingRelatedPartyInfo, setIsSavingRelatedPartyInfo] = useState(false);

  // NEW: State for Participant Info Modal (for GIAI_QUYET_TRANH_CHAP_HOA_GIAI)
  const [showParticipantInfoModal, setShowParticipantInfoModal] = useState(false);
  const [currentCaseIdForParticipantEdit, setCurrentCaseIdForParticipantEdit] = useState<string | null>(null);
  const [currentParticipantInfo, setCurrentParticipantInfo] = useState({ name: '', address: '' });
  const [isSavingParticipantInfo, setIsSavingParticipantInfo] = useState(false);

  // NEW: State for Party and Court Info Modal (for GIAI_QUYET_TRANH_CHAP_HOA_GIAI)
  const [showPartyAndCourtInfoModal, setShowPartyAndCourtInfoModal] = useState(false);
  const [currentCaseIdForPartyAndCourtEdit, setCurrentCaseIdForPartyAndCourtEdit] = useState<string | null>(null);
  const [currentPartyAndCourtInfo, setCurrentPartyAndCourtInfo] = useState({ partyName: '', courtAddress: '' });
  const [isSavingPartyAndCourtInfo, setIsSavingPartyAndCourtInfo] = useState(false);

  const [showNumberDateInfoModal, setShowNumberDateInfoModal] = useState(false);
  const [currentNumberDateInfo, setCurrentNumberDateInfo] = useState({ number: '', date: '' });
  const [currentNumberDateProp, setCurrentNumberDateProp] = useState<string | null>(null);
  const [currentNumberDateCaseId, setCurrentNumberDateCaseId] = useState<string | null>(null);
  const [isSavingNumberDateInfo, setIsSavingNumberDateInfo] = useState(false);
  const [numberDateModalTitle, setNumberDateModalTitle] = useState('');

  // New state for Combined Number/Date/Text Modal
  const [showCombinedNumberDateTextModal, setShowCombinedNumberDateTextModal] = useState(false);
  const [currentCombinedNumberDateTextInfo, setCurrentCombinedNumberDateTextInfo] = useState({ number: '', date: '', text: '' });
  const [currentCombinedNumberDateTextProp, setCurrentCombinedNumberDateTextProp] = useState<string | null>(null);
  const [currentCombinedNumberDateTextCaseId, setCurrentCombinedNumberDateTextCaseId] = useState<string | null>(null);
  const [isSavingCombinedNumberDateTextInfo, setIsSavingCombinedNumberDateTextInfo] = useState(false);
  const [combinedNumberDateTextModalTitle, setCombinedNumberDateTextModalTitle] = useState('');
  const [combinedNumberDateTextModalLabels, setCombinedNumberDateTextModalLabels] = useState({ number: 'Số', date: 'Ngày', text: 'Văn bản' });

  // NEW: State for Date/Text Combined Modal (for 'thong_tin_yeu_cau_cua_duong_su')
  const [showDateTextModal, setShowDateTextModal] = useState(false);
  const [currentDateTextInfo, setCurrentDateTextInfo] = useState({ date: '', text: '' });
  const [currentDateTextProp, setCurrentDateTextProp] = useState<string | null>(null);
  const [currentDateTextCaseId, setCurrentDateTextCaseId] = useState<string | null>(null);
  const [isSavingDateTextInfo, setIsSavingDateTextInfo] = useState(false);
  const [dateTextModalTitle, setDateTextModalTitle] = useState('');
  const [dateTextModalLabels, setDateTextModalLabels] = useState({ date: 'Ngày', text: 'Văn bản' });


  // New state for advanced search
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [advancedSearchInitialCriteria, setAdvancedSearchInitialCriteria] = useState<AdvancedSearchCriteria>({
    ngayNhanDon: '',
    nguoiKhoiKien: '',
    nguoiBiKien: '',
  });
  // New state to hold the IDs of cases selected from the advanced search modal
  const [activeCaseIdsFilter, setActiveCaseIdsFilter] = useState<string[] | null>(null);

  const { accessToken, logout } = useAuth(); // Use hook to get accessToken and logout

  const caseType = caseTypes.find(type => type.id === book.caseTypeId); // This is correct
  
  const wsRef = useRef<WebSocket | null>(null);

  if (!caseType) {
    return <div>Case type not found</div>;
  }

  const {
    cases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    setCases,
  } = useCasesData(book); // Removed advancedSearchCriteria from hook call

  const requestMaxNumbersUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Requesting all max numbers update...');
      // Request max numbers for all relevant case types
      wsRef.current.send(JSON.stringify({ 
        action: 'get_all_max_numbers', 
        year: book.year,
        case_types: ['HON_NHAN', 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI', 'TO_TUNG'] 
      }));
    } else {
      console.warn('WebSocket not open. Cannot request max numbers update.');
    }
  }, [book.year]);

  useEffect(() => {
    // Only connect WebSocket if accessToken is available
    if (!accessToken) {
      setIsMaxNumbersLoading(false);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    setIsMaxNumbersLoading(true);
    // Pass accessToken as a query parameter for authentication
    const ws = new WebSocket(`ws://localhost:8003/ws/get-max-so/?token=${accessToken}`);
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
      
      fetchCases(); // Refresh cases after max numbers are updated
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
  }, [book.year, requestMaxNumbersUpdate, fetchCases, accessToken]); // Depend on book.year, fetchCases, and accessToken

  const getNextNumberForField = useCallback((fieldKey: string) => {
    console.log(`getNextNumberForField called for: ${fieldKey}`);
    console.log('Current maxNumbersByField state:', maxNumbersByField);
    const currentMax = maxNumbersByField[fieldKey];
    console.log(`Current max for ${fieldKey}:`, currentMax, '(Type:', typeof currentMax, ')');

    if (currentMax !== null && currentMax !== undefined && String(currentMax).trim() !== '') {
      const parsedMax = parseInt(String(currentMax), 10);
      console.log('Parsed currentMax:', parsedMax);

      if (!isNaN(parsedMax)) {
        const nextNumber = (parsedMax + 1).toString(); // Increment the number
        console.log(`Generated next number for ${fieldKey}:`, nextNumber);
        return nextNumber;
      }
    }
    console.warn(`Max number for ${fieldKey} is not a valid number or is empty. Falling back to '1'.`);
    return '1';
  }, [maxNumbersByField]);

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases();
    requestMaxNumbersUpdate();
  };

  const handleCasesCopiedFromSearch = () => {
    setShowAdvancedSearchModal(false);
    setActiveCaseIdsFilter(null); // Clear advanced filter
    setSearchTerm(''); // Clear basic search
    setAdvancedSearchInitialCriteria({ ngayNhanDon: '', nguoiKhoiKien: '', nguoiBiKien: '' }); // Clear modal's initial criteria
    fetchCases(); // Re-fetch all cases for the current book
    requestMaxNumbersUpdate(); // Request updated max numbers
  };

  const handleUpdateCase = useCallback(async (caseId: string, prop: string, newValue: any) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) {
      console.warn(`Case with ID ${caseId} not found for update.`);
      return;
    }

    let payload: { [key: string]: any } = { created_by: 1 };
    let updatedDisplayValue: any = newValue;

    // Handle boolean fields from dropdown
    const attribute = caseType.attributes.find(attr => attr.id === prop);
    if (attribute?.type === 'dropdown' && (attribute.options?.includes('Có') || attribute.options?.includes('Không'))) {
      payload[prop] = newValue === 'Có';
    } else if (prop === 'thong_tin_nguoi_khoi_kien') {
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_khoi_kien = lines[0] || '';
      payload.nam_sinh_nguoi_khoi_kien = lines[1] || '';
      payload.dia_chi_nguoi_khoi_kien = lines[2] || '';
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_bi_kien = lines[0] || '';
      payload.nam_sinh_nguoi_bi_kien = lines[1] || '';
      payload.dia_chi_nguoi_bi_kien = lines[2] || '';
    } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') { // New related party field
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[0] || '';
      payload.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[1] || '';
      payload.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[2] || '';
    } else if (prop === 'thong_tin_nguoi_tham_gia_hoa_giai') { // NEW: Participant info for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_tham_gia_hoa_giai = lines[0] || '';
      payload.dia_chi_nguoi_tham_gia_hoa_giai = lines[1] || '';
    } else if (prop === 'thong_tin_duong_su_lua_chon_va_toa_an_quan_ly') { // NEW: Party and Court info for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_duong_su_lua_chon = lines[0] || '';
      payload.toa_an_noi_quan_ly_hoa_giai_vien_lam_viec = lines[1] || '';
    } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
      // Handle new combined number/date/text fields for TO_TUNG
      if (prop === 'thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan' || prop === 'thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet') {
        const { number, date, text } = parseNumberDateAndTextString(newValue);
        payload.so_chuyen_ho_so_vu_viec = number;
        payload.ngay_chuyen_ho_so_vu_viec = date;
        payload.noi_nhan_chuyen_ho_so_vu_viec = text;
      } else if (prop === 'thong_tin_yeu_cau_cua_duong_su') { // NEW: Handle combined date/text for 'thong_tin_yeu_cau_cua_duong_su'
        const { date, text } = parseDateAndTextString(newValue);
        payload.ngay_yeu_cau_cua_duong_su = date;
        payload.tom_tat_noi_dung_yeu_cau_cua_duong_su = text;
      } else if (prop === 'thong_tin_so_ngay_don') {
        const { number, date } = parseNumberDateString(newValue);
        payload.so_thu_ly = number;
        payload.ngay_thu_ly = date;
      } else if (prop === 'thong_tin_so_ngay_thu_ly_chinh') {
        const { number, date } = parseNumberDateString(newValue);
        payload.so_thu_ly_chinh = number;
        payload.ngay_thu_ly_chinh = date;
      } else if (prop === 'thong_tin_so_ngay_thu_ly') { // NEW: For HON_NHAN's combined so_thu_ly/ngay_thu_ly
        const { number, date } = parseNumberDateString(newValue);
        payload.so_thu_ly = number;
        payload.ngay_thu_ly = date;
      }
      else { // Existing number/date combined fields
        const { number, date } = parseNumberDateString(newValue);
        const originalPropName = prop.replace('thong_tin_', '');
        payload[`so_${originalPropName}`] = number;
        payload[`ngay_${originalPropName}`] = date;
      }
      updatedDisplayValue = newValue; // Keep the combined string for display
    }
    else {
      payload[prop] = newValue;
    }

    setCases(prevCases => prevCases.map(c => {
      if (c.id === caseId) {
        const updatedC = { ...c, lastModified: new Date().toISOString().split('T')[0] };
        // Update local state for combined fields
        if (prop === 'thong_tin_nguoi_khoi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_khoi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_khoi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_khoi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_khoi_kien = newValue;
        } else if (prop === 'thong_tin_nguoi_bi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_bi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_bi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_bi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_bi_kien = newValue;
        } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[0] || '';
          updatedC.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[1] || '';
          updatedC.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[2] || '';
          updatedC.thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = newValue;
        } else if (prop === 'thong_tin_nguoi_tham_gia_hoa_giai') { // NEW: Participant info for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_tham_gia_hoa_giai = lines[0] || '';
          updatedC.dia_chi_nguoi_tham_gia_hoa_giai = lines[1] || '';
          updatedC.thong_tin_nguoi_tham_gia_hoa_giai = newValue;
        } else if (prop === 'thong_tin_duong_su_lua_chon_va_toa_an_quan_ly') { // NEW: Party and Court info for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_duong_su_lua_chon = lines[0] || '';
          updatedC.toa_an_noi_quan_ly_hoa_giai_vien_lam_viec = lines[1] || '';
          updatedC.thong_tin_duong_su_lua_chon_va_toa_an_quan_ly = newValue;
        } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
          if (prop === 'thong_tin_so_ngay_don') {
            const { number, date } = parseNumberDateString(newValue);
            updatedC.so_thu_ly = number;
            updatedC.ngay_thu_ly = date;
          } else if (prop === 'thong_tin_so_ngay_thu_ly_chinh') {
            const { number, date } = parseNumberDateString(newValue);
            updatedC.so_thu_ly_chinh = number;
            updatedC.ngay_thu_ly_chinh = date;
          } else if (prop === 'thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan') {
            const { number, date, text } = parseNumberDateAndTextString(newValue);
            updatedC.so_chuyen_ho_so_vu_viec = number;
            updatedC.ngay_chuyen_ho_so_vu_viec = date;
            updatedC.noi_nhan_chuyen_ho_so_vu_viec = text;
          } else if (prop === 'thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet') {
            const { number, date, text } = parseNumberDateAndTextString(newValue);
            updatedC.so_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet = number;
            updatedC.ngay_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet = date;
            updatedC.co_quan_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet = text;
          } else if (prop === 'thong_tin_yeu_cau_cua_duong_su') { // NEW: Handle combined date/text for 'thong_tin_yeu_cau_cua_duong_su'
            const { date, text } = parseDateAndTextString(newValue);
            updatedC.ngay_yeu_cau_cua_duong_su = date;
            updatedC.tom_tat_noi_dung_yeu_cau_cua_duong_su = text;
          } else if (prop === 'thong_tin_so_ngay_thu_ly') { // NEW: For HON_NHAN's combined so_thu_ly/ngay_thu_ly
            const { number, date } = parseNumberDateString(newValue);
            updatedC.so_thu_ly = number;
            updatedC.ngay_thu_ly = date;
          }
          else { // Existing number/date combined fields
            const { number, date } = parseNumberDateString(newValue);
            const originalPropName = prop.replace('thong_tin_', '');
            updatedC[`so_${originalPropName}`] = number;
            updatedC[`ngay_${originalPropName}`] = date;
          }
          updatedC[prop] = newValue; // Store the combined string
        } else if (attribute?.type === 'dropdown' && (attribute.options?.includes('Có') || attribute.options?.includes('Không'))) {
          updatedC[prop] = newValue; // Store 'Có' or 'Không'
        }
        else {
          updatedC[prop] = newValue;
        }
        return updatedC;
      }
      return c;
    }));

    try {
      let updateUrl = '';
      if (book.caseTypeId === 'HON_NHAN') {
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`;
      } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/${caseId}/`; // Corrected API for PUT
      } else if (book.caseTypeId === 'TO_TUNG') { // New case type
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-to-tung/${caseId}/`;
      }
      else {
        console.warn(`Update not supported for case type: ${book.caseTypeId}`);
        toast.error(`Cập nhật thất bại: Loại sổ án không được hỗ trợ.`);
        fetchCases();
        return;
      }

      const response = await authenticatedFetch(updateUrl, accessToken, logout, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      toast.success(`Cập nhật '${caseType.attributes.find(a => a.id === prop)?.name || prop}' thành công!`);
    } catch (e: any) {
      console.error("Failed to update case:", e);
      toast.error(`Cập nhật thất bại: ${e.message}`);
      fetchCases(); 
    }
  }, [cases, fetchCases, setCases, caseType.attributes, book.caseTypeId, accessToken, logout]); // Add accessToken and logout to dependencies

  const handleSavePlaintiffInfo = async (data: { name: string; year: string; address: string }) => {
    if (!currentCaseIdForPlaintiffEdit) return;

    setIsSavingPlaintiffInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForPlaintiffEdit, 'thong_tin_nguoi_khoi_kien', combinedValue);
      setShowPlaintiffInfoModal(false);
    } finally {
      setIsSavingPlaintiffInfo(false);
    }
  };

  const handleSaveDefendantInfo = async (data: { name: string; year: string; address: string }) => {
    if (!currentCaseIdForDefendantEdit) return;

    setIsSavingDefendantInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForDefendantEdit, 'thong_tin_nguoi_bi_kien', combinedValue);
      setShowDefendantInfoModal(false);
    } finally {
      setIsSavingDefendantInfo(false);
    }
  };

  const handleSaveRelatedPartyInfo = async (data: { name: string; year: string; address: string }) => {
    if (!currentCaseIdForRelatedPartyEdit) return;

    setIsSavingRelatedPartyInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForRelatedPartyEdit, 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan', combinedValue);
      setShowRelatedPartyInfoModal(false);
    } finally {
      setIsSavingRelatedPartyInfo(false);
    }
  };

  // NEW: Handler for saving participant info
  const handleSaveParticipantInfo = async (data: { name: string; address: string }) => {
    if (!currentCaseIdForParticipantEdit) return;

    setIsSavingParticipantInfo(true);
    const combinedValue = [data.name, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForParticipantEdit, 'thong_tin_nguoi_tham_gia_hoa_giai', combinedValue);
      setShowParticipantInfoModal(false);
    } finally {
      setIsSavingParticipantInfo(false);
    }
  };

  // NEW: Handler for saving party and court info
  const handleSavePartyAndCourtInfo = async (data: { partyName: string; courtAddress: string }) => {
    if (!currentCaseIdForPartyAndCourtEdit) return;

    setIsSavingPartyAndCourtInfo(true);
    const combinedValue = [data.partyName, data.courtAddress].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForPartyAndCourtEdit, 'thong_tin_duong_su_lua_chon_va_toa_an_quan_ly', combinedValue);
      setShowPartyAndCourtInfoModal(false);
    } finally {
      setIsSavingPartyAndCourtInfo(false);
    }
  };

  const handleSaveNumberDateInfo = async (data: { number: string, date: string }) => {
    if (!currentNumberDateCaseId || !currentNumberDateProp) return;

    setIsSavingNumberDateInfo(true);
    const rawCombinedString = [
      data.number ? `Số: ${data.number}` : '',
      data.date ? `Ngày: ${data.date}` : ''
    ].filter(Boolean).join('\n');

    try {
      await handleUpdateCase(currentNumberDateCaseId, currentNumberDateProp, rawCombinedString);
      setShowNumberDateInfoModal(false);
    } finally {
      setIsSavingNumberDateInfo(false);
    }
  };

  const handleSaveCombinedNumberDateTextInfo = async (data: { number: string, date: string, text: string }) => {
    if (!currentCombinedNumberDateTextCaseId || !currentCombinedNumberDateTextProp) return;

    setIsSavingCombinedNumberDateTextInfo(true);
    const rawCombinedString = [
      data.number ? `Số: ${data.number}` : '',
      data.date ? `Ngày: ${data.date}` : '',
      data.text ? `Nơi nhận/Cơ quan: ${data.text}` : ''
    ].filter(Boolean).join('\n');

    try {
      await handleUpdateCase(currentCombinedNumberDateTextCaseId, currentCombinedNumberDateTextProp, rawCombinedString);
      setShowCombinedNumberDateTextModal(false);
    } finally {
      setIsSavingCombinedNumberDateTextInfo(false);
    }
  };

  // NEW: Handler for saving date/text combined info
  const handleSaveDateTextInfo = async (data: { date: string, text: string }) => {
    if (!currentDateTextCaseId || !currentDateTextProp) return;

    setIsSavingDateTextInfo(true);
    const rawCombinedString = combineDateAndText(data.date, data.text);

    try {
      await handleUpdateCase(currentDateTextCaseId, currentDateTextProp, rawCombinedString);
      setShowDateTextModal(false);
    } finally {
      setIsSavingDateTextInfo(false);
    }
  };

  const handleCellClick = useCallback((caseId: string, prop: string, value: any) => {
    const attribute = caseType.attributes.find(attr => attr.id === prop);
    const title = attribute?.name || prop;

    if (prop === 'thong_tin_nguoi_khoi_kien') {
      setCurrentCaseIdForPlaintiffEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_khoi_kien || '';
      const year = caseItem?.nam_sinh_nguoi_khoi_kien || '';
      const address = caseItem?.dia_chi_nguoi_khoi_kien || '';
      setCurrentPlaintiffInfo({ name, year, address });
      setShowPlaintiffInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      setCurrentCaseIdForDefendantEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_bi_kien || '';
      const year = caseItem?.nam_sinh_nguoi_bi_kien || '';
      const address = caseItem?.dia_chi_nguoi_bi_kien || '';
      setCurrentDefendantInfo({ name, year, address });
      setShowDefendantInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') { // Handle new related party field
      setCurrentCaseIdForRelatedPartyEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '';
      const year = caseItem?.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '';
      const address = caseItem?.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '';
      setCurrentRelatedPartyInfo({ name, year, address });
      setShowRelatedPartyInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_tham_gia_hoa_giai') { // NEW: Handle participant info
      setCurrentCaseIdForParticipantEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_tham_gia_hoa_giai || '';
      const address = caseItem?.dia_chi_nguoi_tham_gia_hoa_giai || '';
      setCurrentParticipantInfo({ name, address });
      setShowParticipantInfoModal(true);
    } else if (prop === 'thong_tin_duong_su_lua_chon_va_toa_an_quan_ly') { // NEW: Handle party and court info
      setCurrentCaseIdForPartyAndCourtEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const partyName = caseItem?.ho_ten_duong_su_lua_chon || '';
      const courtAddress = caseItem?.toa_an_noi_quan_ly_hoa_giai_vien_lam_viec || '';
      setCurrentPartyAndCourtInfo({ partyName, courtAddress });
      setShowPartyAndCourtInfoModal(true);
    } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
      // Handle new combined number/date/text fields for TO_TUNG
      if (prop === 'thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan' || prop === 'thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet') {
        setCurrentCombinedNumberDateTextCaseId(caseId);
        setCurrentCombinedNumberDateTextProp(prop);
        setCombinedNumberDateTextModalTitle(`Chỉnh sửa ${title}`);
        
        const caseItem = cases.find(c => c.id === caseId);
        let number = '';
        let date = '';
        let text = '';
        let numberFieldKey = '';
        let textLabel = '';

        if (prop === 'thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan') {
          number = caseItem?.so_chuyen_ho_so_vu_viec || '';
          date = caseItem?.ngay_chuyen_ho_so_vu_viec || '';
          text = caseItem?.noi_nhan_chuyen_ho_so_vu_viec || '';
          numberFieldKey = 'so_chuyen_ho_so_vu_viec';
          textLabel = 'Nơi nhận chuyển hồ sơ vụ việc';
        } else if (prop === 'thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet') {
          number = caseItem?.so_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet || '';
          date = caseItem?.ngay_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet || '';
          text = caseItem?.co_quan_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet || '';
          numberFieldKey = 'so_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet';
          textLabel = 'Cơ quan ban hành kết quả giải quyết yêu cầu hủy QĐ cá biệt';
        }
        
        setCurrentCombinedNumberDateTextInfo({ number, date, text });
        setCombinedNumberDateTextModalLabels({ number: 'Số', date: 'Ngày', text: textLabel });
        setShowCombinedNumberDateTextModal(true);

      } else if (prop === 'thong_tin_yeu_cau_cua_duong_su') { // NEW: Handle combined date/text for 'thong_tin_yeu_cau_cua_duong_su'
        setCurrentDateTextCaseId(caseId);
        setCurrentDateTextProp(prop);
        setDateTextModalTitle(`Chỉnh sửa ${title}`);

        const caseItem = cases.find(c => c.id === caseId);
        const date = caseItem?.ngay_yeu_cau_cua_duong_su || '';
        const text = caseItem?.tom_tat_noi_dung_yeu_cau_cua_duong_su || '';
        
        setCurrentDateTextInfo({ date, text });
        setDateTextModalLabels({ date: 'Ngày yêu cầu', text: 'Tóm tắt nội dung yêu cầu' });
        setShowDateTextModal(true);

      } else { // Existing number/date combined fields
        setCurrentNumberDateCaseId(caseId);
        setCurrentNumberDateProp(prop);
        setNumberDateModalTitle(`Chỉnh sửa ${title}`);
        
        const caseItem = cases.find(c => c.id === caseId);
        let number = '';
        let date = '';
        if (prop === 'thong_tin_so_ngay_don') {
          number = caseItem?.so_thu_ly || '';
          date = caseItem?.ngay_thu_ly || '';
        } else if (prop === 'thong_tin_so_ngay_thu_ly_chinh') {
          number = caseItem?.so_thu_ly_chinh || '';
          date = caseItem?.ngay_thu_ly_chinh || '';
        } else if (prop === 'thong_tin_so_ngay_thu_ly') { // NEW: For HON_NHAN's combined so_thu_ly/ngay_thu_ly
          number = caseItem?.so_thu_ly || '';
          date = caseItem?.ngay_thu_ly || '';
        }
        else {
          const originalPropName = prop.replace('thong_tin_', '');
          number = caseItem?.[`so_${originalPropName}`] || '';
          date = caseItem?.[`ngay_${originalPropName}`] || '';
        }
        
        setCurrentNumberDateInfo({ number, date });
        setShowNumberDateInfoModal(true);
      }
    }
  }, [caseType.attributes, cases]);

  const handleApplyAdvancedSearchSelection = useCallback((selectedCaseIds: string[]) => {
    setActiveCaseIdsFilter(selectedCaseIds);
    setShowAdvancedSearchModal(false);
    setSearchTerm(''); // Clear basic search term when advanced search is applied
    toast.success(`Đã áp dụng bộ lọc nâng cao với ${selectedCaseIds.length} vụ án được chọn.`);
  }, []);

  const handleRefreshData = useCallback(() => {
    setActiveCaseIdsFilter(null); // Clear advanced filter
    setSearchTerm(''); // Clear basic search
    setAdvancedSearchInitialCriteria({ ngayNhanDon: '', nguoiKhoiKien: '', nguoiBiKien: '' }); // Clear modal's initial criteria
    fetchCases(); // Re-fetch all cases
  }, [fetchCases]);

  const exportData = () => {
    const headers = caseType.attributes.map(attr => attr.name);
    const csv = [
      headers,
      ...cases.map(caseItem => 
        caseType.attributes.map(attr => (caseItem as any)[attr.id] || '')
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.caseTypeName}-${book.year}-cases.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Apply the activeCaseIdsFilter first, then the basic searchTerm
  const casesToDisplay = activeCaseIdsFilter 
    ? cases.filter(c => activeCaseIdsFilter.includes(c.id))
    : cases;

  const finalFilteredCases = casesToDisplay.filter(caseItem =>
    Object.values(caseItem).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const { columns, settings } = getHandsontableConfig({
    caseType,
    filteredCases: finalFilteredCases, // Pass the currently displayed cases to config
    refreshData: fetchCases, // This will re-fetch all data, then the filter will re-apply
    setSelectedRows,
    onUpdateCase: handleUpdateCase,
    accessToken, // Pass accessToken
    logout, // Pass logout
  });

  // Determine which field to generate/display for the AddCaseModal
  const primaryNumberFieldId = book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'so_chuyen_hoa_giai' : 
                               book.caseTypeId === 'TO_TUNG' ? 'so_thu_ly_chinh' : 'so_thu_ly';

  return (
    <div className="p-6 flex flex-col h-full">
      <CaseManagementHeader
        book={book}
        onBack={onBack}
        onRefresh={handleRefreshData} // Use the new combined refresh handler
        onExport={exportData}
        onAddCase={handleAddNewCaseClick}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={finalFilteredCases.length}
        totalCount={cases.length}
        onAdvancedSearchClick={() => setShowAdvancedSearchModal(true)}
      />

      <CaseTable
        data={finalFilteredCases} // Use finalFilteredCases for the table
        columns={columns}
        settings={settings}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        filteredCount={finalFilteredCases.length}
        totalCount={cases.length}
        onAddCase={handleAddNewCaseClick}
        onCellClick={handleCellClick}
      />

      <CaseInstructions />

      {showAddCaseModal && (
        <AddCaseModal
          onClose={() => setShowAddCaseModal(false)}
          onCaseAdded={handleCaseAdded}
          bookId={book.id}
          bookYear={book.year}
          caseTypeCode={caseType.code}
          onGenerateCaseNumber={() => getNextNumberForField(primaryNumberFieldId)}
          isGeneratingCaseNumber={isMaxNumbersLoading}
          latestAutoNumber={maxNumbersByField[primaryNumberFieldId]}
        />
      )}

      {showPlaintiffInfoModal && (
        <PlaintiffInfoModal
          initialData={currentPlaintiffInfo}
          onSave={handleSavePlaintiffInfo}
          onClose={() => setShowPlaintiffInfoModal(false)}
          isSaving={isSavingPlaintiffInfo}
        />
      )}

      {showDefendantInfoModal && (
        <DefendantInfoModal
          initialData={currentDefendantInfo}
          onSave={handleSaveDefendantInfo}
          onClose={() => setShowDefendantInfoModal(false)}
          isSaving={isSavingDefendantInfo}
        />
      )}

      {showRelatedPartyInfoModal && (
        <RelatedPartyInfoModal
          initialData={currentRelatedPartyInfo}
          onSave={handleSaveRelatedPartyInfo}
          onClose={() => setShowRelatedPartyInfoModal(false)}
          isSaving={isSavingRelatedPartyInfo}
        />
      )}

      {showParticipantInfoModal && ( // NEW: Render ParticipantInfoModal
        <ParticipantInfoModal
          initialData={currentParticipantInfo}
          onSave={handleSaveParticipantInfo}
          onClose={() => setShowParticipantInfoModal(false)}
          isSaving={isSavingParticipantInfo}
        />
      )}

      {showPartyAndCourtInfoModal && ( // NEW: Render PartyAndCourtInfoModal
        <PartyAndCourtInfoModal
          initialData={currentPartyAndCourtInfo}
          onSave={handleSavePartyAndCourtInfo}
          onClose={() => setShowPartyAndCourtInfoModal(false)}
          isSaving={isSavingPartyAndCourtInfo}
        />
      )}

      {showNumberDateInfoModal && (
        <NumberDateInputModal
          title={numberDateModalTitle}
          initialNumber={currentNumberDateInfo.number}
          initialDate={currentNumberDateInfo.date}
          onSave={handleSaveNumberDateInfo}
          onClose={() => setShowNumberDateInfoModal(false)}
          isSaving={isSavingNumberDateInfo}
          onGenerateNumber={() => getNextNumberForField(currentNumberDateProp!.replace('thong_tin_', 'so_'))} 
          isGeneratingNumber={isMaxNumbersLoading}
          latestAutoNumber={maxNumbersByField[currentNumberDateProp!.replace('thong_tin_', 'so_')] || null}
        />
      )}

      {showCombinedNumberDateTextModal && (
        <CombinedNumberDateTextModal
          title={combinedNumberDateTextModalTitle}
          initialNumber={currentCombinedNumberDateTextInfo.number}
          initialDate={currentCombinedNumberDateTextInfo.date}
          initialText={currentCombinedNumberDateTextInfo.text}
          numberLabel={combinedNumberDateTextModalLabels.number}
          dateLabel={combinedNumberDateTextModalLabels.date}
          textLabel={combinedNumberDateTextModalLabels.text}
          onSave={handleSaveCombinedNumberDateTextInfo}
          onClose={() => setShowCombinedNumberDateTextModal(false)}
          isSaving={isSavingCombinedNumberDateTextInfo}
          onGenerateNumber={getNextNumberForField}
          isGeneratingNumber={isMaxNumbersLoading}
          latestAutoNumber={maxNumbersByField[currentCombinedNumberDateTextProp!.replace('thong_tin_', 'so_')] || null}
          numberFieldKey={currentCombinedNumberDateTextProp!.replace('thong_tin_', 'so_')}
        />
      )}

      {showDateTextModal && ( // NEW: Render DateTextModal
        <CombinedNumberDateTextModal
          title={dateTextModalTitle}
          initialNumber="" // No number for this modal
          initialDate={currentDateTextInfo.date}
          initialText={currentDateTextInfo.text}
          numberLabel="" // Hide number label
          dateLabel={dateTextModalLabels.date}
          textLabel={dateTextModalLabels.text}
          onSave={handleSaveDateTextInfo}
          onClose={() => setShowDateTextModal(false)}
          isSaving={isSavingDateTextInfo}
          // No auto-generate for this type of combined field
        />
      )}

      {showAdvancedSearchModal && (
        <AdvancedSearchModal
          onClose={() => setShowAdvancedSearchModal(false)}
          onApplySelection={handleApplyAdvancedSearchSelection} // Changed prop name
          initialCriteria={advancedSearchInitialCriteria}
          book={book} // Pass book to modal
          caseType={caseType} // Pass the full caseType object here
          onGenerateNextNumber={getNextNumberForField} // Pass the function to generate next number
          isGeneratingNumber={isMaxNumbersLoading} // Pass loading state
          onCasesCreated={handleCasesCopiedFromSearch} // Pass the callback for successful creation
        />
      )}
    </div>
  );
}