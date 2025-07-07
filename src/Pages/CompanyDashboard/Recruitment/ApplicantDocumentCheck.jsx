import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentCheckTable from './DocumentCheckTable';
import {
  ClockIcon,
  ArrowLeftIcon,
  XMarkIcon,
  DocumentTextIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

   const ApplicantDocumentCheck = ({ applicant, onHide }) => {
  const [activeChecks, setActiveChecks] = useState([]);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [formData, setFormData] = useState({ 
    name: '', 
    remark: '',
    position: '',
    date: new Date().toLocaleDateString()
  });
  const [formErrors, setFormErrors] = useState({});
  const [submissionState, setSubmissionState] = useState('idle');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [verificationDate] = useState(new Date());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // New state for saving changes

    const handleClose = () => {
    if (onHide) onHide();
  };
  
  const checklistItems = [
    "Is the passport or driver's license valid and clearly visible?",
    "Has the candidate provided a shared code or date of birth?",
    "Is a valid DBS certificate uploaded?",
    "Are the required training certificates submitted and verified?",
    "Is there a valid proof of address (utility bill, bank statement, etc.)?",
    "Has the right to work check been completed successfully?",
    "Are references from previous roles provided and verifiable?",
  ];

  // Create styles for PDF document
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      backgroundColor: '#FFFFFF'
    },
    header: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottom: '1px solid #7226FF'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#372580',
      textAlign: 'center',
      marginBottom: 5
    },
    subtitle: {
      fontSize: 12,
      color: '#372580',
      textAlign: 'center',
      marginBottom: 15
    },
    section: {
      marginBottom: 20
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#372580',
      marginBottom: 10,
      paddingBottom: 3,
      borderBottom: '1px solid #e5e7eb'
    },
    grid: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8
    },
    gridLabel: {
      width: '30%',
      fontWeight: 'bold',
      fontSize: 11
    },
    gridValue: {
      width: '70%',
      fontSize: 11
    },
    summaryBox: {
      backgroundColor: '#f7f5ff',
      padding: 15,
      borderRadius: 5,
      borderLeft: '4px solid #7226FF',
      marginBottom: 20
    },
    summaryTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#372580',
      marginBottom: 5
    },
    summaryStatus: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center'
    },
    complianceScore: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#372580',
      marginTop: 10,
      textAlign: 'center',
      backgroundColor: '#ebe6ff',
      padding: 8,
      borderRadius: 4
    },
    summaryText: {
      fontSize: 10,
      color: '#374151',
      lineHeight: 1.5,
      marginTop: 10
    },
    checklist: {
      marginBottom: 20
    },
    checklistItem: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'flex-start'
    },
    checkStatus: {
      width: 30,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#7226FF',
      marginRight: 5,
      textAlign: 'right'
    },
    checkText: {
      fontSize: 10,
      flex: 1
    },
    remarks: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: 4,
      padding: 10,
      minHeight: 60
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center'
    },
    footerText: {
      fontSize: 8,
      color: '#372580',
      marginTop: 3
    },
    signatureArea: {
      marginTop: 20,
      paddingTop: 10,
      borderTop: '1px dashed #cbd5e1'
    },
    signatureLine: {
      width: '60%',
      borderBottom: '1px solid #94a3b8',
      marginBottom: 5
    },
    signatureLabel: {
      fontSize: 10,
      color: '#64748b'
    }
  });

  // Save initial state when report is first generated
  useEffect(() => {
    if (submissionState === 'success' && !initialState) {
      setInitialState({
        activeChecks: [...activeChecks],
        formData: {...formData}
      });
    }
  }, [submissionState, activeChecks, formData, initialState]);

  // Detect changes after report is generated
  useEffect(() => {
    if (submissionState === 'success' && initialState) {
      const checksChanged = JSON.stringify(initialState.activeChecks) !== JSON.stringify(activeChecks);
      const formDataChanged = 
        initialState.formData.name !== formData.name ||
        initialState.formData.position !== formData.position ||
        initialState.formData.remark !== formData.remark;
      
      setHasChanges(checksChanged || formDataChanged);
    }
  }, [activeChecks, formData, submissionState, initialState]);

  // PDF Report Component
  const ComplianceReport = () => {
    // Calculate compliance score
    const totalItems = checklistItems.length;
    const verifiedItems = activeChecks.length;
    const complianceScore = Math.round((verifiedItems / totalItems) * 100);
    const isCompliant = complianceScore >= 80;
    
    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>COMPLIANCE VERIFICATION REPORT</Text>
            <Text style={styles.subtitle}>Generated on {verificationDate.toLocaleDateString()} at {verificationDate.toLocaleTimeString()}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Verification Details</Text>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Report ID:</Text>
              <Text style={styles.gridValue}>COMP-{Date.now().toString().slice(-6)}</Text>
            </View>
            
            <View style={styles.grid}>
            <Text style={styles.gridLabel}>Applicat  Name:</Text>
              <Text style={styles.gridValue}>{applicant?.name || 'Emma Johnson'}</Text>
            </View>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Application Date:</Text>
              <Text style={styles.gridValue}>06-30-2025</Text>
            </View>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Verification Date:</Text>
              <Text style={styles.gridValue}>{verificationDate.toLocaleDateString()}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Verifier Information</Text>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Verifier Name:</Text>
              <Text style={styles.gridValue}>{formData.name}</Text>
            </View>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Position:</Text>
              <Text style={styles.gridValue}>{formData.position || 'Compliance Officer'}</Text>
            </View>
            
            <View style={styles.grid}>
              <Text style={styles.gridLabel}>Verification Date:</Text>
              <Text style={styles.gridValue}>{verificationDate.toLocaleDateString()}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Verification Summary</Text>
            
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Overall Compliance Status</Text>
              <Text style={[styles.summaryStatus, { color: isCompliant ? '#16a34a' : '#dc2626' }]}>
                {isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
              </Text>
              
              <Text style={styles.complianceScore}>
                Compliance Score: {complianceScore}%
              </Text>
              
              <Text style={styles.summaryText}>
                {isCompliant 
                  ? `All required documents have been verified and meet the organization's compliance standards. 
                    The candidate has successfully passed all verification checks and is cleared for employment. 
                    This report is valid for 90 days from the date of issue.`
                  : `The candidate has not met the required compliance threshold (80%). 
                    Only ${verifiedItems} out of ${totalItems} documents were successfully verified. 
                    Additional documentation or verification is required before employment clearance.`}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Document Checklist</Text>
            
            <View style={styles.checklist}>
              {checklistItems.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <Text style={styles.checkStatus}>
                    {activeChecks.includes(index) ? 'Yes' : 'No'}
                  </Text>
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionHeader}>Verifier Remarks</Text>
            <View style={styles.remarks}>
              <Text style={{ fontSize: 10 }}>
                {formData.remark || "No additional remarks provided by the verifier."}
              </Text>
            </View>
          </View>
          
          <View style={styles.signatureArea}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>Verifier Signature</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>This compliance report was generated by the Automated Compliance Verification System</Text>
            <Text style={styles.footerText}>© {new Date().getFullYear()} Company Name. All rights reserved. CONFIDENTIAL</Text>
          </View>
        </Page>
      </Document>
    );
  };
  const toggleCheck = (index) => {
    setActiveChecks((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleContinue = () => {
    setDirection('forward');
    setShowVerificationForm(true);
    setShowSuccessAlert(false);
    setShowPdfViewer(false);
    setFormErrors({});
  };

  const handleGoBack = () => {
    setDirection('backward');
    setShowVerificationForm(false);
    setShowSuccessAlert(false);
    setShowPdfViewer(false);
    setFormErrors({});
  };

  const generatePdf = async () => {
    try {
      // Revoke previous URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      const blob = await pdf(<ComplianceReport />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Verifier name is required.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmissionState('submitting');

    setTimeout(async () => {
      setSubmissionState('generating');
      
      setTimeout(async () => {
        await generatePdf();
        setSubmissionState('success');
        setShowSuccessAlert(true);
        setShowVerificationForm(false);
        setDirection('backward');
        setFormErrors({});
      }, 3000);
    }, 3000);
  };

  const handleViewReport = () => {
    // Always show the current PDF URL, even if there are unsaved changes
    setShowPdfViewer(true);
  };

  const handleCloseViewer = () => {
    setShowPdfViewer(false);
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `compliance_report_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      generatePdf().then((url) => {
        if (url) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `compliance_report_${Date.now()}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Save changes and regenerate report
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Generate new PDF with updated data
      await generatePdf();
      
      // Update initial state to current values
      setInitialState({
        activeChecks: [...activeChecks],
        formData: {...formData}
      });
      
      // Simulate saving process for 3 seconds
      setTimeout(() => {
        setHasChanges(false);
        setIsSaving(false);
        setShowSuccessAlert(true);
        
        // Auto-hide success alert
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setIsSaving(false);
    }
  };

  // Clear all data and reset state
  const handleClearData = () => {
    // Revoke PDF URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    
    // Reset all state
    setActiveChecks([]);
    setShowVerificationForm(false);
    setDirection('forward');
    setFormData({ 
      name: '', 
      remark: '',
      position: '',
      date: new Date().toLocaleDateString() 
    });
    setFormErrors({});
    setSubmissionState('idle');
    setShowSuccessAlert(false);
    setShowPdfViewer(false);
    setPdfUrl(null);
    setShowClearConfirm(false);
    setHasChanges(false);
    setInitialState(null);
    setIsSaving(false);
  };

  const getSlideAnimation = () => ({
    initial: { x: direction === 'forward' ? 10 : -10, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction === 'forward' ? -10 : 10, opacity: 0 },
    transition: { duration: 0.4 }
  });

  const renderSubmitButtonContent = () => {
    switch (submissionState) {
      case 'submitting':
        return (
          <>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 15,
                height: 15,
                borderRadius: '50%',
                border: '3px solid #fff',
                borderTopColor: 'transparent',
                marginRight: 5,
                display: 'inline-block'
              }}
            />
            Submitting
          </>
        );
      case 'generating':
        return (
          <>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 15,
                height: 15,
                borderRadius: '50%',
                border: '3px solid #fff',
                borderTopColor: 'transparent',
                marginRight: 5,
                display: 'inline-block'
              }}
            />
            Generating Report
          </>
        );
      case 'success':
        return hasChanges ? (
          <>
            <DocumentTextIcon style={{ width: 18, height: 18, marginRight: 5 }} />
            Save Changes
          </>
        ) : (
          <>
            <DocumentTextIcon style={{ width: 18, height: 18, marginRight: 5 }} />
            View Compliance Report
          </>
        );
      default:
        return 'Submit';
    }
  };

  // Auto-hide success alert after 5 seconds
  useEffect(() => {
    if (showSuccessAlert && !hasChanges) {
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, hasChanges]);

  // Clean up PDF URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="DocComplianceCheck">
      <div className="DocComplianceCheck-Body" onClick={handleClose}></div>
      <button className="DocComplianceCheck-btn" onClick={handleClose}>
        <XMarkIcon />
      </button>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="DocComplianceCheck-Main"
      >
        <div className="DocComplianceCheck-Part">
          <div className="DocComplianceCheck-Part-Top">
            <h3>Compliance Check</h3>
          </div>

          <div className="ssen-regs">
            <div className="ssen-regs-1"><span>EM</span></div>
          <div className="ssen-regs-2">
            <div>
              <h4>{applicant?.name || 'Applicant Name'}</h4>
              <p>Applied: {applicant?.dateApplied || 'Date'}</p>
            </div>
          </div>
          </div>

          <div className="PPPOl-Seacs">
            <ul>
              <li>Uploaded Files</li>
              <li>
                <span>Status:
                  {submissionState === 'success' ? (
                    <b className="status completed">
                      <CheckCircleIcon /> Checked
                    </b>
                  ) : (
                    <b className="status pending">
                      <ClockIcon /> Pending
                    </b>
                  )}
                </span>
              </li>
            </ul>
            <ul>
            {submissionState === 'success' && (
                <li className="OIUkuja-BBtns">
                  <button
                    className="btn-primary-bg"
                    onClick={hasChanges ? handleSaveChanges : handleViewReport}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: '50%',
                            border: '3px solid #fff',
                            borderTopColor: 'transparent',
                            marginRight: 5,
                            display: 'inline-block'
                          }}
                        />
                        Saving...
                      </>
                    ) : hasChanges ? (
                      <>
                        <DocumentTextIcon />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon />
                        View Report
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={isSaving}
                    className='ClearDatt-BTn'
                  >
                    <ArrowPathIcon />
                    Clear Data
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="POlail-AAPAPl-Secc custom-scroll-bar">
            <DocumentCheckTable />
          </div>
        </div>

        <div className="DocComplianceCheck-Part">
          <div className="DocComplianceCheck-Part-Top">
            <h3>Document Verification</h3>
          </div>

          <AnimatePresence mode="wait">
            {!showVerificationForm ? (
              <motion.div
                key="checklist"
                {...getSlideAnimation()}
                className="POlails-Gtha custom-scroll-bar"
              >
                <h4>Checklist for Document Verification</h4>
                <ul className="checcck-lissT oikauk-Ola">
                  {checklistItems.map((item, index) => (
                    <li
                      key={index}
                      className={activeChecks.includes(index) ? 'active-Li-Check' : ''}
                      onClick={() => toggleCheck(index)}
                    >
                      {item} <span></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                {...getSlideAnimation()}
                className="POlails-Gtha custom-scroll-bar"
              >
                <div className="GGtg-DDDVa">
                  <label>Verifier Name: <span style={{ color: '#7226FF' }}>*</span></label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="oujka-Inpuauy"
                    required
                  />
                  {formErrors.name && (
                    <p className="erro-message-Txt">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="GGtg-DDDVa">
                  <label>Position:</label>
                  <input
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Your position/role"
                    className="oujka-Inpuauy"
                  />
                </div>

                <div className="GGtg-DDDVa">
                  <label>Remark (Optional):</label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="oujka-Inpuauy OIUja-Tettxa"
                    placeholder="Enter verification notes or comments"
                  />
                </div>
                <div className="compliance-consent-text">
                  <p>
                    By submitting this verification, you confirm that you have thoroughly reviewed all submitted documents and performed all necessary checks. 
                    An official compliance report will be generated with your name as the verifier.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={showVerificationForm ? 'form-buttons' : 'checklist-buttons'}
              className="oioak-POldj-BTn oikau-OOIl"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {showVerificationForm && (
                <button
                  className="CLCLCjm-BNtn"
                  onClick={handleGoBack}
                  disabled={submissionState === 'submitting' || submissionState === 'generating'}
                >
                  <ArrowLeftIcon />
                  Go Back
                </button>
              )}

              {!showVerificationForm ? (
                <button 
                  className="btn-primary-bg" 
                  onClick={handleContinue}
                  disabled={submissionState === 'submitting' || submissionState === 'generating'}
                >
                  Continue
                </button>
              ) : (
                <button
                  className={`btn-primary-bg ${submissionState === 'success' ? 'success-btn' : ''}`}
                  onClick={submissionState === 'success' ? 
                    (hasChanges ? handleSaveChanges : handleViewReport) : 
                    handleSubmit}
                  disabled={submissionState === 'submitting' || submissionState === 'generating'}
                  style={{ position: 'relative' }}
                >
                  {renderSubmitButtonContent()}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            className="alert-box success"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="success-alert-content">
              <div className="success-text">
                <h3>
                  {hasChanges ? "Changes Saved Successfully!" : "Compliance Check Successful!"}
                </h3>
                <p>
                  {hasChanges 
                    ? "The compliance report has been updated with your changes." 
                    : "The compliance report has been generated with your verification details."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showPdfViewer && pdfUrl && (
          <motion.div
            className="pdf-viewer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pdf-viewer-overlay" onClick={handleCloseViewer}></div>
            <motion.div
              className="pdf-viewer-container"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="pdf-viewer-header">
                <h3>
                  <DocumentTextIcon className="icon" />
                  Compliance Verification Report
                </h3>
                <div className="pdf-viewer-actions">
                  <button 
                    className="download-btn"
                    onClick={handleDownloadPdf}
                  >
                    <ArrowDownTrayIcon className="icon" />
                    Download
                  </button>
                  <button 
                    className="close-btn"
                    onClick={handleCloseViewer}
                  >
                    <XCircleIcon className="icon" />
                  </button>
                </div>
              </div>
              <div className="pdf-viewer-content">
                <iframe 
                  src={pdfUrl} 
                  title="Compliance Report"
                  width="100%" 
                  height="100%"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="confirmation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="confirmation-overlay" onClick={() => setShowClearConfirm(false)}></div>
            <motion.div
              className="confirmation-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="confirmation-header">
                <h3>Confirm Clear Data</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowClearConfirm(false)}
                >
                  <XMarkIcon className="icon" />
                </button>
              </div>
              <div className="confirmation-body">
                   <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <ExclamationTriangleIcon className="w-10 h-10 text-yellow-500" />
                  </motion.div>
                <p>Are you sure you want to clear all verification data? This action cannot be undone. All checks, form data, and the generated report will be permanently removed.</p>
              </div>
               <div className="oioak-POldj-BTn clOIkka-BBBTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  className="CLCLCjm-BNtn"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary-bg"
                  onClick={handleClearData}
                >
                  Confirm Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantDocumentCheck;





























































































// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ClockIcon,
//   ArrowLeftIcon,
//   XMarkIcon,
//   DocumentTextIcon,
//   XCircleIcon,
//   ArrowDownTrayIcon,
//   ArrowPathIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon
// } from '@heroicons/react/24/outline';
// import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import SampleCV from '../../../assets/resume.pdf';
// import { updateApplicantComplianceStatus } from  './ApiService';// Assume API function

// const ApplicantDocumentCheck = ({ applicant, complianceChecklist, onHide, onComplianceStatusChange }) => {
//   const [activeChecks, setActiveChecks] = useState([]);
//   const [showVerificationForm, setShowVerificationForm] = useState(false);
//   const [direction, setDirection] = useState('forward');
//   const [formData, setFormData] = useState({
//     name: '',
//     remark: '',
//     position: '',
//     date: new Date().toLocaleDateString()
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [submissionState, setSubmissionState] = useState('idle');
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [showPdfViewer, setShowPdfViewer] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [verificationDate] = useState(new Date());
//   const [showClearConfirm, setShowClearConfirm] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [initialState, setInitialState] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [notes, setNotes] = useState({});

//   // Initialize activeChecks and notes from applicant's compliance_status
//   useEffect(() => {
//     if (applicant?.compliance_status) {
//       const initialChecks = applicant.compliance_status
//         .filter(item => item.status === 'completed')
//         .map(item => item.id);
//       const initialNotes = applicant.compliance_status.reduce((acc, item) => ({
//         ...acc,
//         [item.id]: item.notes || ''
//       }), {});
//       setActiveChecks(initialChecks);
//       setNotes(initialNotes);
//     }
//   }, [applicant]);

//   // Save initial state when report is first generated
//   useEffect(() => {
//     if (submissionState === 'success' && !initialState) {
//       setInitialState({
//         activeChecks: [...activeChecks],
//         formData: { ...formData },
//         notes: { ...notes }
//       });
//     }
//   }, [submissionState, activeChecks, formData, notes]);

//   // Detect changes after report is generated
//   useEffect(() => {
//     if (submissionState === 'success' && initialState) {
//       const checksChanged = JSON.stringify(initialState.activeChecks) !== JSON.stringify(activeChecks);
//       const formDataChanged =
//         initialState.formData.name !== formData.name ||
//         initialState.formData.position !== formData.position ||
//         initialState.formData.remark !== formData.remark;
//       const notesChanged = JSON.stringify(initialState.notes) !== JSON.stringify(notes);
//       setHasChanges(checksChanged || formDataChanged || notesChanged);
//     }
//   }, [activeChecks, formData, notes, submissionState, initialState]);

//   // Clean up PDF URL when component unmounts
//   useEffect(() => {
//     return () => {
//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//       }
//     };
//   }, [pdfUrl]);

//   // Auto-hide success alert after 5 seconds
//   useEffect(() => {
//     if (showSuccessAlert && !hasChanges) {
//       const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [showSuccessAlert, hasChanges]);

//   // PDF Report Component
//   const ComplianceReport = () => {
//     const totalItems = complianceChecklist.length;
//     const verifiedItems = activeChecks.length;
//     const complianceScore = totalItems > 0 ? Math.round((verifiedItems / totalItems) * 100) : 0;
//     const isCompliant = complianceScore >= 80;

//     return (
//       <Document>
//         <Page style={styles.page}>
//           <View style={styles.header}>
//             <Text style={styles.title}>COMPLIANCE VERIFICATION REPORT</Text>
//             <Text style={styles.subtitle}>Generated on {verificationDate.toLocaleDateString()} at {verificationDate.toLocaleTimeString()}</Text>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Verification Details</Text>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Report ID:</Text>
//               <Text style={styles.gridValue}>COMP-{Date.now().toString().slice(-6)}</Text>
//             </View>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Applicant Name:</Text>
//               <Text style={styles.gridValue}>{applicant?.full_name || 'Unknown'}</Text>
//             </View>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Application Date:</Text>
//               <Text style={styles.gridValue}>{applicant?.applied_at?.split('T')[0] || 'Unknown'}</Text>
//             </View>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Verification Date:</Text>
//               <Text style={styles.gridValue}>{verificationDate.toLocaleDateString()}</Text>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Verifier Information</Text>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Verifier Name:</Text>
//               <Text style={styles.gridValue}>{formData.name}</Text>
//             </View>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Position:</Text>
//               <Text style={styles.gridValue}>{formData.position || 'Compliance Officer'}</Text>
//             </View>
//             <View style={styles.grid}>
//               <Text style={styles.gridLabel}>Verification Date:</Text>
//               <Text style={styles.gridValue}>{verificationDate.toLocaleDateString()}</Text>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Verification Summary</Text>
//             <View style={styles.summaryBox}>
//               <Text style={styles.summaryTitle}>Overall Compliance Status</Text>
//               <Text style={[styles.summaryStatus, { color: isCompliant ? '#16a34a' : '#dc2626' }]}>
//                 {isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
//               </Text>
//               <Text style={styles.complianceScore}>
//                 Compliance Score: {complianceScore}%
//               </Text>
//               <Text style={styles.summaryText}>
//                 {isCompliant
//                   ? `All required documents have been verified and meet the organization's compliance standards. The candidate is cleared for employment.`
//                   : `The candidate has not met the required compliance threshold (80%). Only ${verifiedItems} out of ${totalItems} items were verified. Additional verification is required.`}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Compliance Checklist</Text>
//             <View style={styles.checklist}>
//               {complianceChecklist.map((item) => (
//                 <View key={item.id} style={styles.checklistItem}>
//                   <Text style={styles.checkStatus}>
//                     {activeChecks.includes(item.id) ? 'Yes' : applicant.compliance_status.find(ai => ai.id === item.id)?.status === 'failed' ? 'No (Failed)' : 'No'}
//                   </Text>
//                   <Text style={styles.checkText}>{item.name}</Text>
//                   {notes[item.id] && (
//                     <Text style={styles.checkText}>Notes: {notes[item.id]}</Text>
//                   )}
//                 </View>
//               ))}
//             </View>

//             <Text style={styles.sectionHeader}>Verifier Remarks</Text>
//             <View style={styles.remarks}>
//               <Text style={{ fontSize: 10 }}>
//                 {formData.remark || "No additional remarks provided by the verifier."}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.signatureArea}>
//             <View style={styles.signatureLine}></View>
//             <Text style={styles.signatureLabel}>Verifier Signature</Text>
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Generated by Automated Compliance Verification System</Text>
//             <Text style={styles.footerText}>© {new Date().getFullYear()} Company Name. All rights reserved. CONFIDENTIAL</Text>
//           </View>
//         </Page>
//       </Document>
//     );
//   };

//   // Styles for PDF (unchanged from original)
//   const styles = StyleSheet.create({
//     page: {
//       padding: 40,
//       fontFamily: 'Helvetica',
//       backgroundColor: '#FFFFFF'
//     },
//     header: {
//       marginBottom: 20,
//       paddingBottom: 15,
//       borderBottom: '1px solid #7226FF'
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       color: '#372580',
//       textAlign: 'center',
//       marginBottom: 5
//     },
//     subtitle: {
//       fontSize: 12,
//       color: '#372580',
//       textAlign: 'center',
//       marginBottom: 15
//     },
//     section: {
//       marginBottom: 20
//     },
//     sectionHeader: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#372580',
//       marginBottom: 10,
//       paddingBottom: 3,
//       borderBottom: '1px solid #e5e7eb'
//     },
//     grid: {
//       display: 'flex',
//       flexDirection: 'row',
//       marginBottom: 8
//     },
//     gridLabel: {
//       width: '30%',
//       fontWeight: 'bold',
//       fontSize: 11
//     },
//     gridValue: {
//       width: '70%',
//       fontSize: 11
//     },
//     summaryBox: {
//       backgroundColor: '#f7f5ff',
//       padding: 15,
//       borderRadius: 5,
//       borderLeft: '4px solid #7226FF',
//       marginBottom: 20
//     },
//     summaryTitle: {
//       fontSize: 14,
//       fontWeight: 'bold',
//       color: '#372580',
//       marginBottom: 5
//     },
//     summaryStatus: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       textAlign: 'center'
//     },
//     complianceScore: {
//       fontSize: 14,
//       fontWeight: 'bold',
//       color: '#372580',
//       marginTop: 10,
//       textAlign: 'center',
//       backgroundColor: '#ebe6ff',
//       padding: 8,
//       borderRadius: 4
//     },
//     summaryText: {
//       fontSize: 10,
//       color: '#374151',
//       lineHeight: 1.5,
//       marginTop: 10
//     },
//     checklist: {
//       marginBottom: 20
//     },
//     checklistItem: {
//       display: 'flex',
//       flexDirection: 'row',
//       marginBottom: 8,
//       alignItems: 'flex-start'
//     },
//     checkStatus: {
//       width: 30,
//       fontSize: 10,
//       fontWeight: 'bold',
//       color: '#7226FF',
//       marginRight: 5,
//       textAlign: 'right'
//     },
//     checkText: {
//       fontSize: 10,
//       flex: 1
//     },
//     remarks: {
//       backgroundColor: '#f9fafb',
//       border: '1px solid #e5e7eb',
//       borderRadius: 4,
//       padding: 10,
//       minHeight: 60
//     },
//     footer: {
//       position: 'absolute',
//       bottom: 30,
//       left: 40,
//       right: 40,
//       textAlign: 'center'
//     },
//     footerText: {
//       fontSize: 8,
//       color: '#372580',
//       marginTop: 3
//     },
//     signatureArea: {
//       marginTop: 20,
//       paddingTop: 10,
//       borderTop: '1px dashed #cbd5e1'
//     },
//     signatureLine: {
//       width: '60%',
//       borderBottom: '1px solid #94a3b8',
//       marginBottom: 5
//     },
//     signatureLabel: {
//       fontSize: 10,
//       color: '#64748b'
//     }
//   });

//   const toggleCheck = async (itemId) => {
//     const newStatus = activeChecks.includes(itemId) ? 'pending' : 'completed';
//     try {
//       await onComplianceStatusChange(applicant.id, itemId, newStatus, notes[itemId] || '');
//       setActiveChecks((prev) =>
//         prev.includes(itemId)
//           ? prev.filter((id) => id !== itemId)
//           : [...prev, itemId]
//       );
//     } catch (error) {
//       console.error('Error updating compliance status:', error);
//     }
//   };

//   const handleNoteChange = (itemId, value) => {
//     setNotes((prev) => ({ ...prev, [itemId]: value }));
//   };

//   const handleContinue = () => {
//     setDirection('forward');
//     setShowVerificationForm(true);
//     setShowSuccessAlert(false);
//     setShowPdfViewer(false);
//     setFormErrors({});
//   };

//   const handleGoBack = () => {
//     setDirection('backward');
//     setShowVerificationForm(false);
//     setShowSuccessAlert(false);
//     setShowPdfViewer(false);
//     setFormErrors({});
//   };

//   const generatePdf = async () => {
//     try {
//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//       }
//       const blob = await pdf(<ComplianceReport />).toBlob();
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);
//       return url;
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       return null;
//     }
//   };

//   const handleSubmit = async () => {
//     const errors = {};
//     if (!formData.name.trim()) {
//       errors.name = 'Verifier name is required.';
//     }
//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) return;

//     setSubmissionState('submitting');
//     try {
//       // Update all compliance statuses
//       for (const item of complianceChecklist) {
//         const currentStatus = applicant.compliance_status.find(ai => ai.id === item.id)?.status || 'pending';
//         const newStatus = activeChecks.includes(item.id) ? 'completed' : currentStatus === 'failed' ? 'failed' : 'pending';
//         if (newStatus !== currentStatus) {
//           await onComplianceStatusChange(applicant.id, item.id, newStatus, notes[item.id] || '');
//         }
//       }
//       setTimeout(async () => {
//         setSubmissionState('generating');
//         setTimeout(async () => {
//           await generatePdf();
//           setSubmissionState('success');
//           setShowSuccessAlert(true);
//           setShowVerificationForm(false);
//           setDirection('backward');
//           setFormErrors({});
//         }, 3000);
//       }, 3000);
//     } catch (error) {
//       console.error('Error submitting compliance checks:', error);
//       setSubmissionState('idle');
//     }
//   };

//   const handleViewReport = () => {
//     setShowPdfViewer(true);
//   };

//   const handleCloseViewer = () => {
//     setShowPdfViewer(false);
//   };

//   const handleDownloadPdf = () => {
//     if (pdfUrl) {
//       const a = document.createElement('a');
//       a.href = pdfUrl;
//       a.download = `compliance_report_${applicant?.full_name || 'applicant'}_${Date.now()}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } else {
//       generatePdf().then((url) => {
//         if (url) {
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = `compliance_report_${applicant?.full_name || 'applicant'}_${Date.now()}.pdf`;
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);
//         }
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSaveChanges = async () => {
//     setIsSaving(true);
//     try {
//       // Update compliance statuses
//       for (const item of complianceChecklist) {
//         const currentStatus = applicant.compliance_status.find(ai => ai.id === item.id)?.status || 'pending';
//         const newStatus = activeChecks.includes(item.id) ? 'completed' : currentStatus === 'failed' ? 'failed' : 'pending';
//         if (newStatus !== currentStatus || notes[item.id] !== (applicant.compliance_status.find(ai => ai.id === item.id)?.notes || '')) {
//           await onComplianceStatusChange(applicant.id, item.id, newStatus, notes[item.id] || '');
//         }
//       }
//       await generatePdf();
//       setInitialState({
//         activeChecks: [...activeChecks],
//         formData: { ...formData },
//         notes: { ...notes }
//       });
//       setTimeout(() => {
//         setHasChanges(false);
//         setIsSaving(false);
//         setShowSuccessAlert(true);
//         setTimeout(() => setShowSuccessAlert(false), 3000);
//       }, 3000);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       setIsSaving(false);
//     }
//   };

//   const handleClearData = () => {
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//     }
//     setActiveChecks([]);
//     setShowVerificationForm(false);
//     setDirection('forward');
//     setFormData({
//       name: '',
//       remark: '',
//       position: '',
//       date: new Date().toLocaleDateString()
//     });
//     setFormErrors({});
//     setSubmissionState('idle');
//     setShowSuccessAlert(false);
//     setShowPdfViewer(false);
//     setPdfUrl(null);
//     setShowClearConfirm(false);
//     setHasChanges(false);
//     setInitialState(null);
//     setIsSaving(false);
//     setNotes({});
//     // Note: We don't reset backend compliance_status here to avoid unintended data loss
//   };

//   const getSlideAnimation = () => ({
//     initial: { x: direction === 'forward' ? 10 : -10, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//     exit: { x: direction === 'forward' ? -10 : 10, opacity: 0 },
//     transition: { duration: 0.4 }
//   });

//   const renderSubmitButtonContent = () => {
//     switch (submissionState) {
//       case 'submitting':
//         return (
//           <>
//             <motion.div
//               initial={{ rotate: 0 }}
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//               style={{
//                 width: 15,
//                 height: 15,
//                 borderRadius: '50%',
//                 border: '3px solid #fff',
//                 borderTopColor: 'transparent',
//                 marginRight: 5,
//                 display: 'inline-block'
//               }}
//             />
//             Submitting
//           </>
//         );
//       case 'generating':
//         return (
//           <>
//             <motion.div
//               initial={{ rotate: 0 }}
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//               style={{
//                 width: 15,
//                 height: 15,
//                 borderRadius: '50%',
//                 border: '3px solid #fff',
//                 borderTopColor: 'transparent',
//                 marginRight: 5,
//                 display: 'inline-block'
//               }}
//             />
//             Generating Report
//           </>
//         );
//       case 'success':
//         return hasChanges ? (
//           <>
//             <DocumentTextIcon style={{ width: 18, height: 18, marginRight: 5 }} />
//             Save Changes
//           </>
//         ) : (
//           <>
//             <DocumentTextIcon style={{ width: 18, height: 18, marginRight: 5 }} />
//             View Compliance Report
//           </>
//         );
//       default:
//         return 'Submit';
//     }
//   };

//   return (
//     <div className="DocComplianceCheck">
//       <div className="DocComplianceCheck-Body" onClick={onHide}></div>
//       <button className="DocComplianceCheck-btn" onClick={onHide}>
//         <XMarkIcon />
//       </button>

//       <motion.div
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="DocComplianceCheck-Main"
//       >
//         <div className="DocComplianceCheck-Part">
//           <div className="DocComplianceCheck-Part-Top">
//             <h3>Compliance Check for {applicant?.full_name || 'Applicant'}</h3>
//           </div>

//           <div className="ssen-regs">
//             <div className="ssen-regs-1"><span>{applicant?.full_name?.charAt(0) || 'A'}</span></div>
//             <div className="ssen-regs-2">
//               <div>
//                 <h4>{applicant?.full_name || 'Applicant Name'}</h4>
//                 <p>Applied: {applicant?.applied_at?.split('T')[0] || 'Unknown'}</p>
//               </div>
//             </div>
//           </div>

//           <div className="PPPOl-Seacs">
//             <ul>
//               <li>Uploaded Files</li>
//               <li>
//                 <span>Status:
//                   {submissionState === 'success' ? (
//                     <b className="status completed">
//                       <CheckCircleIcon /> Checked
//                     </b>
//                   ) : (
//                     <b className="status pending">
//                       <ClockIcon /> Pending
//                     </b>
//                   )}
//                 </span>
//               </li>
//             </ul>
//             <ul>
//               <li className="OIUkuja-BBtns">
//                 <a
//                   href={applicant?.documents?.[0]?.file_url || SampleCV}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="view-btn"
//                 >
//                   <DocumentTextIcon />
//                   View Documents
//                 </a>
//               </li>
//               {submissionState === 'success' && (
//                 <li className="OIUkuja-BBtns">
//                   <button
//                     className="btn-primary-bg"
//                     onClick={hasChanges ? handleSaveChanges : handleViewReport}
//                     disabled={isSaving}
//                   >
//                     {isSaving ? (
//                       <>
//                         <motion.div
//                           initial={{ rotate: 0 }}
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                           style={{
//                             width: 15,
//                             height: 15,
//                             borderRadius: '50%',
//                             border: '3px solid #fff',
//                             borderTopColor: 'transparent',
//                             marginRight: 5,
//                             display: 'inline-block'
//                           }}
//                         />
//                         Saving...
//                       </>
//                     ) : hasChanges ? (
//                       <>
//                         <DocumentTextIcon />
//                         Save Changes
//                       </>
//                     ) : (
//                       <>
//                         <DocumentTextIcon />
//                         View Report
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => setShowClearConfirm(true)}
//                     disabled={isSaving}
//                     className='ClearDatt-BTn'
//                   >
//                     <ArrowPathIcon />
//                     Clear Data
//                   </button>
//                 </li>
//               )}
//             </ul>
//           </div>

//           <div className="POlail-AAPAPl-Secc custom-scroll-bar">
//             {/* Placeholder for DocumentCheckTable if needed */}
//           </div>
//         </div>

//         <div className="DocComplianceCheck-Part">
//           <div className="DocComplianceCheck-Part-Top">
//             <h3>Document Verification</h3>
//           </div>

//           <AnimatePresence mode="wait">
//             {!showVerificationForm ? (
//               <motion.div
//                 key="checklist"
//                 {...getSlideAnimation()}
//                 className="POlails-Gtha custom-scroll-bar"
//               >
//                 <h4>Compliance Checklist</h4>
//                 <ul className="checcck-lissT oikauk-Ola">
//                   {complianceChecklist.map((item) => {
//                     const applicantItem = applicant.compliance_status.find(ai => ai.id === item.id) || { status: 'pending', notes: '' };
//                     return (
//                       <li
//                         key={item.id}
//                         className={activeChecks.includes(item.id) ? 'active-Li-Check' : applicantItem.status === 'failed' ? 'failed-Li-Check' : ''}
//                       >
//                         <div onClick={() => toggleCheck(item.id)}>
//                           {item.name} {item.required && <span style={{ color: '#7226FF' }}>*</span>}
//                           <p>{item.description}</p>
//                           <span className={`status ${applicantItem.status.toLowerCase()}`}>
//                             {applicantItem.status}
//                           </span>
//                         </div>
//                         <textarea
//                           value={notes[item.id] || applicantItem.notes}
//                           onChange={(e) => handleNoteChange(item.id, e.target.value)}
//                           placeholder="Add notes..."
//                           className="oujka-Inpuauy OIUja-Tettxa"
//                         />
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="form"
//                 {...getSlideAnimation()}
//                 className="POlails-Gtha custom-scroll-bar"
//               >
//                 <div className="GGtg-DDDVa">
//                   <label>Verifier Name: <span style={{ color: '#7226FF' }}>*</span></label>
//                   <input
//                     name="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter your full name"
//                     className="oujka-Inpuauy"
//                     required
//                   />
//                   {formErrors.name && (
//                     <p className="erro-message-Txt">
//                       {formErrors.name}
//                     </p>
//                   )}
//                 </div>

//                 <div className="GGtg-DDDVa">
//                   <label>Position:</label>
//                   <input
//                     name="position"
//                     type="text"
//                     value={formData.position}
//                     onChange={handleInputChange}
//                     placeholder="Your position/role"
//                     className="oujka-Inpuauy"
//                   />
//                 </div>

//                 <div className="GGtg-DDDVa">
//                   <label>Remark (Optional):</label>
//                   <textarea
//                     name="remark"
//                     value={formData.remark}
//                     onChange={handleInputChange}
//                     className="oujka-Inpuauy OIUja-Tettxa"
//                     placeholder="Enter verification notes or comments"
//                   />
//                 </div>
//                 <div className="compliance-consent-text">
//                   <p>
//                     By submitting this verification, you confirm that you have thoroughly reviewed all submitted documents and performed all necessary checks.
//                     An official compliance report will be generated with your name as the verifier.
//                   </p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={showVerificationForm ? 'form-buttons' : 'checklist-buttons'}
//               className="oioak-POldj-BTn oikau-OOIl"
//               initial={{ x: 10, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -10, opacity: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               {showVerificationForm && (
//                 <button
//                   className="CLCLCjm-BNtn"
//                   onClick={handleGoBack}
//                   disabled={submissionState === 'submitting' || submissionState === 'generating'}
//                 >
//                   <ArrowLeftIcon />
//                   Go Back
//                 </button>
//               )}

//               {!showVerificationForm ? (
//                 <button
//                   className="btn-primary-bg"
//                   onClick={handleContinue}
//                   disabled={submissionState === 'submitting' || submissionState === 'generating'}
//                 >
//                   Continue
//                 </button>
//               ) : (
//                 <button
//                   className={`btn-primary-bg ${submissionState === 'success' ? 'success-btn' : ''}`}
//                   onClick={submissionState === 'success' ?
//                     (hasChanges ? handleSaveChanges : handleViewReport) :
//                     handleSubmit}
//                   disabled={submissionState === 'submitting' || submissionState === 'generating'}
//                 >
//                   {renderSubmitButtonContent()}
//                 </button>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {showSuccessAlert && (
//           <motion.div
//             className="alert-box success"
//             initial={{ y: -40, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="success-alert-content">
//               <div className="success-text">
//                 <h3>
//                   {hasChanges ? "Changes Saved Successfully!" : "Compliance Check Successful!"}
//                 </h3>
//                 <p>
//                   {hasChanges
//                     ? "The compliance report has been updated with your changes."
//                     : "The compliance report has been generated with your verification details."}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showPdfViewer && pdfUrl && (
//           <motion.div
//             className="pdf-viewer-modal"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="pdf-viewer-overlay" onClick={handleCloseViewer}></div>
//             <motion.div
//               className="pdf-viewer-container"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//             >
//               <div className="pdf-viewer-header">
//                 <h3>
//                   <DocumentTextIcon className="icon" />
//                   Compliance Verification Report
//                 </h3>
//                 <div className="pdf-viewer-actions">
//                   <button
//                     className="download-btn"
//                     onClick={handleDownloadPdf}
//                   >
//                     <ArrowDownTrayIcon className="icon" />
//                     Download
//                   </button>
//                   <button
//                     className="close-btn"
//                     onClick={handleCloseViewer}
//                   >
//                     <XCircleIcon className="icon" />
//                   </button>
//                 </div>
//               </div>
//               <div className="pdf-viewer-content">
//                 <iframe
//                   src={pdfUrl}
//                   title="Compliance Report"
//                   width="100%"
//                   height="100%"
//                 />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showClearConfirm && (
//           <motion.div
//             className="confirmation-modal"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="confirmation-overlay" onClick={() => setShowClearConfirm(false)}></div>
//             <motion.div
//               className="confirmation-content"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//             >
//               <div className="confirmation-header">
//                 <h3>Confirm Clear Data</h3>
//                 <button
//                   className="close-btn"
//                   onClick={() => setShowClearConfirm(false)}
//                 >
//                   <XMarkIcon className="icon" />
//                 </button>
//               </div>
//               <div className="confirmation-body">
//                 <motion.div
//                   initial={{ y: -50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{
//                     type: 'spring',
//                     stiffness: 500,
//                     damping: 15,
//                   }}
//                 >
//                   <ExclamationTriangleIcon className="w-10 h-10 text-yellow-500" />
//                 </motion.div>
//                 <p>Are you sure you want to clear all verification data? This action will reset local changes but will not affect saved compliance statuses.</p>
//               </div>
//               <div className="oioak-POldj-BTn clOIkka-BBBTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
//                 <button
//                   className="CLCLCjm-BNtn"
//                   onClick={() => setShowClearConfirm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-bg"
//                   onClick={handleClearData}
//                 >
//                   Confirm Clear
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ApplicantDocumentCheck;