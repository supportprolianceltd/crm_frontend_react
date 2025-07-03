import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CheckIcon,
  PencilIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import SampleCV from '../../../assets/resume.pdf';

const initialApplicants = [
  { initials: 'JS', name: 'James Smith',  position: 'Software Engineer', appliedDate: '2023‑06‑15', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '5 years', education: 'MSc CS' },
  { initials: 'OJ', name: 'Olivia Johnson',position: 'UX Designer',       appliedDate: '2023‑06‑18', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '4 years', education: 'BFA Design' },
  { initials: 'WB', name: 'William Brown',  position: 'Product Manager',  appliedDate: '2023‑06‑12', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '6 years', education: 'MBA' },
  { initials: 'EJ', name: 'Emma Jones',     position: 'Data Analyst',     appliedDate: '2023‑06‑20', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '3 years', education: 'BSc Statistics' },
  { initials: 'BG', name: 'Benjamin Garcia',position: 'DevOps Engineer',  appliedDate: '2023‑06‑14', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '4 years', education: 'BSc CS' },
  { initials: 'AM', name: 'Ava Miller',     position: 'Frontend Dev',     appliedDate: '2023‑06‑16', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '2 years', education: 'BSc Web Dev' },
  { initials: 'MD', name: 'Michael Davis',  position: 'Backend Engineer', appliedDate: '2023‑06‑11', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '5 years', education: 'MSc SE' },
  { initials: 'SW', name: 'Sophia Wilson',  position: 'QA Engineer',      appliedDate: '2023‑06‑19', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '3 years', education: 'BSc CS' },
  { initials: 'EM', name: 'Elijah Moore',   position: 'Full-stack Dev',   appliedDate: '2023‑06‑13', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '4 years', education: 'BSc IT' },
  { initials: 'IT', name: 'Isabella Taylor',position: 'Project Manager',  appliedDate: '2023‑06‑17', status: 'Pending', decision: 'Pending', note: '', confirmedBy: '', experience: '7 years', education: 'MBA' }
];

