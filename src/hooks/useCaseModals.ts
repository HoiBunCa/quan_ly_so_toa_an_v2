import { useState, useCallback } from 'react';
import { Case, CaseType } from '../types/caseTypes';
import { parseNumberDateString, combineNumberAndDate } from '../utils/dateUtils';

interface UseCaseModalsArgs {
  cases: Case[];
  caseType: CaseType;
  onUpdateCase: (caseId: string, prop: string, newValue: any) => Promise<void>;
}

interface PlaintiffInfo { name: string; year: string; address: string; }
interface DefendantInfo { name: string; year: string; address: string; }
interface RelatedPartyInfo { name: string; year: string; address: string; }
interface NumberDateInfo { number: string; date: string; }

export function useCaseModals({ cases, caseType, onUpdateCase }: UseCaseModalsArgs) {
  // Plaintiff Modal States
  const [showPlaintiffInfoModal, setShowPlaintiffInfoModal] = useState(false);
  const [currentCaseIdForPlaintiffEdit, setCurrentCaseIdForPlaintiffEdit] = useState<string | null>(null);
  const [currentPlaintiffInfo, setCurrentPlaintiffInfo] = useState<PlaintiffInfo>({ name: '', year: '', address: '' });
  const [isSavingPlaintiffInfo, setIsSavingPlaintiffInfo] = useState(false);

  // Defendant Modal States
  const [showDefendantInfoModal, setShowDefendantInfoModal] = useState(false);
  const [currentCaseIdForDefendantEdit, setCurrentCaseIdForDefendantEdit] = useState<string | null>(null);
  const [currentDefendantInfo, setCurrentDefendantInfo] = useState<DefendantInfo>({ name: '', year: '', address: '' });
  const [isSavingDefendantInfo, setIsSavingDefendantInfo] = useState(false);

  // Related Party Modal States
  const [showRelatedPartyInfoModal, setShowRelatedPartyInfoModal] = useState(false);
  const [currentCaseIdForRelatedPartyEdit, setCurrentCaseIdForRelatedPartyEdit] = useState<string | null>(null);
  const [currentRelatedPartyInfo, setCurrentRelatedPartyInfo] = useState<RelatedPartyInfo>({ name: '', year: '', address: '' });
  const [isSavingRelatedPartyInfo, setIsSavingRelatedPartyInfo] = useState(false);

  // Number/Date Modal States
  const [showNumberDateInfoModal, setShowNumberDateInfoModal] = useState(false);
  const [currentNumberDateInfo, setCurrentNumberDateInfo] = useState<NumberDateInfo>({ number: '', date: '' });
  const [currentNumberDateProp, setCurrentNumberDateProp] = useState<string | null>(null);
  const [currentNumberDateCaseId, setCurrentNumberDateCaseId] = useState<string | null>(null);
  const [isSavingNumberDateInfo, setIsSavingNumberDateInfo] = useState(false);
  const [numberDateModalTitle, setNumberDateModalTitle] = useState('');

  const handleSavePlaintiffInfo = useCallback(async (data: PlaintiffInfo) => {
    if (!currentCaseIdForPlaintiffEdit) return;
    setIsSavingPlaintiffInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    try {
      await onUpdateCase(currentCaseIdForPlaintiffEdit, 'thong_tin_nguoi_khoi_kien', combinedValue);
      setShowPlaintiffInfoModal(false);
    } finally {
      setIsSavingPlaintiffInfo(false);
    }
  }, [currentCaseIdForPlaintiffEdit, onUpdateCase]);

  const handleSaveDefendantInfo = useCallback(async (data: DefendantInfo) => {
    if (!currentCaseIdForDefendantEdit) return;
    setIsSavingDefendantInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    try {
      await onUpdateCase(currentCaseIdForDefendantEdit, 'thong_tin_nguoi_bi_kien', combinedValue);
      setShowDefendantInfoModal(false);
    } finally {
      setIsSavingDefendantInfo(false);
    }
  }, [currentCaseIdForDefendantEdit, onUpdateCase]);

  const handleSaveRelatedPartyInfo = useCallback(async (data: RelatedPartyInfo) => {
    if (!currentCaseIdForRelatedPartyEdit) return;
    setIsSavingRelatedPartyInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    try {
      await onUpdateCase(currentCaseIdForRelatedPartyEdit, 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan', combinedValue);
      setShowRelatedPartyInfoModal(false);
    } finally {
      setIsSavingRelatedPartyInfo(false);
    }
  }, [currentCaseIdForRelatedPartyEdit, onUpdateCase]);

  const handleSaveNumberDateInfo = useCallback(async (data: NumberDateInfo) => {
    if (!currentNumberDateCaseId || !currentNumberDateProp) return;
    setIsSavingNumberDateInfo(true);
    const rawCombinedString = [
      data.number ? `Số: ${data.number}` : '',
      data.date ? `Ngày: ${data.date}` : ''
    ].filter(Boolean).join('\n');
    try {
      await onUpdateCase(currentNumberDateCaseId, currentNumberDateProp, rawCombinedString);
      setShowNumberDateInfoModal(false);
    } finally {
      setIsSavingNumberDateInfo(false);
    }
  }, [currentNumberDateCaseId, currentNumberDateProp, onUpdateCase]);

  const handleCellClick = useCallback((caseId: string, prop: string, value: any) => {
    const attribute = caseType.attributes.find(attr => attr.id === prop);
    const title = attribute?.name || prop;
    const caseItem = cases.find(c => c.id === caseId);

    if (!caseItem) {
      console.warn(`Case with ID ${caseId} not found for cell click.`);
      return;
    }

    if (prop === 'thong_tin_nguoi_khoi_kien') {
      setCurrentCaseIdForPlaintiffEdit(caseId);
      setCurrentPlaintiffInfo({
        name: caseItem.ho_ten_nguoi_khoi_kien || '',
        year: caseItem.nam_sinh_nguoi_khoi_kien || '',
        address: caseItem.dia_chi_nguoi_khoi_kien || ''
      });
      setShowPlaintiffInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      setCurrentCaseIdForDefendantEdit(caseId);
      setCurrentDefendantInfo({
        name: caseItem.ho_ten_nguoi_bi_kien || '',
        year: caseItem.nam_sinh_nguoi_bi_kien || '',
        address: caseItem.dia_chi_nguoi_bi_kien || ''
      });
      setShowDefendantInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') {
      setCurrentCaseIdForRelatedPartyEdit(caseId);
      setCurrentRelatedPartyInfo({
        name: caseItem.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
        year: caseItem.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
        address: caseItem.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || ''
      });
      setShowRelatedPartyInfoModal(true);
    } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
      setCurrentNumberDateCaseId(caseId);
      setCurrentNumberDateProp(prop);
      setNumberDateModalTitle(`Chỉnh sửa ${title}`);
      
      const originalPropName = prop.replace('thong_tin_', '');
      const number = caseItem[`so_${originalPropName}`] || '';
      const date = caseItem[`ngay_${originalPropName}`] || '';
      
      setCurrentNumberDateInfo({ number, date });
      setShowNumberDateInfoModal(true);
    }
  }, [caseType.attributes, cases]);

  return {
    // Plaintiff Modal
    showPlaintiffInfoModal, setShowPlaintiffInfoModal,
    currentPlaintiffInfo, isSavingPlaintiffInfo, handleSavePlaintiffInfo,
    // Defendant Modal
    showDefendantInfoModal, setShowDefendantInfoModal,
    currentDefendantInfo, isSavingDefendantInfo, handleSaveDefendantInfo,
    // Related Party Modal
    showRelatedPartyInfoModal, setShowRelatedPartyInfoModal,
    currentRelatedPartyInfo, isSavingRelatedPartyInfo, handleSaveRelatedPartyInfo,
    // Number/Date Modal
    showNumberDateInfoModal, setShowNumberDateInfoModal,
    currentNumberDateInfo, currentNumberDateProp, currentNumberDateCaseId,
    isSavingNumberDateInfo, numberDateModalTitle, handleSaveNumberDateInfo,
    // General Cell Click Handler
    handleCellClick,
  };
}