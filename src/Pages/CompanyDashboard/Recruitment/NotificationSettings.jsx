import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { apiClient } from './ApiService';

/* ---------- Default Templates for Fallback ---------- */
const defaultTemplates = {
  interviewScheduling: {
    content: `Hello [Candidate Name],\n\nWe’re pleased to invite you to an interview for the [Position] role at [Company].\nPlease let us know your availability so we can confirm a convenient time.\n\nBest regards,\n[Your Name]`,
    is_auto_sent: false,
  },
  interviewRescheduling: {
    content: `Hello [Candidate Name],\n\nDue to unforeseen circumstances, we need to reschedule your interview originally set for [Old Date/Time]. Kindly share a few alternative slots that work for you.\n\nThanks for your understanding,\n[Your Name]`,
    is_auto_sent: false,
  },
  interviewRejection: {
    content: `Hello [Candidate Name],\n\nThank you for taking the time to interview. After careful consideration, we have decided not to move forward.\n\nBest wishes,\n[Your Name]`,
    is_auto_sent: false,
  },
  interviewAcceptance: {
    content: `Hello [Candidate Name],\n\nCongratulations! We are moving you to the next stage. We’ll follow up with next steps.\n\nLooking forward,\n[Your Name]`,
    is_auto_sent: false,
  },
  jobRejection: {
    content: `Hello [Candidate Name],\n\nThank you for applying. Unfortunately, we’ve chosen another candidate at this time.\n\nKind regards,\n[Your Name]`,
    is_auto_sent: false,
  },
  jobAcceptance: {
    content: `Hello [Candidate Name],\n\nWe’re excited to offer you the [Position] role at [Company]! Please find the offer letter attached.\n\nWelcome aboard!\n[Your Name]`,
    is_auto_sent: false,
  },
};

