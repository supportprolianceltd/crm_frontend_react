import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { motion, useInView } from 'framer-motion';
import DefaulUser from '../../../assets/Img/memberIcon.png';
import pdfIcon from '../../../assets/icons/pdf.png';
import { fetchModules, fetchTenant, createUser } from './HomeService';
import AccountSelctClient from '../../../assets/img/account-selct-client.svg';
import AccountSelctStaff from '../../../assets/img/account-selct-staff.svg';

const steps = [
  { key: 'Account Selection', title: 'Account Selection' },
  { key: 'Details', title: 'Details' },
  { key: 'Permissions', title: 'Permissions' },
  { key: 'Set Login Credentials', title: 'Set Login Credentials' },
];

// Framer Motion animation variants for list items
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0.3, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Error and success alert variants
const alertVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Slide-in variants for sections
const sectionVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const SectionList = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px -100px 0px' });

  return (
    <motion.ul
      ref={ref}
      variants={listVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { variants: itemVariants }) : null
      )}
    </motion.ul>
  );
};

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(2)} ${sizes[i]}`;
}

const AddUser = () => {
  const [activeKey, setActiveKey] = useState('Account Selection');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [permissions, setPermissions] = useState({
    'Access Recruitment': false,
    'Access Compliance': false,
    'Access Training': false,
    'Access Assets Management': false,
    'Access Rostering': false,
    'Access HR': false,
    'Access Payroll': false,
  });
  const [formData, setFormData] = useState({
    accountType: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    username: '',
    password: '',
    status: '',
    twoFactor: '',
    dashboard: '',
    rightToWorkUK: '',
    proofRightToWork: null,
    photoID: null,
    jobRole: '',
    employmentType: '',
    startDate: '',
    cv: null,
    dbsCertificate: null,
    dbsUpdateService: '',
    daysAvailable: [],
    shiftTimes: '',
    shiftFlexibility: '',
    hoursPerWeek: '',
    careCertificate: '',
    careCertificateFile: null,
    trainingCertificates: null,
    professionalRegistration: '',
    proofRegistration: null,
    bankName: '',
    accountHolder: '',
    sortCode: '',
    accountNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const titleInputRefs = useRef({});
  const fileInputRefs = useRef({});
  const sectionRefs = {
    'Account Selection': useRef(null),
    Details: useRef(null),
    Permissions: useRef(null),
    'Set Login Credentials': useRef(null),
  };
  const mainContentRef = useRef(null);
  const containerRef = useRef(null);

  const [uploadCards, setUploadCards] = useState([
    {
      id: Date.now(),
      selectedFile: null,
      previewUrl: null,
      fileSize: '0 B',
      fileName: '',
    },
  ]);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  // Fetch modules and tenant data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch modules
        const moduleData = await fetchModules();
        setModules(moduleData);

        // Fetch tenant data
        const tenantData = await fetchTenant();
        const tenant = tenantData.find((t) => t.schema_name === 'proliance');
        if (tenant) {
          const primaryDomain = tenant.domains.find((d) => d.is_primary)?.domain || '';
          setTenantDomain(primaryDomain);
        } else {
          throw new Error('Proliance tenant not found');
        }
      } catch (error) {
        setErrorMessage(error.message);
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.pageY - mainContentRef.current.offsetTop;
    scrollTop.current = mainContentRef.current.scrollTop;
    mainContentRef.current.style.cursor = 'grabbing';
    mainContentRef.current.style.userSelect = 'none';
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (mainContentRef.current) {
      mainContentRef.current.style.cursor = 'grab';
      mainContentRef.current.style.userSelect = 'auto';
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (mainContentRef.current) {
      mainContentRef.current.style.cursor = 'grab';
      mainContentRef.current.style.userSelect = 'auto';
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const y = e.pageY - mainContentRef.current.offsetTop;
    const walk = startY.current - y;
    mainContentRef.current.scrollTop = scrollTop.current + walk;
  };

  const handleStepClick = (key) => {
    const currentIndex = steps.findIndex((step) => step.key === activeKey);
    const targetIndex = steps.findIndex((step) => step.key === key);
    if (targetIndex > currentIndex) {
      let isValid = false;
      switch (activeKey) {
        case 'Account Selection':
          isValid = validateAccountSelectionStep();
          break;
        case 'Details':
          isValid = validateDetailsStep();
          break;
        case 'Set Login Credentials':
          isValid = validateLoginCredentialsStep();
          break;
        default:
          isValid = true;
      }
      if (!isValid) return;
    }

    setActiveKey(key);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setTimeout(() => {
      const el = sectionRefs[key]?.current;
      if (el && mainContentRef.current) {
        mainContentRef.current.scrollTo({
          top: el.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 300);
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file && (file.type.includes('pdf') || file.type.includes('image'))) {
      setUploadCards((prev) =>
        prev.map((card) =>
          card.id === id
            ? {
                ...card,
                selectedFile: file,
                fileSize: formatFileSize(file.size),
                fileName: file.name,
                previewUrl: file.type.includes('image') ? URL.createObjectURL(file) : null,
              }
            : card
        )
      );
      setTimeout(() => {
        titleInputRefs.current[id]?.focus();
      }, 100);
      setErrorMessage(null);
    } else {
      setErrorMessage('Please select a valid PDF or image file');
      setUploadCards((prev) =>
        prev.map((card) =>
          card.id === id
            ? {
                ...card,
                selectedFile: null,
                fileSize: '0 B',
                fileName: '',
                previewUrl: null,
              }
            : card
        )
      );
    }
  };

  const handleFormFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file && (file.type.includes('pdf') || file.type.includes('image'))) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setErrorMessage(null);
    } else {
      setErrorMessage('Please select a valid PDF or image file');
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handlePreviewClick = (card) => {
    if (card.selectedFile) {
      if (card.selectedFile.type.includes('pdf')) {
        const url = URL.createObjectURL(card.selectedFile);
        window.open(url, '_blank');
      } else if (card.previewUrl) {
        window.open(card.previewUrl, '_blank');
      }
    }
  };

  const handleClearFile = (id) => {
    setUploadCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              selectedFile: null,
              fileSize: '0 B',
              fileName: '',
              previewUrl: null,
            }
          : card
      )
    );
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].value = '';
    }
  };

  const handleAddCard = () => {
    const newId = Date.now();
    setUploadCards((prev) => [
      ...prev,
      { id: newId, selectedFile: null, previewUrl: null, fileSize: '0 B', fileName: '' },
    ]);
  };

  const handleRemoveCard = (id) => {
    if (uploadCards.length <= 1) return;
    setUploadCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleFileNameChange = (id, value) => {
    setUploadCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, fileName: value } : card))
    );
  };

  const handlePermissionToggle = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (value) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const days = prev.daysAvailable.includes(day)
        ? prev.daysAvailable.filter((d) => d !== day)
        : [...prev.daysAvailable, day];
      return { ...prev, daysAvailable: days };
    });
  };

  const handleAccountTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      accountType: type,
    }));
    setFieldErrors({});
    setErrorMessage(null);
    const currentIndex = steps.findIndex((step) => step.key === activeKey);
    if (currentIndex < steps.length - 1) {
      const nextKey = steps[currentIndex + 1].key;
      setActiveKey(nextKey);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      setTimeout(() => {
        const el = sectionRefs[nextKey]?.current;
        if (el && mainContentRef.current) {
          mainContentRef.current.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const resetForm = () => {
    setFormData({
      accountType: '',
      firstName: '',
      lastName: '',
      dashboard: '',
      username: '',
      password: '',
      status: '',
      twoFactor: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      rightToWorkUK: '',
      proofRightToWork: null,
      photoID: null,
      jobRole: '',
      employmentType: '',
      startDate: '',
      cv: null,
      dbsCertificate: null,
      dbsUpdateService: '',
      daysAvailable: [],
      shiftTimes: '',
      shiftFlexibility: '',
      hoursPerWeek: '',
      careCertificate: '',
      careCertificateFile: null,
      trainingCertificates: null,
      professionalRegistration: '',
      proofRegistration: null,
      bankName: '',
      accountHolder: '',
      sortCode: '',
      accountNumber: '',
    });
    setUploadCards([
      {
        id: Date.now(),
        selectedFile: null,
        previewUrl: null,
        fileSize: '0 B',
        fileName: '',
      },
    ]);
    setPermissions({
      'Access Recruitment': false,
      'Access Compliance': false,
      'Access Training': false,
      'Access Assets Management': false,
      'Access Rostering': false,
      'Access HR': false,
      'Access Payroll': false,
    });
    setShowPassword(false);
    setFieldErrors({});
    setFieldErrors({});
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = '';
    });
  };

  const validateAccountSelectionStep = () => {
    if (!formData.accountType) {
      setFieldErrors({ accountType: 'Account type selection is required' });
      setErrorMessage('Please select an account type.');
      return false;
    }
    return true;
  };

  const validateDetailsStep = () => {
    const requiredFields = {
      emailUsername: 'Email username is required',
      firstName: 'First Name is required',
      lastName: 'Last Name is required',
      phone: 'Phone is required',
      gender: 'Gender is required',
      dob: 'Date of Birth is required',
      street: 'Street is required',
      city: 'City is required',
      state: 'State is required',
      zip: 'Zip Code is required',
    };
    const staffRequiredFields = {
      rightToWorkUK: 'Right to work in the UK is required',
      proofRightToWork: 'Proof of right to work is required',
      photoID: 'Valid photo ID is required',
      jobRole: 'Job role/position is required',
      employmentType: 'Employment type is required',
      startDate: 'Start date availability is required',
      cv: 'CV is required',
      dbsCertificate: 'DBS certificate is required',
      dbsUpdateService: 'DBS update service status is required',
      daysAvailable: 'At least one day must be selected',
      shiftTimes: 'Preferred shift times are required',
      shiftFlexibility: 'Shift flexibility is required',
      hoursPerWeek: 'Hours per week are required',
      careCertificate: 'Care certificate status is required',
      professionalRegistration: 'Professional registration status is required',
    };
    const errors = {};
    let isValid = true;

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field]) {
        errors[field] = requiredFields[field];
        isValid = false;
      }
    });

    if (formData.accountType === 'Staff') {
      Object.keys(staffRequiredFields).forEach((field) => {
        if (field === 'daysAvailable') {
          if (!formData[field].length) {
            errors[field] = staffRequiredFields[field];
            isValid = false;
          }
        } else if (!formData[field]) {
          errors[field] = staffRequiredFields[field];
          isValid = false;
        }
      });
    }

    setFieldErrors(errors);
    if (!isValid) {
      setErrorMessage('Please fill in all required fields.');
    }
    return isValid;
  };

  const validateLoginCredentialsStep = () => {
    const requiredFields = {
      dashboard: 'Dashboard selection is required',
      username: 'Username is required',
      password: 'Password is required',
      status: 'Status is required',
      twoFactor: 'Two-Factor Auth selection is required',
    };
    const errors = {};
    let isValid = true;

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field]) {
        errors[field] = requiredFields[field];
        isValid = false;
      }
    });

    // Additional password validation
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setErrorMessage('Please fill in all required fields.');
    }
    return isValid;
  };

  const handleContinue = async () => {
    const currentIndex = steps.findIndex((step) => step.key === activeKey);
    let isValid = false;
    switch (activeKey) {
      case 'Account Selection':
        isValid = validateAccountSelectionStep();
        break;
      case 'Details':
        isValid = validateDetailsStep();
        break;
      case 'Set Login Credentials':
        isValid = validateLoginCredentialsStep();
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      return;
    }

    setErrorMessage(null);
    setFieldErrors({});

    if (currentIndex < steps.length - 1) {
      const nextKey = steps[currentIndex + 1].key;
      handleStepClick(nextKey);
    } else if (currentIndex === steps.length - 1) {
      setIsLoading(true);
      try {
        // Map permissions to module IDs
        const permissionToModule = {
          'Access Recruitment': 'Talent Engine',
          'Access Compliance': 'Compliance',
          'Access Training': 'Training',
          'Access Assets Management': 'Assets Management',
          'Access Rostering': 'Workforce',
          'Access HR': 'Workforce',
          'Access Payroll': 'Payroll',
        };

        const selectedModules = Object.keys(permissions)
          .filter((key) => permissions[key])
          .map((key) => {
            const moduleName = permissionToModule[key];
            const module = modules.find((m) => m.name === moduleName);
            return module ? module.id : null;
          })
          .filter(Boolean);

        // Prepare FormData for API request
        const formDataToSend = new FormData();
        // Combine emailUsername and tenantDomain for the email field
        const fullEmail = formData.emailUsername && tenantDomain ? `${formData.emailUsername}@${tenantDomain}` : '';
        formDataToSend.append('email', fullEmail);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('first_name', formData.firstName);
        formDataToSend.append('last_name', formData.lastName);
        formDataToSend.append('role', formData.role.toLowerCase());
        formDataToSend.append('job_role', formData.department); // Map department to job_role
        formDataToSend.append('dashboard', formData.dashboard.toLowerCase());
        formDataToSend.append('access_level', formData.accessLevel.toLowerCase().replace(' ', '_'));
        formDataToSend.append('status', formData.status.toLowerCase());
        formDataToSend.append('two_factor', formData.twoFactor.toLowerCase());

        // Send profile fields individually
        const profile = {
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip,
          department: formData.department,
        };
        Object.keys(profile).forEach((key) => {
          if (profile[key]) {
            formDataToSend.append(`profile[${key}]`, profile[key]);
          }
        });

        // Send modules as individual fields
        selectedModules.forEach((moduleId, index) => {
          formDataToSend.append(`modules[${index}]`, moduleId);
        });

        // Append documents
        uploadCards.forEach((card, index) => {
          if (card.selectedFile && card.fileName) {
            formDataToSend.append(`documents[${index}][title]`, card.fileName);
            formDataToSend.append(`documents[${index}][file]`, card.selectedFile);
          }
        });

        // Log the FormData for debugging
        const formDataEntries = {};
        for (let [key, value] of formDataToSend.entries()) {
          formDataEntries[key] = value instanceof File ? `${value.name} (${value.size} bytes)` : value;
        }
        console.log('FormData being sent:', formDataEntries);

        const response = await createUser(formDataToSend);
        setSuccessMessage(response.message || `User ${fullEmail} created successfully.`);
        resetForm();
        handleStepClick(steps[0].key);
      } catch (error) {
        console.error('handleContinue error:', {
          message: error.message,
          stack: error.stack,
        });
        setErrorMessage(error.message);
        // Map backend validation errors to form fields
        if (error.message.includes('email:')) {
          const emailError = error.message.match(/email: ([^;]+)/)?.[1] || 'Invalid email';
          setFieldErrors((prev) => ({ ...prev, emailUsername: emailError }));
        }
        if (error.message.includes('username:')) {
          const usernameError = error.message.match(/username: ([^;]+)/)?.[1] || 'Invalid username';
          setFieldErrors((prev) => ({ ...prev, username: usernameError }));
        }
        if (error.message.includes('profile:')) {
          const profileError = error.message.match(/profile: ([^;]+)/)?.[1] || 'Invalid profile data';
          setFieldErrors((prev) => ({ ...prev, profile: profileError }));
        }
        if (error.message.includes('modules:')) {
          const modulesError = error.message.match(/modules: ([^;]+)/)?.[1] || 'Invalid modules data';
          setFieldErrors((prev) => ({ ...prev, modules: modulesError }));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    const currentIndex = steps.findIndex((step) => step.key === activeKey);
    if (currentIndex > 0) {
      const prevKey = steps[currentIndex - 1].key;
      handleStepClick(prevKey);
      setFieldErrors({});
      setFieldErrors({});
    }
  };

  const renderUploadCards = () =>
    uploadCards.map((card, index) => (
      <div key={card.id} className="Uppol-CCard-Card">
        <div
          className="Uppol-CCard-Card-Uploads"
          onClick={() => fileInputRefs.current[card.id]?.click()}
          style={{ cursor: 'pointer' }}
        >
          {card.selectedFile && <p>{card.fileSize}</p>}
          <span>
            {card.selectedFile ? (
              card.selectedFile.type.includes('pdf') ? (
                <img src={pdfIcon} alt="PDF Icon" />
              ) : null
            ) : (
              <b>
                <PlusIcon className="w-6 h-6" />
              </b>
            )}
          </span>
          {card.selectedFile && (
            <input
              type="text"
              placeholder="Document Title"
              value={card.fileName}
              onChange={(e) => handleFileNameChange(card.id, e.target.value)}
              title="Edit File Title"
              style={{ cursor: 'text' }}
              onClick={(e) => e.stopPropagation()}
              ref={(el) => (titleInputRefs.current[card.id] = el)}
            />
          )}
          <input
            type="file"
            ref={(el) => (fileInputRefs.current[card.id] = el)}
            style={{ display: 'none' }}
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e, card.id)}
          />
          {card.previewUrl && (
            <div className="Uppol-CCard-Preview">
              <img src={card.previewUrl} alt="File Preview" />
            </div>
          )}
        </div>
        <div className="Uppol-CCard-Card-BBtna">
          {card.selectedFile && (
            <span onClick={() => handlePreviewClick(card)} style={{ cursor: 'pointer' }}>
              <EyeIcon /> View
            </span>
          )}
          <span
            onClick={() => fileInputRefs.current[card.id]?.click()}
            style={{ cursor: 'pointer' }}
          >
            {card.selectedFile ? (
              <>
                <ArrowPathIcon />
                Reupload
              </>
            ) : (
              <>
                <CloudArrowUpIcon />
                Upload
              </>
            )}
          </span>
          {card.selectedFile && (
            <span onClick={() => handleClearFile(card.id)} style={{ cursor: 'pointer' }}>
              <ArrowUturnLeftIcon />
              Clear
            </span>
          )}
          {index !== 0 && (
            <span
              onClick={() => handleRemoveCard(card.id)}
              style={{ cursor: card.selectedFile ? 'pointer' : 'not-allowed' }}
            >
              <XMarkIcon /> Remove
            </span>
          )}
        </div>
      </div>
    ));

  const renderStepContent = (key) => {
    const children = [];

    switch (key) {
      case 'Account Selection':
        if (formData.accountType) {
          children.push(
            <motion.li key="accountType" variants={itemVariants}>
              <span>Account Type</span>
              <p>{formData.accountType}</p>
            </motion.li>
          );
        }
        return <SectionList>{children}</SectionList>;
      case 'Details':
        if (formData.firstName) {
          children.push(
            <motion.li key="firstName" variants={itemVariants}>
              <span>First Name</span>
              <p>{formData.firstName}</p>
            </motion.li>
          );
        }
        if (formData.lastName) {
          children.push(
            <motion.li key="lastName" variants={itemVariants}>
              <span>Last Name</span>
              <p>{formData.lastName}</p>
            </motion.li>
          );
        }
        if (formData.emailUsername && tenantDomain) {
          children.push(
            <motion.li key="email" variants={itemVariants}>
              <span>Email</span>
              <p>{`${formData.emailUsername}@${tenantDomain}`}</p>
            </motion.li>
          );
        }
        if (formData.phone) {
          children.push(
            <motion.li key="phone" variants={itemVariants}>
              <span>Phone</span>
              <p>{formData.phone}</p>
            </motion.li>
          );
        }
        if (formData.gender) {
          children.push(
            <motion.li key="gender" variants={itemVariants}>
              <span>Gender</span>
              <p>{formData.gender}</p>
            </motion.li>
          );
        }
        if (formData.dob) {
          children.push(
            <motion.li key="dob" variants={itemVariants}>
              <span>Date of Birth</span>
              <p>{formData.dob}</p>
            </motion.li>
          );
        }
        if (formData.street) {
          children.push(
            <motion.li key="street" variants={itemVariants}>
              <span>Street</span>
              <p>{formData.street}</p>
            </motion.li>
          );
        }
        if (formData.city) {
          children.push(
            <motion.li key="city" variants={itemVariants}>
              <span>City</span>
              <p>{formData.city}</p>
            </motion.li>
          );
        }
        if (formData.state) {
          children.push(
            <motion.li key="state" variants={itemVariants}>
              <span>State</span>
              <p>{formData.state}</p>
            </motion.li>
          );
        }
        if (formData.zip) {
          children.push(
            <motion.li key="zip" variants={itemVariants}>
              <span>Zip Code</span>
              <p>{formData.zip}</p>
            </motion.li>
          );
        }
        if (formData.accountType === 'Staff') {
          if (formData.rightToWorkUK) {
            children.push(
              <motion.li key="rightToWorkUK" variants={itemVariants}>
                <span>Right to Work in the UK</span>
                <p>{formData.rightToWorkUK}</p>
              </motion.li>
            );
          }
          if (formData.proofRightToWork) {
            children.push(
              <motion.li key="proofRightToWork" variants={itemVariants}>
                <span>Proof of Right to Work</span>
                <p>{formData.proofRightToWork.name}</p>
              </motion.li>
            );
          }
          if (formData.photoID) {
            children.push(
              <motion.li key="photoID" variants={itemVariants}>
                <span>Photo ID</span>
                <p>{formData.photoID.name}</p>
              </motion.li>
            );
          }
          if (formData.jobRole) {
            children.push(
              <motion.li key="jobRole" variants={itemVariants}>
                <span>Job Role/Position</span>
                <p>{formData.jobRole}</p>
              </motion.li>
            );
          }
          if (formData.employmentType) {
            children.push(
              <motion.li key="employmentType" variants={itemVariants}>
                <span>Employment Type</span>
                <p>{formData.employmentType}</p>
              </motion.li>
            );
          }
          if (formData.startDate) {
            children.push(
              <motion.li key="startDate" variants={itemVariants}>
                <span>Start Date Availability</span>
                <p>{formData.startDate}</p>
              </motion.li>
            );
          }
          if (formData.cv) {
            children.push(
              <motion.li key="cv" variants={itemVariants}>
                <span>CV</span>
                <p>{formData.cv.name}</p>
              </motion.li>
            );
          }
          if (formData.dbsCertificate) {
            children.push(
              <motion.li key="dbsCertificate" variants={itemVariants}>
                <span>DBS Certificate</span>
                <p>{formData.dbsCertificate.name}</p>
              </motion.li>
            );
          }
          if (formData.dbsUpdateService) {
            children.push(
              <motion.li key="dbsUpdateService" variants={itemVariants}>
                <span>DBS Update Service</span>
                <p>{formData.dbsUpdateService}</p>
              </motion.li>
            );
          }
          if (formData.daysAvailable.length) {
            children.push(
              <motion.li key="daysAvailable" variants={itemVariants}>
                <span>Days Available</span>
                <p>{formData.daysAvailable.join(', ')}</p>
              </motion.li>
            );
          }
          if (formData.shiftTimes) {
            children.push(
              <motion.li key="shiftTimes" variants={itemVariants}>
                <span>Preferred Shift Times</span>
                <p>{formData.shiftTimes}</p>
              </motion.li>
            );
          }
          if (formData.shiftFlexibility) {
            children.push(
              <motion.li key="shiftFlexibility" variants={itemVariants}>
                <span>Shift Flexibility</span>
                <p>{formData.shiftFlexibility}</p>
              </motion.li>
            );
          }
          if (formData.hoursPerWeek) {
            children.push(
              <motion.li key="hoursPerWeek" variants={itemVariants}>
                <span>Hours Per Week</span>
                <p>{formData.hoursPerWeek}</p>
              </motion.li>
            );
          }
          if (formData.careCertificate) {
            children.push(
              <motion.li key="careCertificate" variants={itemVariants}>
                <span>Care Certificate or NVQ</span>
                <p>{formData.careCertificate}</p>
              </motion.li>
            );
          }
          if (formData.careCertificateFile) {
            children.push(
              <motion.li key="careCertificateFile" variants={itemVariants}>
                <span>Care Certificate File</span>
                <p>{formData.careCertificateFile.name}</p>
              </motion.li>
            );
          }
          if (formData.trainingCertificates) {
            children.push(
              <motion.li key="trainingCertificates" variants={itemVariants}>
                <span>Training Certificates</span>
                <p>{formData.trainingCertificates.name}</p>
              </motion.li>
            );
          }
          if (formData.professionalRegistration) {
            children.push(
              <motion.li key="professionalRegistration" variants={itemVariants}>
                <span>Professional Registration</span>
                <p>{formData.professionalRegistration}</p>
              </motion.li>
            );
          }
          if (formData.proofRegistration) {
            children.push(
              <motion.li key="proofRegistration" variants={itemVariants}>
                <span>Proof of Registration</span>
                <p>{formData.proofRegistration.name}</p>
              </motion.li>
            );
          }
          if (formData.bankName) {
            children.push(
              <motion.li key="bankName" variants={itemVariants}>
                <span>Bank Name</span>
                <p>{formData.bankName}</p>
              </motion.li>
            );
          }
          if (formData.accountHolder) {
            children.push(
              <motion.li key="accountHolder" variants={itemVariants}>
                <span>Account Holder Name</span>
                <p>{formData.accountHolder}</p>
              </motion.li>
            );
          }
          if (formData.sortCode) {
            children.push(
              <motion.li key="sortCode" variants={itemVariants}>
                <span>Sort Code</span>
                <p>{formData.sortCode}</p>
              </motion.li>
            );
          }
          if (formData.accountNumber) {
            children.push(
              <motion.li key="accountNumber" variants={itemVariants}>
                <span>Account Number</span>
                <p>{formData.accountNumber}</p>
              </motion.li>
            );
          }
        }
        return <SectionList>{children}</SectionList>;

      case 'Permissions':
        Object.keys(permissions).forEach((permission) => {
          children.push(
            <motion.li key={permission} variants={itemVariants}>
              <span>{permission.replace('Access ', '')}</span>
              <p>{permissions[permission] ? 'Yes' : 'No'}</p>
            </motion.li>
          );
        });
        if (fieldErrors.modules) {
          children.push(
            <motion.li key="modulesError" className="error">
              <span>Modules</span>
              <p style={{ color: '#e53e3e' }}>{fieldErrors.modules}</p>
            </motion.li>
          );
        }
        return <SectionList>{children}</SectionList>;

      case 'Set Login Credentials':
        if (formData.username) {
          children.push(
            <motion.li key="username" variants={itemVariants}>
              <span>Username</span>
              <p>{formData.username}</p>
            </motion.li>
          );
        }
        if (formData.password) {
          children.push(
            <motion.li key="password" variants={itemVariants}>
              <span>Password</span>
              <p>••••••••</p>
            </motion.li>
          );
        }
      
        if (formData.twoFactor) {
          children.push(
            <motion.li key="twoFactor" variants={itemVariants}>
              <span>Two-Factor Auth</span>
              <p>{formData.twoFactor}</p>
            </motion.li>
          );
        }
        if (formData.dashboard) {
          children.push(
            <motion.li key="dashboard" variants={itemVariants}>
              <span>Dashboard</span>
              <p>{formData.dashboard}</p>
            </motion.li>
          );
        }
          if (formData.status) {
          children.push(
            <motion.li key="status" variants={itemVariants}>
              <span>Status</span>
              <p>{formData.status}</p>
            </motion.li>
          );
        }
        return <SectionList>{children}</SectionList>;

      default:
        return null;
    }
  };

  const isLastStep = activeKey === steps[steps.length - 1].key;

  return (
    <div className="Gllols-AddUser">
      {errorMessage && (
        <motion.div
          className="error-alert"
          style={{
            position: 'fixed',
            top: 10,
            backgroundColor: 'rgba(229, 62, 62, 0.9)',
            color: '#fff',
            padding: '10px 20px',
            fontSize: 11,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {errorMessage}
        </motion.div>
      )}
      {successMessage && (
        <motion.div
          className="success-alert ool-ayhs-Succees"
          style={{
            position: 'fixed',
            top: 10,
            backgroundColor: '#38a169',
            color: '#fff',
            padding: '10px 20px',
            fontSize: 11,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="Top-Gllols-AddUser Simp-Boxshadow">
        <h3>Add a User</h3>
        <ul>
          {steps.map((step) => (
            <li
              key={step.key}
              className={activeKey === step.key ? 'Active-CChgba' : ''}
              onClick={() => handleStepClick(step.key)}
              style={{ cursor: 'pointer' }}
            >
              {step.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="Gllols-AddUser-MMMmains Simp-Boxshadow" ref={containerRef}>
        <div className="Gllols-AddUser-MMMmainsTop">
          <h4>{activeKey}</h4>
          <ul>
            <li
              style={{ display: activeKey === steps[0].key ? 'none' : 'flex', cursor: 'pointer' }}
              onClick={handleGoBack}
            >
              <ArrowLeftIcon /> Go Back
            </li>
            <li
              className={`continue-BTn ${isLastStep ? 'btn-primary-bg' : ''}`}
              onClick={handleContinue}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      border: '3px solid #fff',
                      borderTopColor: 'transparent',
                      display: 'inline-block',
                    }}
                  />
                  Creating User...
                </>
              ) : isLastStep ? (
                'Create User'
              ) : (
                'Continue'
              )}
            </li>
          </ul>
        </div>

        <div className="oikujuj-stha">
          <div className="oikujuj-stha-1">
            <div className="oikujuj-stha-1-Top">
              <div className="oikujuj-stha-1-Top-1">
                <div className="ool-Prols">
                  <img src={DefaulUser} alt="Default User" />
                </div>
              </div>
              <div className="oikujuj-stha-1-Top-2">
                <h5>
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : 'null'}
                </h5>
                <p>Account Type: {formData.accountType || 'null'}</p>
              </div>
            </div>

            <div
              className="oikujuj-stha-1-Main"
              ref={mainContentRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {steps.map((step) => (
                <div
                  key={step.key}
                  ref={sectionRefs[step.key]}
                  className={`Rogg-Parts ${activeKey === step.key ? 'Active-Rogg' : ''}`}
                >
                  <h5>{step.title}</h5>
                  {renderStepContent(step.key)}
                </div>
              ))}
            </div>
          </div>

          <div className="oikujuj-stha-2">
            <motion.div
              className={`UKiakks-Part custom-scroll-bar ${
                activeKey === 'Account Selection' ? 'Active-CChgba' : ''
              }`}
              style={{ display: activeKey === 'Account Selection' ? 'block' : 'none' }}
              variants={sectionVariants}
              initial="hidden"
              animate={activeKey === 'Account Selection' ? 'visible' : 'hidden'}
              exit="exit"
            >
              <div className="UKiakks-Part-Box">
                <div className="UKiakks-Part-Header">
                  <h3>Select the type of user account you want to create.</h3>
                </div>
                <div className="UKiakks-Part-Main">
                  <div className="HHyjauj-agh-BBNabs">
                    <button
                      className={`GHuh-Form-Button ${
                        formData.accountType === 'Client' ? 'IsActive-Oka' : ''
                      }`}
                      onClick={() => handleAccountTypeSelect('Client')}
                    >
                      <img src={AccountSelctClient} />
                      Client Account
                    </button>
                    <button
                      className={`GHuh-Form-Button ${
                        formData.accountType === 'Staff' ? 'IsActive-Oka' : ''
                      }`}
                      onClick={() => handleAccountTypeSelect('Staff')}
                    >
                      <img src={AccountSelctStaff} />
                      Staff Account
                    </button>
                  </div>
                  {fieldErrors.accountType && (
                    <p className="erro-message-Txt ook-rra">{fieldErrors.accountType}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`UKiakks-Part custom-scroll-bar ${
                activeKey === 'Details' ? 'Active-CChgba' : ''
              }`}
              style={{ display: activeKey === 'Details' ? 'block' : 'none' }}
              variants={sectionVariants}
              initial="hidden"
              animate={activeKey === 'Details' ? 'visible' : 'hidden'}
              exit="exit"
            >
              <div className="UKiakks-Part-Box">
                <div className="UKiakks-Part-Header">
                  <h3>Basic Details</h3>
                </div>
                <div className="UKiakks-Part-Main">
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name (e.g., Olivia)"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.firstName && (
                        <p className="erro-message-Txt">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name (e.g., Bennett)"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.lastName && (
                        <p className="erro-message-Txt">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email (e.g., olivia.bennett@email.com)"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.email && (
                      <p className="erro-message-Txt">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number (e.g., +1 415 555 2671)"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.phone && (
                        <p className="erro-message-Txt">{fieldErrors.phone}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange}>
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.gender && (
                        <p className="erro-message-Txt">{fieldErrors.gender}</p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.dob && (
                      <p className="erro-message-Txt">{fieldErrors.dob}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Enter street address (e.g., 742 Evergreen Terrace)"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.street && (
                      <p className="erro-message-Txt">{fieldErrors.street}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Type your city (e.g., Springfield)"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.city && (
                      <p className="erro-message-Txt">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Type your state (e.g., Illinois)"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.state && (
                      <p className="erro-message-Txt">{fieldErrors.state}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      placeholder="Enter zip code (e.g., 62704)"
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.zip && (
                      <p className="erro-message-Txt">{fieldErrors.zip}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="UKiakks-Part-Box for-Stafff-Onlyy"
                style={{ display: formData.accountType === 'Staff' ? 'block' : 'none' }}
              >
                <div className="UKiakks-Part-Header">
                  <h3>Right to Work & Identification</h3>
                </div>
                <div className="UKiakks-Part-Main">
                  <div className="GHuh-Form-Input">
                    <label>Do you have the right to work in the UK?</label>
                    <select
                      name="rightToWorkUK"
                      value={formData.rightToWorkUK}
                      onChange={handleInputChange}
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {fieldErrors.rightToWorkUK && (
                      <p className="erro-message-Txt">{fieldErrors.rightToWorkUK}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Upload Proof of Right to Work (e.g., Passport, BRP, Visa)</label>
                    <input
                      type="file"
                      name="proofRightToWork"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFormFileChange(e, 'proofRightToWork')}
                    />
                    {fieldErrors.proofRightToWork && (
                      <p className="erro-message-Txt">{fieldErrors.proofRightToWork}</p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Upload Valid Photo ID (e.g., Driving Licence, Passport)</label>
                    <input
                      type="file"
                      name="photoID"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFormFileChange(e, 'photoID')}
                    />
                    {fieldErrors.photoID && (
                      <p className="erro-message-Txt">{fieldErrors.photoID}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="UKiakks-Part-Box for-Stafff-Onlyy"
                style={{ display: formData.accountType === 'Staff' ? 'block' : 'none' }}
              >
                <div className="UKiakks-Part-Header">
                  <h3>Employment Details</h3>
                </div>
                <div className="UKiakks-Part-Main">
                  <div className="GHuh-Form-Input">
                    <label>Job Role/Position</label>
                    <input
                      type="text"
                      name="jobRole"
                      placeholder="Enter job role/position (e.g., Healthcare Assistant, Nurse, Support Worker)"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.jobRole && (
                      <p className="erro-message-Txt">{fieldErrors.jobRole}</p>
                    )}
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Employment Type</label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                      </select>
                      {fieldErrors.employmentType && (
                        <p className="erro-message-Txt">{fieldErrors.employmentType}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Start Date Availability</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.startDate && (
                        <p className="erro-message-Txt">{fieldErrors.startDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Upload CV</label>
                      <input
                        type="file"
                        name="cv"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFormFileChange(e, 'cv')}
                      />
                      {fieldErrors.cv && (
                        <p className="erro-message-Txt">{fieldErrors.cv}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Upload DBS Certificate</label>
                      <input
                        type="file"
                        name="dbsCertificate"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFormFileChange(e, 'dbsCertificate')}
                      />
                      {fieldErrors.dbsCertificate && (
                        <p className="erro-message-Txt">{fieldErrors.dbsCertificate}</p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Do you have a valid DBS registered on the Update Service?</label>
                    <select
                      name="dbsUpdateService"
                      value={formData.dbsUpdateService}
                      onChange={handleInputChange}
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {fieldErrors.dbsUpdateService && (
                      <p className="erro-message-Txt">{fieldErrors.dbsUpdateService}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="UKiakks-Part-Box for-Stafff-Onlyy"
                style={{ display: formData.accountType === 'Staff' ? 'block' : 'none' }}
              >
                <div className="UKiakks-Part-Header">
                  <h3>Availability</h3>
                </div>
                <div className="UKiakks-Part-Main">
                  <div className="GHuh-Form-Input">
                    <label>Days Available</label>
                    <ul className="dddaa-assyhja-Ulaa">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (
                        <li
                          key={day}
                          className={formData.daysAvailable.includes(day) ? 'active-UVVho' : ''}
                          onClick={() => handleDayToggle(day)}
                          style={{ cursor: 'pointer' }}
                        >
                          {day}
                        </li>
                      ))}
                    </ul>
                    {fieldErrors.daysAvailable && (
                      <p className="erro-message-Txt">{fieldErrors.daysAvailable}</p>
                    )}
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Preferred Shift Times</label>
                      <select
                        name="shiftTimes"
                        value={formData.shiftTimes}
                        onChange={handleInputChange}
                      >
                        <option value="">Select shift</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Night">Night</option>
                      </select>
                      {fieldErrors.shiftTimes && (
                        <p className="erro-message-Txt">{fieldErrors.shiftTimes}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Are you flexible with shifts?</label>
                      <select
                        name="shiftFlexibility"
                        value={formData.shiftFlexibility}
                        onChange={handleInputChange}
                      >
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {fieldErrors.shiftFlexibility && (
                        <p className="erro-message-Txt">{fieldErrors.shiftFlexibility}</p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>How many hours can you work per week?</label>
                    <select
                      name="hoursPerWeek"
                      value={formData.hoursPerWeek}
                      onChange={handleInputChange}
                    >
                      <option value="">Select hours</option>
                      {[...Array(24)].map((_, i) => (
                        <option
                          key={i + 1}
                          value={`${i + 1} hour${i + 1 > 1 ? 's' : ''}`}
                        >
                          {i + 1} hour{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.hoursPerWeek && (
                      <p className="erro-message-Txt">{fieldErrors.hoursPerWeek}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="UKiakks-Part-Box for-Stafff-Onlyy"
                  style={{ display: formData.accountType === 'Staff' ? 'block' : 'none' }}
                >
                  <div className="UKiakks-Part-Header">
                    <h3>Qualifications & Training</h3>
                  </div>
                  <div className="UKiakks-Part-Main">
                    <div className="GHuh-Form-Input">
                      <label>Do you have Care Certificate or NVQ?</label>
                      <select
                        name="careCertificate"
                        value={formData.careCertificate}
                        onChange={handleInputChange}
                      >
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {fieldErrors.careCertificate && (
                        <p className="erro-message-Txt">{fieldErrors.careCertificate}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Upload Care Certificate</label>
                      <input
                        type="file"
                        name="careCertificateFile"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFormFileChange(e, 'careCertificateFile')}
                      />
                      {fieldErrors.careCertificateFile && (
                        <p className="erro-message-Txt">{fieldErrors.careCertificateFile}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Upload Mandatory Training Certificates</label>
                      <input
                        type="file"
                        name="trainingCertificates"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFormFileChange(e, 'trainingCertificates')}
                      />
                      {fieldErrors.trainingCertificates && (
                        <p className="erro-message-Txt">{fieldErrors.trainingCertificates}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Do you have any professional registration (e.g., NMC Pin for nurses)?</label>
                      <select
                        name="professionalRegistration"
                        value={formData.professionalRegistration}
                        onChange={handleInputChange}
                      >
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {fieldErrors.professionalRegistration && (
                        <p className="erro-message-Txt">{fieldErrors.professionalRegistration}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Upload Proof of Registration</label>
                      <input
                        type="file"
                        name="proofRegistration"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFormFileChange(e, 'proofRegistration')}
                      />
                      {fieldErrors.proofRegistration && (
                        <p className="erro-message-Txt">{fieldErrors.proofRegistration}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="UKiakks-Part-Box for-Stafff-Onlyy"
                  style={{ display: formData.accountType === 'Staff' ? 'block' : 'none' }}
                >
                  <div className="UKiakks-Part-Header">
                    <h3>Bank Details (for Payroll)</h3>
                  </div>
                  <div className="UKiakks-Part-Main">
                    <div className="GHuh-Form-Input">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        placeholder="Enter bank name"
                        value={formData.bankName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.bankName && (
                        <p className="erro-message-Txt">{fieldErrors.bankName}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Account Holder Name</label>
                      <input
                        type="text"
                        name="accountHolder"
                        placeholder="Enter account holder name"
                        value={formData.accountHolder}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.accountHolder && (
                        <p className="erro-message-Txt">{fieldErrors.accountHolder}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Sort Code</label>
                      <input
                        type="text"
                        name="sortCode"
                        placeholder="Enter sort code"
                        value={formData.sortCode}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.sortCode && (
                        <p className="erro-message-Txt">{fieldErrors.sortCode}</p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.accountNumber && (
                        <p className="erro-message-Txt">{fieldErrors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="UKiakks-Part-Box">
                  <div className="UKiakks-Part-Header GGtg-Dah">
                    <h3>Document Uploads</h3>
                    <span onClick={handleAddCard} style={{ cursor: 'pointer' }}>
                      <PlusIcon /> Add
                    </span>
                  </div>
                  <div className="UKiakks-Part-Main" style={{ position: 'relative' }}>
                    <div className="Uppol-CCards">{renderUploadCards()}</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={`UKiakks-Part custom-scroll-bar ${
                  activeKey === 'Permissions' ? 'Active-CChgba' : ''
                }`}
                style={{ display: activeKey === 'Permissions' ? 'block' : 'none' }}
                variants={sectionVariants}
                initial="hidden"
                animate={activeKey === 'Permissions' ? 'visible' : 'hidden'}
                exit="exit"
              >
                <div className="UKiakks-Part-Box">
                  <div className="UKiakks-Part-Header">
                    <h3>Permission Settings</h3>
                  </div>
                  <div className="UKiakks-Part-Main">
                    <ul className="checcck-lissT ouka-UUUkol">
                      {Object.keys(permissions).map((permission) => (
                        <li
                          key={permission}
                          className={permissions[permission] ? 'active-Li-Check' : ''}
                          onClick={() => handlePermissionToggle(permission)}
                          style={{ cursor: 'pointer' }}
                        >
                          {permission}
                          <span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={`UKiakks-Part custom-scroll-bar ${
                  activeKey === 'Set Login Credentials' ? 'Active-CChgba' : ''
                }`}
                style={{ display: activeKey === 'Set Login Credentials' ? 'block' : 'none' }}
                variants={sectionVariants}
                initial="hidden"
                animate={activeKey === 'Set Login Credentials' ? 'visible' : 'hidden'}
                exit="exit"
              >
                <div className="UKiakks-Part-Box">
                  <div className="UKiakks-Part-Header">
                    <h3>Login Settings</h3>
                  </div>
                  <div className="UKiakks-Part-Main">
                    <div className="Grga-INpu-Grid">
                
                      <div className="GHuh-Form-Input">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Enter username (e.g., Olivia09)"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                        {fieldErrors.username && (
                          <p className="erro-message-Txt">{fieldErrors.username}</p>
                        )}
                      </div>


                            <div className="GHuh-Form-Input">
                      <label>Password</label>
                      <div className="ool-IINpa">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="icon" />
                          ) : (
                            <EyeIcon className="icon" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="erro-message-Txt">{fieldErrors.password}</p>
                      )}
                    </div>

                    </div>

                       <div className="GHuh-Form-Input">
                        <label>Two-Factor Auth</label>
                        <select
                          name="twoFactor"
                          value={formData.twoFactor}
                          onChange={handleInputChange}
                        >
                          <option value="">Select option</option>
                          <option value="Enable">Enable</option>
                          <option value="Disable">Disable</option>
                        </select>
                        {fieldErrors.twoFactor && (
                          <p className="erro-message-Txt">{fieldErrors.twoFactor}</p>
                        )}
                      </div>
              
                    <div className="Grga-INpu-Grid">
                      
                            <div className="GHuh-Form-Input">
                        <label>Dashboard</label>
                        <select
                          name="dashboard"
                          value={formData.dashboard}
                          onChange={handleInputChange}
                        >
                          <option value="">Select dashboard</option>
                          <option value="Client">Client</option>
                          <option value="Staff">Staff</option>
                          <option value="Admin">Admin</option>
                          <option value="Sub Admin">Sub Admin</option>
                        </select>
                        {fieldErrors.dashboard && (
                          <p className="erro-message-Txt">{fieldErrors.dashboard}</p>
                        )}
                      </div>

                      <div className="GHuh-Form-Input">
                        <label>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="">Select status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        {fieldErrors.status && (
                          <p className="erro-message-Txt">{fieldErrors.status}</p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AddUser;