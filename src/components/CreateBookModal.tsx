import React, { useState } from 'react';
import { X, BookOpen, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast'; // Import toast
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface CreateBookModalProps {
  onClose: () => void;
  onBookCreated: () => void; // Changed prop name
}

export default function CreateBookModal({ onClose, onBookCreated }: CreateBookModalProps) {
  const [selectedCaseType, setSelectedCaseType] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const { accessToken, logout } = useAuth(); // Use hook to get accessToken and logout

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i - 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCaseType) {
      setError('Please select a case type');
      return;
    }

    setIsSubmitting(true);
    try {
        const caseType = caseTypes.find(type => type.id === selectedCaseType);
        if (!caseType) {
            setError('Invalid case type selected.');
            setIsSubmitting(false);
            return;
        }

        const response = await authenticatedFetch('http://localhost:8003/home/api/v1/danh-sach-so/', accessToken, logout, {
            method: 'POST',
            body: JSON.stringify({
                code: selectedCaseType, // Use selectedCaseType (e.g., 'HON_NHAN') as the 'code' for the API
                name: caseType.name, // Use the name from the found caseType
                year: selectedYear,
                created_by: 1 // As requested
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        toast.success('Case book created successfully!');
        onBookCreated(); // Signal success to parent
        onClose(); // Close modal
    } catch (e: any) {
        console.error("Failed to create case book:", e);
        setError(`Failed to create book: ${e.message}`);
        toast.error(`Failed to create book: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectedType = caseTypes.find(type => type.id === selectedCaseType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Create New Case Book
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-2">
                Case Type
              </label>
              <select
                id="caseType"
                value={selectedCaseType}
                onChange={(e) => setSelectedCaseType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a case type</option>
                {caseTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {selectedType && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Case Type Details</h4>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Name:</strong> {selectedType.name}
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Code:</strong> {selectedType.code}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Attributes:</strong> {selectedType.attributes.length} fields
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...
                </span>
              ) : (
                'Create Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}