const EmploymentDecision = ({ onClose }) => {
  const [searchValue,  setSearchValue]  = useState('');
  const [selectedInitials, setSelected] = useState('JS');
  const [applicants,    setApplicants]  = useState(initialApplicants);
  const [notification, setNotification] = useState(null);

  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [modalMode,   setModalMode]       = useState('add');     // 'add' | 'edit'
  const [modalInit,   setModalInit]       = useState(null);      // applicant.initials
  const [noteDraft,   setNoteDraft]       = useState('');
  const [confirmerName, setConfirmerName] = useState('');        // new input for confirmer's name

  useEffect(() => {
    if (isModalOpen) {
      const currentApplicant = applicants.find(a => a.initials === modalInit);
      setNoteDraft(currentApplicant?.note || '');
      setConfirmerName(currentApplicant?.confirmedBy || '');
    }
  }, [isModalOpen, modalInit, applicants]);

  const filteredApplicants = useMemo(() => {
    if (!searchValue.trim()) return applicants;
    const q = searchValue.toLowerCase();
    return applicants.filter(
      ({ name, initials }) => name.toLowerCase().includes(q) || initials.toLowerCase().includes(q)
    );
  }, [searchValue, applicants]);

  const selectedApplicant = useMemo(
    () => applicants.find(app => app.initials === selectedInitials),
    [applicants, selectedInitials]
  );

  const changeDecision = (init, decision) => {
    setApplicants(prev =>
      prev.map(app => (app.initials === init ? { ...app, decision } : app))
    );
  };

  const openAddNoteModal = () => {
    if (!selectedApplicant || selectedApplicant.decision === 'Pending') return;
    setModalMode('add');
    setModalInit(selectedApplicant.initials);
    setIsModalOpen(true);
  };

  const openEditNoteModal = () => {
    if (!selectedApplicant) return;
    setModalMode('edit');
    setModalInit(selectedApplicant.initials);
    setIsModalOpen(true);
  };

  const saveNote = () => {
    if (!confirmerName.trim()) {
      alert('Please enter the name of the person confirming the decision.');
      return;
    }

    setApplicants(prev =>
      prev.map(app => {
        if (app.initials !== modalInit) return app;
        if (modalMode === 'add') {
          return { ...app, status: app.decision, note: noteDraft.trim(), confirmedBy: confirmerName.trim() };
        }
        return { ...app, note: noteDraft.trim(), confirmedBy: confirmerName.trim() };
      })
    );

    setIsModalOpen(false);
    const appName = applicants.find(a => a.initials === modalInit)?.name || '';
    setNotification({
      type: 'success',
      message: `Note ${modalMode === 'add' ? 'saved' : 'updated'} for ${appName}`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="EmploymentDecision">
      <button className="EmploymentDecision-btn" onClick={onClose}>
        <XMarkIcon className="h-6 w-6" />
      </button>

      <div className="EmploymentDecision-Body" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }} className="EmploymentDecision-Main"
      >
        <div className="DocComplianceCheck-Part">
          <div className="DocComplianceCheck-Part-Top">
            <h3 className="ool-HHUha">Applicants <span>Total: {filteredApplicants.length}</span></h3>
          </div>

          <div className="paoli-UJao">
            <div className="paoli-UJao-TOp">
              <div className="genn-Drop-Search">
                <span><MagnifyingGlassIcon className="h-5 w-5 text-gray-500" /></span>
                <input value={searchValue} placeholder="Search for applicant"
                       onChange={e => setSearchValue(e.target.value)} />
              </div>
            </div>

            <ul className="custom-scroll-bar">
              {filteredApplicants.map(({ initials, name }) => (
                <li key={initials}
                    className={selectedInitials === initials ? 'active-LLOK' : undefined}
                    onClick={() => setSelected(initials)}>
                  <span>{initials}</span><p>{name}</p>
                </li>
              ))}
              {filteredApplicants.length === 0 && (
                <div className="empty-state-li">
                  <motion.div initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    <ExclamationTriangleIcon />
                  </motion.div>
                  <span>No applicant matches &ldquo;{searchValue}&rdquo;</span>
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="DocComplianceCheck-Part">
          <div className="DocComplianceCheck-Part-Top"><h3>Employment Decision</h3></div>

          <div className="ssen-regs">
            <div className="ssen-regs-1"><span>{selectedApplicant?.initials}</span></div>
            <div className="ssen-regs-2">
              <div>
                <h4>{selectedApplicant?.name}</h4>
                <p className="olik-PPO">
                  Status:{' '}
                  <span className={`All-status-badge ${selectedApplicant?.status.toLowerCase()}`}>
                    {selectedApplicant?.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="Dash-OO-Boas dOikpO-PPol oluja-PPPl olika-ola">
            <div className="table-container">
              <table className="Gen-Sys-table">
                <thead>
                  <tr>
                    <th>Position</th><th>Application</th><th>Interview</th>
                    <th>Compliance</th><th>Status</th><th>Decision</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedApplicant && (
                    <tr key={selectedApplicant.initials}>
                      <td>{selectedApplicant.position}</td>
                      <td><div className="HHH-DDGha checkedd-ppo">Checked <CheckIcon /></div></td>
                      <td><div className="HHH-DDGha olik-TTTDRF">Completed <span>100%</span></div></td>
                      <td>
                        <div className="gen-td-btns">
                          <a href={SampleCV} target="_blank" rel="noopener noreferrer"
                             className="view-btn">
                            <DocumentTextIcon className="h-5 w-5 mr-1" />View Report
                          </a>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${selectedApplicant.status.toLowerCase()}`}>
                          {selectedApplicant.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={selectedApplicant.decision}
                          onChange={e => changeDecision(selectedApplicant.initials, e.target.value)}
                          className="decision-select"
                        >
                          <option value="Pending" disabled>Select</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button className="confirm-btn"
                                disabled={selectedApplicant.decision === 'Pending'}
                                onClick={openAddNoteModal}>
                          <CheckBadgeIcon className="h-5 w-5" />Confirm 
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Show note and edit button only for selected applicant */}
            {selectedApplicant?.note && (
              <div className="applicant-note">
                <div className="applicant-note-Box">
                  <h4>
                    Decision Note
                    <button
                      onClick={openEditNoteModal}
                    >
                      <PencilIcon className="inline-block h-5 w-5" />
                      Edit Note
                    </button>
                  </h4>
                  <p>{selectedApplicant.note}</p>
                  {selectedApplicant.confirmedBy && (
                    <p className='coool-Pla'>
                      Confirmed by: <span>{selectedApplicant.confirmedBy}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className='performance-Grapph'></div>

            {notification && (
              <motion.div initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`notification ${notification.type}`}>
                {notification.message}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="noteModal"
            className="modal-overlay"
             initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target.classList.contains('modal-overlay')) {
                setIsModalOpen(false);
              }
            }}
             style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000,
        }}
          >
            <motion.div
               className="modal-content custom-scroll-bar okauj-MOadad"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                padding: '1.5rem',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <h3 className='oll-paolsl' style={{ marginBottom: '1rem' }}>
                {modalMode === 'add' ? 'Add' : 'Edit'} Decision Note for <span className='oouk-SPOPol'>{selectedApplicant?.name}</span>
              </h3>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Name of person confirming the decision
              </label>
              <input
                type="text"
                value={confirmerName}
                onChange={e => setConfirmerName(e.target.value)}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', boxSizing: 'border-box' }}
              />

              <div className="GGtg-DDDVa">
                <textarea
                  rows={5}
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  placeholder="Add your note here..."
                  className="oujka-Inpuauy OIUja-Tettxa"
                  style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                />
              </div>

              <div className="oioak-POldj-BTn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="CLCLCjm-BNtn"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className="btn-primary-bg"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmploymentDecision;
