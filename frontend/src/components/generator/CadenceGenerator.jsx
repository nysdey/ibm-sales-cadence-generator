import { useState } from 'react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { generateCadences } from '../../services/api';
import { validateInputs, sanitizeInput } from '../../services/validation';
import CadenceDisplay from './CadenceDisplay';

const CADENCE_OPTIONS = [
  { value: 'virtualization', label: 'Virtualization (IBM Fusion)', product: 'IBM Fusion' },
  { value: 'application_modernization', label: 'Application Modernization (IBM Fusion)', product: 'IBM Fusion' },
  { value: 'generative_ai', label: 'Generative AI (IBM Fusion)', product: 'IBM Fusion' },
  { value: 'power_modernization', label: 'Power Systems Modernization (IBM PowerVS)', product: 'IBM PowerVS' },
  { value: 'storage_modernization', label: 'Storage Modernization (IBM FlashSystems)', product: 'IBM FlashSystems' },
  { value: 'whitespace', label: 'Whitespace/New Client Introduction', product: 'Multi-Product' },
  { value: 'infrastructure_transformation', label: 'Infrastructure Transformation (Multi-Product)', product: 'Multi-Product' }
];

const CadenceGenerator = () => {
  const [prospectName, setProspectName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCadences, setSelectedCadences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cadences, setCadences] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleCadenceToggle = (value) => {
    setSelectedCadences(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // Clear previous errors and results
    setErrors({});
    setApiError(null);
    setCadences(null);

    // Sanitize inputs
    const sanitizedProspect = sanitizeInput(prospectName);
    const sanitizedCompany = sanitizeInput(companyName);

    // Validate inputs
    const validation = validateInputs(sanitizedProspect, sanitizedCompany);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Validate cadence selection
    if (selectedCadences.length === 0) {
      setErrors({ cadences: 'Please select at least one cadence type' });
      return;
    }

    // Generate cadences
    setLoading(true);
    try {
      const result = await generateCadences({
        prospectName: sanitizedProspect,
        companyName: sanitizedCompany,
        cadenceTypes: selectedCadences
      });
      
      setCadences(result.cadences);
    } catch (error) {
      console.error('Error generating cadences:', error);
      setApiError(
        error.response?.data?.error ||
        'Failed to generate cadences. Please check your Azure OpenAI configuration and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProspectName('');
    setCompanyName('');
    setSelectedCadences([]);
    setErrors({});
    setCadences(null);
    setApiError(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-6 h-6 text-ibm-blue" />
          <h2 className="text-2xl font-bold text-gray-900">
            Generate Personalized Cadences
          </h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Prospect Name */}
          <div>
            <label htmlFor="prospectName" className="block text-sm font-medium text-gray-700 mb-2">
              Prospect Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="prospectName"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              className={`input-field ${errors.prospectName ? 'border-red-500' : ''}`}
              placeholder="e.g., Sarah Chen"
              disabled={loading}
            />
            {errors.prospectName && (
              <div className="mt-2 flex items-start space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errors.prospectName}</span>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
              placeholder="e.g., Goldman Sachs"
              disabled={loading}
            />
            {errors.companyName && (
              <div className="mt-2 flex items-start space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errors.companyName}</span>
              </div>
            )}
          </div>

          {/* Cadence Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Cadence Types <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CADENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCadences.includes(option.value)
                      ? 'border-ibm-blue bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCadences.includes(option.value)}
                    onChange={() => handleCadenceToggle(option.value)}
                    disabled={loading}
                    className="mt-1 h-4 w-4 text-ibm-blue border-gray-300 rounded focus:ring-ibm-blue"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{option.product}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.cadences && (
              <div className="mt-2 flex items-start space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errors.cadences}</span>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important:</p>
                <p>
                  Please provide <strong>real prospect and company names</strong>.
                  Do not use placeholders like {`{{Name}}`}, "TBD", "Acme Corp", or generic examples.
                  The AI will generate highly personalized cadences based on the actual company and industry.
                </p>
              </div>
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Error:</p>
                  <p>{apiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Cadences...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate {selectedCadences.length || ''} Cadence{selectedCadences.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
            
            {(cadences || prospectName || companyName) && !loading && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Generated Cadences */}
      {cadences && (
        <CadenceDisplay 
          cadences={cadences} 
          prospectName={prospectName}
          companyName={companyName}
        />
      )}
    </div>
  );
};

export default CadenceGenerator;

// Made with Bob
