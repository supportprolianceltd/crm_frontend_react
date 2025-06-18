import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon as MicOutline } from '@heroicons/react/24/outline';
import { MicrophoneIcon as MicSolid } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { createRequisition } from './apiService';

const MAX_HEIGHT = 150;
const MAX_WORDS = 1000;

const CreateRequisition = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const handleSendRequest = async () => {
    if (!title.trim()) {
      setErrorMessage("Job title is required.");
      return;
    }
    if (!qualification.trim()) {
      setErrorMessage("Qualification requirement is required.");
      return;
    }
    if (!experience.trim()) {
      setErrorMessage("Experience requirement is required.");
      return;
    }
    if (!knowledge.trim()) {
      setErrorMessage("Knowledge requirement is required.");
      return;
    }
    if (!text.trim()) {
      setErrorMessage("Please enter something before sending the request.");
      return;
    }

    setErrorMessage('');
    setIsSending(true);

    const requisitionData = {
      title,
      qualification_requirement: qualification,
      experience_requirement: experience,
      knowledge_requirement: knowledge,
      reason: text,
      status: 'pending',
      role: 'staff',
    };

    try {
      await createRequisition(requisitionData);
      setIsSending(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      setIsSending(false);
      setErrorMessage(error);
      console.error('Error creating requisition:', error);
    }
  };

  const handleChange = (e, setter) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    if (words.length > MAX_WORDS) return;
    setter(value);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight >= MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [text]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setErrorMessage('Your browser does not support Speech Recognition');
      return;
    }

    setErrorMessage('');

    if (isRecording) {
      recognitionRef.current?.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (focusedInput === 'title') {
          setTitle((prev) => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            const words = newText.trim().split(/\s+/);
            return words.length <= MAX_WORDS ? newText : prev;
          });
        } else if (focusedInput === 'qualification') {
          setQualification((prev) => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            const words = newText.trim().split(/\s+/);
            return words.length <= MAX_WORDS ? newText : prev;
          });
        } else if (focusedInput === 'experience') {
          setExperience((prev) => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            const words = newText.trim().split(/\s+/);
            return words.length <= MAX_WORDS ? newText : prev;
          });
        } else if (focusedInput === 'knowledge') {
          setKnowledge((prev) => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            const words = newText.trim().split(/\s+/);
            return words.length <= MAX_WORDS ? newText : prev;
          });
        } else {
          setText((prev) => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            const words = newText.trim().split(/\s+/);
            return words.length <= MAX_WORDS ? newText : prev;
          });
        }
      };

      recognition.onerror = (e) => {
        console.error('Recognition error:', e);
        clearInterval(timerRef.current);
        setIsRecording(false);
        setErrorMessage('Speech recognition error occurred.');
      };

      recognition.onend = () => {
        clearInterval(timerRef.current);
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  return (
    <motion.div
      className='CreateRequisition'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className='CreateRequisition-Bodddy' onClick={onClose}></div>

      <motion.div
        className='CreateRequisition-box Gen-Boxshadow'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className='CreateRequisition-box-Top'>
          <h3>Create Job Requisition</h3>
          <button onClick={onClose}><XMarkIcon /></button>
        </div>

        <div className='CreateRequisition-box-SubTop'>
          <p>Use the microphone icon to record your reason. Your voice will be transcribed into text automatically.</p>
        </div>

        <div className='CreateRequisition-box-Mid custom-scroll-bar'>
          <div className='GHuh-Form-Input'>
            <label>Job Title</label>
            <input
              type='text'
              placeholder='Job Title'
              value={title}
              onChange={(e) => handleChange(e, setTitle)}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
              className={errorMessage.includes('title') ? 'input-error' : ''}
            />
          </div>
          <div className='GHuh-Form-Input'>
            <label>Qualification requirement</label>
            <input
              type='text'
              placeholder='Qualification requirement'
              value={qualification}
              onChange={(e) => handleChange(e, setQualification)}
              onFocus={() => setFocusedInput('qualification')}
              onBlur={() => setFocusedInput(null)}
              className={errorMessage.includes('Qualification') ? 'input-error' : ''}
            />
          </div>
          <div className='GHuh-Form-Input'>
            <label>Experience requirement</label>
            <input
              type='text'
              placeholder='Experience requirement'
              value={experience}
              onChange={(e) => handleChange(e, setExperience)}
              onFocus={() => setFocusedInput('experience')}
              onBlur={() => setFocusedInput(null)}
              className={errorMessage.includes('Experience') ? 'input-error' : ''}
            />
          </div>
          <div className='GHuh-Form-Input'>
            <label>Knowledge requirement</label>
            <input
              type='text'
              placeholder='Knowledge requirement'
              value={knowledge}
              onChange={(e) => handleChange(e, setKnowledge)}
              onFocus={() => setFocusedInput('knowledge')}
              onBlur={() => setFocusedInput(null)}
              className={errorMessage.includes('Knowledge') ? 'input-error' : ''}
            />
          </div>
          <div className='GHuh-Form-Input'>
            <label>Reason for request</label>
            <textarea
              ref={textareaRef}
              placeholder='Reason for request'
              value={text}
              onChange={(e) => handleChange(e, setText)}
              onFocus={() => setFocusedInput('text')}
              onBlur={() => setFocusedInput(null)}
              style={{ maxHeight: MAX_HEIGHT, resize: 'none' }}
              className='custom-scroll-bar'
            />
            {errorMessage && (
              <p className='erro-message-Txt'>{errorMessage}</p>
            )}
          </div>
        </div>

        <div className='CreateRequisition-box-Foot'>
          <div className='CreateRequisition-box-Foot-1'>
            <p><InformationCircleIcon /> Not more than 1000 words ({text.trim().split(/\s+/).filter(Boolean).length} used)</p>
          </div>

          <div className='CreateRequisition-box-Foot-2'>
            {isRecording && (
              <span className='rec-Timer'>
                {formatTime(recordingTime)}
              </span>
            )}
            <button
              onClick={toggleRecording}
              className={`mic-button ${isRecording ? 'recording' : ''}`}
              aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <MicSolid className="animate-pulse text-red-600" /> : <MicOutline />}
            </button>

            <button
              onClick={handleSendRequest}
              className='creat-oo-btn btn-primary-bg flex items-center justify-center gap-2'
              disabled={isSending}
              aria-live="polite"
            >
              {isSending ? (
                <div className='rreq-PPja'>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      border: '3px solid #fff',
                      borderTopColor: 'transparent',
                    }}
                  />
                  <p>Sending..</p>
                </div>
              ) : (
                <>
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="success-alert"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed',
                top: 10,
                right: 10,
                backgroundColor: '#38a169',
                color: 'white',
                padding: '10px 20px',
                fontSize: '12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 9999,
              }}
            >
              Request sent successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CreateRequisition;