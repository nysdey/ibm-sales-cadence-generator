/**
 * Validation utilities for input data
 */

/**
 * Check if a string contains placeholder patterns
 * @param {string} value - String to check
 * @returns {boolean} - True if contains placeholders
 */
export const containsPlaceholder = (value) => {
  if (!value) return false;
  
  const placeholderPatterns = [
    /\{\{.*?\}\}/,           // {{ placeholder }}
    /\[.*?\]/,               // [placeholder]
    /\<.*?\>/,               // <placeholder>
    /TBD/i,                  // TBD
    /TODO/i,                 // TODO
    /PLACEHOLDER/i,          // PLACEHOLDER
    /example/i,              // example
    /test/i,                 // test (when used as placeholder)
    /sample/i,               // sample
    /^(your|my|the)\s/i,     // "your company", "my name", etc.
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(value));
};

/**
 * Validate prospect name
 * @param {string} name - Prospect name
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateProspectName = (name) => {
  if (!name || name.trim() === '') {
    return {
      valid: false,
      error: 'Prospect name is required'
    };
  }
  
  if (name.trim().length < 2) {
    return {
      valid: false,
      error: 'Prospect name must be at least 2 characters'
    };
  }
  
  if (containsPlaceholder(name)) {
    return {
      valid: false,
      error: 'Please provide a real prospect name (no placeholders like {{Name}}, TBD, etc.)'
    };
  }
  
  // Check for generic names that are likely placeholders
  const genericNames = ['john doe', 'jane doe', 'test user', 'example user', 'alex', 'bob'];
  if (genericNames.includes(name.toLowerCase().trim())) {
    return {
      valid: false,
      error: 'Please provide a real prospect name (not a generic example)'
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate company name
 * @param {string} company - Company name
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateCompanyName = (company) => {
  if (!company || company.trim() === '') {
    return {
      valid: false,
      error: 'Company name is required'
    };
  }
  
  if (company.trim().length < 2) {
    return {
      valid: false,
      error: 'Company name must be at least 2 characters'
    };
  }
  
  if (containsPlaceholder(company)) {
    return {
      valid: false,
      error: 'Please provide a real company name (no placeholders like {{Company}}, TBD, etc.)'
    };
  }
  
  // Check for generic company names
  const genericCompanies = [
    'acme', 'acme corp', 'acme corporation', 
    'example inc', 'example company', 'test company',
    'abc company', 'xyz corp', 'company name'
  ];
  if (genericCompanies.includes(company.toLowerCase().trim())) {
    return {
      valid: false,
      error: 'Please provide a real company name (not a generic example like "Acme Corp")'
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate both prospect and company
 * @param {string} prospectName - Prospect name
 * @param {string} companyName - Company name
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateInputs = (prospectName, companyName) => {
  const prospectValidation = validateProspectName(prospectName);
  const companyValidation = validateCompanyName(companyName);
  
  return {
    valid: prospectValidation.valid && companyValidation.valid,
    errors: {
      prospectName: prospectValidation.error,
      companyName: companyValidation.error
    }
  };
};

/**
 * Sanitize input string
 * @param {string} value - Input value
 * @returns {string} - Sanitized value
 */
export const sanitizeInput = (value) => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ');
};

// Made with Bob
