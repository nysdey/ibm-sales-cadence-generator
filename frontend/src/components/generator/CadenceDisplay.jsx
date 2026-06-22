import { useState, useEffect } from 'react';
import { Copy, Check, Mail, Phone, Linkedin, Save } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const CadenceDisplay = ({ cadences, prospectName, companyName }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [savedEmails, setSavedEmails] = useState(new Set());

  // Auto-save emails when component mounts
  useEffect(() => {
    saveEmailsToDatabase();
  }, []);

  const saveEmailsToDatabase = async () => {
    try {
      // Save each email step to the database
      for (const cadence of cadences) {
        for (const step of cadence.steps) {
          if (step.channel.toLowerCase() === 'email') {
            const emailContent = step.subject
              ? `Subject: ${step.subject}\n\n${step.body}`
              : step.body;
            
            await axios.post(`${API_BASE_URL}/api/feedback/emails`, {
              prospectName,
              companyName,
              cadenceType: cadence.name,
              emailContent
            });
          }
        }
      }
    } catch (error) {
      console.error('Error saving emails:', error);
    }
  };

  const saveIndividualEmail = async (cadenceName, step) => {
    const emailKey = `${cadenceName}-${step.day}`;
    if (savedEmails.has(emailKey)) return;

    try {
      const emailContent = step.subject
        ? `Subject: ${step.subject}\n\n${step.body}`
        : step.body;
      
      await axios.post(`${API_BASE_URL}/api/feedback/emails`, {
        prospectName,
        companyName,
        cadenceType: cadenceName,
        emailContent
      });

      setSavedEmails(prev => new Set([...prev, emailKey]));
    } catch (error) {
      console.error('Error saving email:', error);
      alert('Failed to save email for feedback');
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return 'bg-blue-500/10 text-blue-300 border border-blue-500/30';
      case 'call':
        return 'bg-green-500/10 text-green-300 border border-green-500/30';
      case 'linkedin':
        return 'bg-purple-500/10 text-purple-300 border border-purple-500/30';
      default:
        return 'bg-white/5 text-gray-300 border border-border';
    }
  };

  const formatCadenceForCopy = (cadence) => {
    let text = `${cadence.name}\n`;
    text += `Target: ${cadence.targetPersona}\n`;
    text += `Value Proposition: ${cadence.valueProposition}\n\n`;
    
    cadence.steps.forEach((step, index) => {
      text += `--- Step ${index + 1}: Day ${step.day} - ${step.channel} ---\n`;
      if (step.subject) {
        text += `Subject: ${step.subject}\n\n`;
      }
      text += `${step.body}\n\n`;
    });
    
    return text;
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-400" />
          <p className="text-green-200 font-medium">
            Generated {cadences.length} personalized cadence{cadences.length !== 1 ? 's' : ''} for {prospectName} at {companyName}
          </p>
        </div>
      </div>

      {cadences.map((cadence, cadenceIndex) => (
        <div key={cadenceIndex} className="card">
          {/* Cadence Header */}
          <div className="border-b border-border pb-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {cadence.name}
                </h3>
                <div className="space-y-1 text-sm text-text-secondary">
                  <p><strong>Target:</strong> {cadence.targetPersona}</p>
                  <p><strong>Value Prop:</strong> {cadence.valueProposition}</p>
                  {cadence.triggerEvents && cadence.triggerEvents.length > 0 && (
                    <p><strong>Triggers:</strong> {cadence.triggerEvents.join(', ')}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(formatCadenceForCopy(cadence), `cadence-${cadenceIndex}`)}
                className="btn-secondary flex items-center space-x-2 ml-4"
              >
                {copiedId === `cadence-${cadenceIndex}` ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cadence Steps */}
          <div className="space-y-4">
            {cadence.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="border border-border rounded-lg p-4 hover:border-ibm-blue transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-text-tertiary">
                      Day {step.day}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${getChannelColor(step.channel)}`}>
                      {getChannelIcon(step.channel)}
                      <span>{step.channel}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {step.channel.toLowerCase() === 'email' && (
                      <button
                        onClick={() => saveIndividualEmail(cadence.name, step)}
                        className={`text-text-tertiary hover:text-text-primary transition-colors ${
                          savedEmails.has(`${cadence.name}-${step.day}`) ? 'text-green-400' : ''
                        }`}
                        title="Save for feedback"
                      >
                        {savedEmails.has(`${cadence.name}-${step.day}`) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(
                        step.subject ? `Subject: ${step.subject}\n\n${step.body}` : step.body,
                        `step-${cadenceIndex}-${stepIndex}`
                      )}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                      title="Copy this step"
                    >
                      {copiedId === `step-${cadenceIndex}-${stepIndex}` ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {step.subject && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-text-tertiary mb-1">Subject:</p>
                    <p className="text-sm font-semibold text-text-primary">{step.subject}</p>
                  </div>
                )}

                <div>
                  {step.channel.toLowerCase() === 'email' && (
                    <p className="text-xs font-medium text-text-tertiary mb-1">Email Body:</p>
                  )}
                  {step.channel.toLowerCase() === 'call' && (
                    <p className="text-xs font-medium text-text-tertiary mb-1">Call Script:</p>
                  )}
                  {step.channel.toLowerCase() === 'linkedin' && (
                    <p className="text-xs font-medium text-text-tertiary mb-1">LinkedIn Message:</p>
                  )}
                  <div className="text-sm text-text-secondary whitespace-pre-wrap bg-bg-raised p-3 rounded border border-border">
                    {step.body}
                  </div>
                </div>

                {step.cta && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs font-medium text-text-tertiary">CTA:</p>
                    <p className="text-sm text-ibm-blue font-medium">{step.cta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cadence Footer */}
          {cadence.differentiation && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-text-tertiary mb-1">Differentiation:</p>
              <p className="text-sm text-text-secondary">{cadence.differentiation}</p>
            </div>
          )}
        </div>
      ))}

      {/* Export Options */}
      <div className="card bg-bg-raised">
        <h4 className="font-semibold text-text-primary mb-2">Next Steps</h4>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Copy individual steps or entire cadences using the copy buttons above</li>
          <li>• Paste into Salesloft cadence builder</li>
          <li>• Adjust timing and channels based on your sales process</li>
          <li>• Track performance and refine based on results</li>
        </ul>
      </div>
    </div>
  );
};

export default CadenceDisplay;

// Made with Bob