/* ---------- Floating Success Alert ---------- */
const SuccessAlert = ({ message, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="success-alert"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#38a169',
          color: '#fff',
          padding: '10px 20px',
          fontSize: 11,
          borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
        }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------- Reusable Template Editor ---------- */
const EmailTemplateEditor = ({ id, template, triggerGlobalSuccess, updateTemplate }) => {
  const [content, setContent] = useState(template.content);
  const [isAutoSent, setIsAutoSent] = useState(template.is_auto_sent);
  const [isDirty, setIsDirty] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

  /* Sync state with template prop changes */
  useEffect(() => {
    //console.log(`EmailTemplateEditor (${id}) received template:`, template);
    setContent(template.content);
    setIsAutoSent(template.is_auto_sent);
    setIsDirty(false);
  }, [template]);

  /* Autoresize on mount and content change */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  /* Autoresize while typing */
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    setContent(el.value);
    setIsDirty(el.value !== template.content || isAutoSent !== template.is_auto_sent);
  };

  /* Handle automation toggle */
  const handleAutoSendToggle = () => {
    setIsAutoSent((prev) => !prev);
    setIsDirty((prev) => content !== template.content || !isAutoSent !== template.is_auto_sent);
  };

  /* Save template via API */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedTemplate = { [id]: { content, is_auto_sent: isAutoSent } };
      // console.log(`Saving template (${id}):`, updatedTemplate);
      await apiClient.patch('/api/tenant/config/', { email_templates: updatedTemplate });
      setIsDirty(false);
      updateTemplate(id, { content, is_auto_sent: isAutoSent });
      triggerGlobalSuccess(
        `"${id.replace(/([a-z])([A-Z])/g, '$1 $2')}" notification updated successfully!`
      );
    } catch (error) {
      console.error('Error saving template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save notification. Please try again.';
      triggerGlobalSuccess(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  /* Slide-down bar animation variants */
  const barVariants = {
    hidden: { opacity: 0, y: -10, height: 0, overflow: 'hidden' },
    shown: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { type: 'spring', stiffness: 260, damping: 24 },
    },
  };

  const showBar = focused || isDirty || isSaving;

  return (
    <div className="GGtg-DDDVa">
      <textarea
        ref={textareaRef}
        id={id}
        className="oujka-Inpuauy OIUja-Tettxa"
        value={content}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleInput}
        style={{ overflow: 'hidden', whiteSpace: 'pre-wrap' }}
      />
      <div className="mt-2">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isAutoSent}
            onChange={handleAutoSendToggle}
            className="form-checkbox h-5 w-5 text-gray-600"
          />
          <span className="ml-2 text-sm">Send Automatically</span>
        </label>
      </div>
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="oioak-POldj-BTn ookk-Saoksl"
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={barVariants}
          >
            <button
              className="btn-primary-bg"
              onClick={handleSave}
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {isSaving && (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    marginRight: 6,
                  }}
                />
              )}
              {isSaving ? 'Saving...' : 'Save Update'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Main Notification Settings ---------- */
const NotificationSettings = () => {
  const [globalSuccess, setGlobalSuccess] = useState({ show: false, message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState(defaultTemplates);

  /* Fetch or create templates on mount */
  useEffect(() => {
    const fetchOrCreateTemplates = async () => {
      try {
        const response = await apiClient.get('/api/tenant/config/');
        const fetchedTemplates = response.data.email_templates || {};
        //console.log('Fetched templates:', fetchedTemplates);

        // Merge fetched templates with defaults
        const mergedTemplates = { ...defaultTemplates };
        Object.keys(defaultTemplates).forEach((key) => {
          mergedTemplates[key] = {
            content: fetchedTemplates[key]?.content || defaultTemplates[key].content,
            is_auto_sent: fetchedTemplates[key]?.is_auto_sent ?? defaultTemplates[key].is_auto_sent,
          };
        });
       // console.log('Merged templates:', mergedTemplates);
        setTemplates(mergedTemplates);
      } catch (error) {
        if (error.response?.status === 404 && error.response?.data?.message === 'Tenant config not found') {
          try {
            // Create TenantConfig with default templates
            await apiClient.post('/api/tenant/config/', { email_templates: defaultTemplates });
           // console.log('Created TenantConfig with default templates');
            setTemplates(defaultTemplates);
            setGlobalSuccess({ show: true, message: 'Tenant configuration created with default notifications.' });
            setTimeout(() => setGlobalSuccess({ show: false, message: '' }), 2000);
          } catch (createError) {
            console.error('Error creating tenant config:', createError);
            setGlobalSuccess({ show: true, message: 'Failed to create tenant configuration. Using default notifications.' });
            setTimeout(() => setGlobalSuccess({ show: false, message: '' }), 2000);
            setTemplates(defaultTemplates);
          }
        } else {
          console.error('Error fetching tenant config:', error);
          setGlobalSuccess({ show: true, message: 'Failed to load notifications. Using defaults.' });
          setTimeout(() => setGlobalSuccess({ show: false, message: '' }), 2000);
          setTemplates(defaultTemplates);
        }
      }
    };
    fetchOrCreateTemplates();
  }, []);

  /* Update template state after save */
  const updateTemplate = (id, updatedTemplate) => {
    setTemplates((prevTemplates) => {
      const newTemplates = { ...prevTemplates, [id]: updatedTemplate };
      //console.log('Updated templates:', newTemplates);
      return newTemplates;
    });
  };

  /* Trigger success/error messages */
  const triggerGlobalSuccess = (msg) => {
    setGlobalSuccess({ show: true, message: msg });
    setTimeout(() => setGlobalSuccess({ show: false, message: '' }), 2000);
  };

  /* Search filter */
  const filteredTemplates = Object.entries(templates).filter(([key, value]) => {
    if (!searchTerm.trim()) return true;
    const readableKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    return (
      readableKey.includes(searchTerm.toLowerCase()) ||
      value.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <SuccessAlert message={globalSuccess.message} show={globalSuccess.show} />
      <div className="EmailNotifications">
        {/* Top Bar */}
        <div className="Dash-OO-Boas OOOP-LOa">
          <div className="Dash-OO-Boas-Top">
            <div className="Dash-OO-Boas-Top-1">
              <h3>Notification Settings</h3>
            </div>
            <div className="Dash-OO-Boas-Top-2">
              <div className="genn-Drop-Search">
                <span>
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  placeholder="Search for notification(s)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="oujka-Inpuauy"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Templates List */}
        <div className="Dash-OO-Boas Gen-Boxshadow">
          {filteredTemplates.length ? (
            filteredTemplates.map(([key, value]) => (
              <div key={key} className="EmailNotifications-Partss">
                <div className="EmailNotifications-Partss-1">
                  <h4>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</h4>
                </div>
                <div className="EmailNotifications-Partss-2">
                  <EmailTemplateEditor
                    id={key}
                    template={value}
                    triggerGlobalSuccess={triggerGlobalSuccess}
                    updateTemplate={updateTemplate}
                  />
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: '1rem' }}>No notifications match "{searchTerm}".</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;