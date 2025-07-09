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

const steps = [
  { key: 'Details', title: 'Details' },
  { key: 'Role Assignment', title: 'Role Assignment' },
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
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

// Slide-in variants for sections
const sectionVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.3, ease: 'easeIn' }
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
  const [activeKey, setActiveKey] = useState('Details');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [modules, setModules] = useState([]);
  const [tenantDomain, setTenantDomain] = useState('');
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
    emailUsername: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    role: '',
    department: '',
    dashboard: '',
    accessLevel: '',
    username: '',
    password: '',
    status: '',
    twoFactor: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const titleInputRefs = useRef({});
  const fileInputRefs = useRef({});
  const sectionRefs = {
    Details: useRef(null),
    'Role Assignment': useRef(null),
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
                previewUrl: file.type.includes('image')
                  ? URL.createObjectURL(file)
                  : null,
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

  const handleRemoveCard = (id) => {
    if (uploadCards.length <= 1) return;
    setUploadCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleAddCard = () => {
    const newId = Date.now();
    setUploadCards((prev) => [
      ...prev,
      { id: newId, selectedFile: null, previewUrl: null, fileSize: '0 B', fileName: '' },
    ]);
  };

  const handleFileNameChange = (id, value) => {
    setUploadCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, fileName: value } : card
      )
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const resetForm = () => {
    setFormData({
      emailUsername: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      dob: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      role: '',
      department: '',
      dashboard: '',
      accessLevel: '',
      username: '',
      password: '',
      status: '',
      twoFactor: '',
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
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = '';
    });
  };

  // Validation functions for each step
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
    const errors = {};
    let isValid = true;

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field]) {
        errors[field] = requiredFields[field];
        isValid = false;
      }
    });

    // Validate email username format
    if (formData.emailUsername && !/^[a-zA-Z0-9._-]+$/i.test(formData.emailUsername)) {
      errors.emailUsername = 'Email username can only contain letters, numbers, dots, underscores, or hyphens';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setErrorMessage('Please fill in all required fields.');
    }
    return isValid;
  };

  const validateRoleAssignmentStep = () => {
    const requiredFields = {
      role: 'Role is required',
      department: 'Department is required',
      dashboard: 'Dashboard selection is required',
      accessLevel: 'Access Level is required',
    };
    const errors = {};
    let isValid = true;

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field]) {
        errors[field] = requiredFields[field];
        isValid = false;
      }
    });

    setFieldErrors(errors);
    if (!isValid) {
      setErrorMessage('Please fill in all required fields.');
    }
    return isValid;
  };

  const validateLoginCredentialsStep = () => {
    const requiredFields = {
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

    // Validate current step before proceeding
    let isValid = false;
    switch (activeKey) {
      case 'Details':
        isValid = validateDetailsStep();
        break;
      case 'Role Assignment':
        isValid = validateRoleAssignmentStep();
        break;
      case 'Set Login Credentials':
        isValid = validateLoginCredentialsStep();
        break;
      default:
        isValid = true; // Permissions step has no required fields
    }

    if (!isValid) {
      return; // Stop if validation fails
    }

    // Clear any existing error message and field errors
    setErrorMessage(null);
    setFieldErrors({});

    // Proceed to the next step or create user
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
            <span
              onClick={() => handlePreviewClick(card)}
              style={{ cursor: 'pointer' }}
            >
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
            <span
              onClick={() => handleClearFile(card.id)}
              style={{ cursor: 'pointer' }}
            >
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
      case 'Details':
        if (formData.firstName) {
          children.push(
            <motion.li key="firstName">
              <span>First Name</span>
              <p>{formData.firstName}</p>
            </motion.li>
          );
        }
        if (formData.lastName) {
          children.push(
            <motion.li key="lastName">
              <span>Last Name</span>
              <p>{formData.lastName}</p>
            </motion.li>
          );
        }
        if (formData.emailUsername && tenantDomain) {
          children.push(
            <motion.li key="email">
              <span>Email</span>
              <p>{`${formData.emailUsername}@${tenantDomain}`}</p>
            </motion.li>
          );
        }
        if (formData.phone) {
          children.push(
            <motion.li key="phone">
              <span>Phone</span>
              <p>{formData.phone}</p>
            </motion.li>
          );
        }
        if (formData.gender) {
          children.push(
            <motion.li key="gender">
              <span>Gender</span>
              <p>{formData.gender}</p>
            </motion.li>
          );
        }
        if (formData.dob) {
          children.push(
            <motion.li key="dob">
              <span>Date of Birth</span>
              <p>{formData.dob}</p>
            </motion.li>
          );
        }
        if (formData.street) {
          children.push(
            <motion.li key="street">
              <span>Street</span>
              <p>{formData.street}</p>
            </motion.li>
          );
        }
        if (formData.city) {
          children.push(
            <motion.li key="city">
              <span>City</span>
              <p>{formData.city}</p>
            </motion.li>
          );
        }
        if (formData.state) {
          children.push(
            <motion.li key="state">
              <span>State</span>
              <p>{formData.state}</p>
            </motion.li>
          );
        }
        if (formData.zip) {
          children.push(
            <motion.li key="zip">
              <span>Zip Code</span>
              <p>{formData.zip}</p>
            </motion.li>
          );
        }
        if (fieldErrors.profile) {
          children.push(
            <motion.li key="profileError" className="error">
              <span>Profile</span>
              <p style={{ color: '#e53e3e' }}>{fieldErrors.profile}</p>
            </motion.li>
          );
        }
        return <SectionList>{children}</SectionList>;

      case 'Role Assignment':
        if (formData.role) {
          children.push(
            <motion.li key="role">
              <span>Assigned Role</span>
              <p>{formData.role}</p>
            </motion.li>
          );
        }
        if (formData.department) {
          children.push(
            <motion.li key="department">
              <span>Department</span>
              <p>{formData.department}</p>
            </motion.li>
          );
        }
        if (formData.dashboard) {
          children.push(
            <motion.li key="dashboard">
              <span>Dashboard</span>
              <p>{formData.dashboard}</p>
            </motion.li>
          );
        }
        if (formData.accessLevel) {
          children.push(
            <motion.li key="accessLevel">
              <span>Access Level</span>
              <p>{formData.accessLevel}</p>
            </motion.li>
          );
        }
        return <SectionList>{children}</SectionList>;

      case 'Permissions':
        Object.keys(permissions).forEach((permission) => {
          children.push(
            <motion.li key={permission}>
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
            <motion.li key="username">
              <span>Username</span>
              <p>{formData.username}</p>
            </motion.li>
          );
        }
        if (formData.password) {
          children.push(
            <motion.li key="password">
              <span>Password</span>
              <p>••••••••</p>
            </motion.li>
          );
        }
        if (formData.status) {
          children.push(
            <motion.li key="status">
              <span>Status</span>
              <p>{formData.status}</p>
            </motion.li>
          );
        }
        if (formData.twoFactor) {
          children.push(
            <motion.li key="twoFactor">
              <span>Two-Factor Auth</span>
              <p>{formData.twoFactor}</p>
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
              ) : (
                isLastStep ? 'Create User' : 'Continue'
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
                <h5>Prince Godson</h5>
                <p>Role: User</p>
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
              className={`UKiakks-Part custom-scroll-bar ${activeKey === 'Details' ? 'Active-CChgba' : ''}`}
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
                <div className='UKiakks-Part-Main'>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>First Name</label>
                      <input
                        type='text'
                        name="firstName"
                        placeholder='Enter first name (e.g., Olivia)'
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.firstName && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Last Name</label>
                      <input
                        type='text'
                        name="lastName"
                        placeholder='Enter last name (e.g., Bennett)'
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.lastName && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Email</label>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <input
                        type='text'
                        name="emailUsername"
                        placeholder='Enter email username (e.g., olivia.bennett)'
                        value={formData.emailUsername}
                        onChange={handleInputChange}
                        style={{ paddingRight: tenantDomain ? `${tenantDomain.length * 8 + 20}px` : '10px' }}
                      />
                      {tenantDomain && (
                        <span
                          style={{
                            position: 'absolute',
                            right: '10px',
                            color: '#888',
                            userSelect: 'none',
                          }}
                        >
                          @{tenantDomain}
                        </span>
                      )}
                    </div>
                    {fieldErrors.emailUsername && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.emailUsername}
                      </p>
                    )}
                    {fieldErrors.profile && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.profile}
                      </p>
                    )}
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Phone</label>
                      <input
                        type='tel'
                        name="phone"
                        placeholder='Enter phone number (e.g., +1 415 555 2671)'
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.phone && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.gender && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Date of Birth</label>
                    <input
                      type='date'
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.dob && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.dob}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Street</label>
                    <input
                      type='text'
                      name="street"
                      placeholder='Enter street address (e.g., 742 Evergreen Terrace)'
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.street && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.street}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>City</label>
                    <input
                      type='text'
                      name="city"
                      placeholder='Type your city (e.g., Springfield)'
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.city && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>State</label>
                    <input
                      type='text'
                      name="state"
                      placeholder='Type your state (e.g., Rivers)'
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.state && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Zip Code</label>
                    <input
                      type='text'
                      name="zip"
                      placeholder='Enter zip code (e.g., 12345)'
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.zip && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.zip}
                      </p>
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
              className={`UKiakks-Part custom-scroll-bar ${activeKey === 'Role Assignment' ? 'Active-CChgba' : ''}`}
              style={{ display: activeKey === 'Role Assignment' ? 'block' : 'none' }}
              variants={sectionVariants}
              initial="hidden"
              animate={activeKey === 'Role Assignment' ? 'visible' : 'hidden'}
              exit="exit"
            >
              <div className="UKiakks-Part-Box">
                <div className="UKiakks-Part-Header">
                  <h3>Role Settings</h3>
                </div>
                <div className='UKiakks-Part-Main'>
                  <div className="GHuh-Form-Input">
                    <label>Assign Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                      <option value="carer">Carer</option>
                      <option value="client">Client</option>
                      <option value="family">Family</option>
                      <option value="auditor">Auditor</option>
                      <option value="tutor">Tutor</option>
                      <option value="assessor">Assessor</option>
                      <option value="iqa">IQA</option>
                      <option value="eqa">EQA</option>
                    </select>
                    {fieldErrors.role && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.role}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Department</label>
                    <input
                      type='text'
                      name="department"
                      placeholder='Enter department (e.g., Nursing and Adult Care)'
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.department && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.department}
                      </p>
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
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="user">User</option>
                      </select>
                      {fieldErrors.dashboard && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.dashboard}
                        </p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Access Level</label>
                      <select
                        name="accessLevel"
                        value={formData.accessLevel}
                        onChange={handleInputChange}
                      >
                        <option value="">Select access level</option>
                        <option value="full">Full Access</option>
                        <option value="view_only">Limited Access</option>
                      </select>
                      {fieldErrors.accessLevel && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.accessLevel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`UKiakks-Part custom-scroll-bar ${activeKey === 'Permissions' ? 'Active-CChgba' : ''}`}
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
                  <ul className='checcck-lissT ouka-UUUkol'>
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
                  {fieldErrors.modules && (
                    <p className='erro-message-Txt'>
                      {fieldErrors.modules}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`UKiakks-Part custom-scroll-bar ${activeKey === 'Set Login Credentials' ? 'Active-CChgba' : ''}`}
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
                <div className='UKiakks-Part-Main'>
                  <div className="GHuh-Form-Input">
                    <label>Username</label>
                    <input
                      type='text'
                      name="username"
                      placeholder='Enter username (e.g., Olivia09)'
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.username && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>
                  <div className="GHuh-Form-Input">
                    <label>Password</label>
                    <div className='ool-IINpa'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder='Enter Password'
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
                          <EyeSlashIcon className='icon' />
                        ) : (
                          <EyeIcon className='icon' />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="Grga-INpu-Grid">
                    <div className="GHuh-Form-Input">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {fieldErrors.status && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.status}
                        </p>
                      )}
                    </div>
                    <div className="GHuh-Form-Input">
                      <label>Two-Factor Auth</label>
                      <select
                        name="twoFactor"
                        value={formData.twoFactor}
                        onChange={handleInputChange}
                      >
                        <option value="">Select option</option>
                        <option value="enable">Enable</option>
                        <option value="disable">Disable</option>
                      </select>
                      {fieldErrors.twoFactor && (
                        <p className='erro-message-Txt'>
                          {fieldErrors.twoFactor}
                        </p>
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