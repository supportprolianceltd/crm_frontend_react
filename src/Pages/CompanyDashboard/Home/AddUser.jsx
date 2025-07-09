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
  zipCode: '', // Correct
  role: '',
  department: '',
  dashboard: '',
  accessLevel: '',
  username: '',
  password: '',
  status: '',
  twoFactor: '',
  emailDomain: '',
});

// Update useEffect to set emailDomain
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
        setFormData(prev => ({ ...prev, emailDomain: primaryDomain }));
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
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Fetch modules
  //       const moduleData = await fetchModules();
  //       setModules(moduleData);

  //       // Fetch tenant data
  //       const tenantData = await fetchTenant();
  //       const tenant = tenantData.find((t) => t.schema_name === 'proliance');
  //       if (tenant) {
  //         const primaryDomain = tenant.domains.find((d) => d.is_primary)?.domain || '';
  //         setTenantDomain(primaryDomain);
  //       } else {
  //         throw new Error('Proliance tenant not found');
  //       }
  //     } catch (error) {
  //       setErrorMessage(error.message);
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   loadData();
  // }, []);

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
    zipCode: '', // Fixed
    role: '',
    department: '',
    dashboard: '',
    accessLevel: '',
    username: '',
    password: '',
    status: '',
    twoFactor: '',
    emailDomain: tenantDomain,
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
      zipCode: 'Zip Code is required',
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

// AddUser.jsx (only update the handleContinue function; rest remains unchanged)
const handleContinue = async () => {
  try {
    setIsLoading(true);
    setErrorMessage('');
    setFieldErrors({});

    // Define required fields per step
    const stepFields = {
      Details: [
        { key: 'emailUsername', value: formData.emailUsername, label: 'Email username' },
        { key: 'firstName', value: formData.firstName, label: 'First name' },
        { key: 'lastName', value: formData.lastName, label: 'Last name' },
        { key: 'phone', value: formData.phone, label: 'Phone' },
        { key: 'gender', value: formData.gender, label: 'Gender' },
        { key: 'dob', value: formData.dob, label: 'Date of birth' },
        { key: 'street', value: formData.street, label: 'Street' },
        { key: 'city', value: formData.city, label: 'City' },
        { key: 'state', value: formData.state, label: 'State' },
        { key: 'zipCode', value: formData.zipCode, label: 'Zip code' },
      ],
      'Role Assignment': [
        { key: 'role', value: formData.role, label: 'Role' },
        { key: 'department', value: formData.department, label: 'Department' },
        { key: 'dashboard', value: formData.dashboard, label: 'Dashboard' },
        { key: 'accessLevel', value: formData.accessLevel, label: 'Access level' },
      ],
      Permissions: [],
      'Set Login Credentials': [
        { key: 'username', value: formData.username, label: 'Username' },
        { key: 'password', value: formData.password, label: 'Password' },
        { key: 'status', value: formData.status, label: 'Status' },
        { key: 'twoFactor', value: formData.twoFactor, label: 'Two-factor authentication' },
      ],
    };

    // Determine which steps to validate based on current activeKey
    const currentIndex = steps.findIndex(step => step.key === activeKey);
    const stepsToValidate = steps.slice(0, currentIndex + 1).map(step => step.key);

    // Collect all required fields for the steps to validate
    let missingFields = [];
    const errors = {};
    stepsToValidate.forEach(stepKey => {
      const fields = stepFields[stepKey] || [];
      const stepMissing = fields.filter(field => !field.value);
      stepMissing.forEach(field => {
        errors[field.key] = `${field.label} is required.`;
      });
      missingFields = [...missingFields, ...stepMissing];
    });

    // Validate email username format
    if (formData.emailUsername && !/^[a-zA-Z0-9._-]+$/i.test(formData.emailUsername)) {
      errors.emailUsername = 'Email username can only contain letters, numbers, dots, underscores, or hyphens.';
      missingFields.push({ key: 'emailUsername', label: 'Email username' });
    }

    // Validate password length (only if on Set Login Credentials)
    if (activeKey === 'Set Login Credentials' && formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
      missingFields.push({ key: 'password', label: 'Password' });
    }

    if (missingFields.length > 0) {
      setFieldErrors(errors);
      setErrorMessage(
        `Please fill in the following required fields: ${missingFields.map(field => field.label).join(', ')}.`
      );
      setIsLoading(false);
      return false;
    }

    // Proceed to next step if not the last step
    const isLastStep = currentIndex === steps.length - 1;
    if (!isLastStep) {
      const nextIndex = currentIndex + 1;
      handleStepClick(steps[nextIndex].key);
      setIsLoading(false);
      return false;
    }

    // Construct full email
    const fullEmail = tenantDomain
      ? `${formData.emailUsername}@${tenantDomain}`.toLowerCase()
      : formData.emailUsername;

    // Construct FormData (only sent on last step)
    const formDataToSend = new FormData();

    // Append top-level fields
    formDataToSend.append('email', fullEmail);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('first_name', formData.firstName);
    formDataToSend.append('last_name', formData.lastName);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('job_role', formData.department);
    formDataToSend.append('dashboard', formData.dashboard);
    formDataToSend.append('access_level', formData.accessLevel);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('two_factor', formData.twoFactor);

    // Append profile fields
// In handleContinue function:
const profile = {
  phone: formData.phone,
  gender: formData.gender,
  dob: formData.dob,
  street: formData.street,
  city: formData.city,
  state: formData.state,
  zip_code: formData.zipCode,  // Changed from zipCode to zip_code
  department: formData.department,
};
    Object.keys(profile).forEach(key => {
      formDataToSend.append(`profile[${key}]`, profile[key] || '');
    });

    // Append modules
    const selectedModuleIds = Object.keys(permissions)
      .filter(key => permissions[key])
      .map(key => {
        const module = modules.find(m => m.name === key.replace('Access ', ''));
        return module ? module.id : null;
      })
      .filter(id => id !== null);
      
    selectedModuleIds.forEach((moduleId, index) => {
      formDataToSend.append(`modules[${index}]`, moduleId);
    });

    // Validate and append documents
    const validDocuments = uploadCards.filter(card => card.selectedFile && card.fileName);
    validDocuments.forEach((card, index) => {
      if (!(card.selectedFile instanceof File)) {
        console.error(`Document ${index} is not a valid File object:`, card.selectedFile);
        setFieldErrors(prev => ({
          ...prev,
          documents: `Document ${card.fileName} is not a valid file.`,
        }));
        setErrorMessage(`Document ${card.fileName} is not a valid file.`);
        setIsLoading(false);
        return false;
      }
      formDataToSend.append(`documents[${index}][title]`, card.fileName);
      formDataToSend.append(`documents[${index}][file]`, card.selectedFile);
    });

    if (validDocuments.length === 0 && uploadCards.some(card => card.selectedFile || card.fileName)) {
      setFieldErrors(prev => ({
        ...prev,
        documents: 'All documents must have a valid file and title.',
      }));
      setErrorMessage('All documents must have a valid file and title.');
      setIsLoading(false);
      return false;
    }

    // Log FormData for debugging
    const formDataEntries = {};
    for (let [key, value] of formDataToSend.entries()) {
      formDataEntries[key] = value instanceof File ? `${value.name} (${value.size} bytes)` : value;
    }
    console.log('FormData being sent:', formDataEntries);

    // Additional logging for files
    console.log('Files in FormData:', Array.from(formDataToSend.entries())
      .filter(([key]) => key.includes('[file]'))
      .map(([key, value]) => ({
        key,
        name: value.name,
        size: value.size,
        type: value instanceof File ? 'File' : typeof value,
      }))
    );

    // Send request
    const response = await createUser(formDataToSend);
    setSuccessMessage(response.message || `User ${fullEmail} created successfully.`);
    resetForm();
    handleStepClick(steps[0].key);
  } catch (error) {
    console.error('handleContinue error:', {
      message: error.message,
      stack: error.stack,
    });
    const errorDetails = error.response?.data?.message || error.message;
    const fieldErrors = {};

    if (typeof errorDetails === 'string') {
      if (errorDetails.includes('email:')) {
        fieldErrors.emailUsername = errorDetails.match(/email: ([^;]+)/)?.[1] || 'Invalid email';
      }
      if (errorDetails.includes('username:')) {
        fieldErrors.username = errorDetails.match(/username: ([^;]+)/)?.[1] || 'Invalid username';
      }
      if (errorDetails.includes('profile:')) {
        const profileError = errorDetails.match(/profile: ([^;]+)/)?.[1] || 'Invalid profile data';
        fieldErrors.profile = profileError;
        const profileFieldErrors = errorDetails.match(/profile\[([^\]]+)\]: ([^;]+)/g);
        if (profileFieldErrors) {
          profileFieldErrors.forEach(err => {
            const [, field, message] = err.match(/profile\[([^\]]+)\]: ([^;]+)/);
            const fieldMap = { zip_code: 'zipCode' };
            fieldErrors[fieldMap[field] || field] = message;
          });
        }
      }
      if (errorDetails.includes('documents:')) {
        const docErrors = errorDetails.match(/documents\[(\d+)\]\[([^\]]+)\]: ([^;]+)/g);
        if (docErrors) {
          const formattedErrors = docErrors.map(err => {
            const [, index, field, message] = err.match(/documents\[(\d+)\]\[([^\]]+)\]: ([^;]+)/);
            const fileName = uploadCards[index]?.fileName || `Document ${parseInt(index) + 1}`;
            return `${fileName}: ${field} ${message}`;
          });
          fieldErrors.documents = formattedErrors.join('; ');
        } else {
          fieldErrors.documents = errorDetails.match(/documents: ([^;]+)/)?.[1] || 'Invalid document data';
        }
      }
    } else if (typeof errorDetails === 'object') {
      // Handle structured errors from the backend
      if (errorDetails.profile) {
        Object.entries(errorDetails.profile).forEach(([field, errors]) => {
          const fieldMap = { zip_code: 'zipCode' };
          fieldErrors[fieldMap[field] || field] = Array.isArray(errors) ? errors.join(', ') : errors;
        });
      }
      if (errorDetails.documents) {
        const docErrors = errorDetails.documents.map((doc, index) => {
          const fileName = uploadCards[index]?.fileName || `Document ${index + 1}`;
          if (typeof doc === 'object') {
            return Object.entries(doc).map(([field, errors]) => 
              `${fileName}: ${field} ${Array.isArray(errors) ? errors.join(', ') : errors}`
            ).join('; ');
          }
          return `${fileName}: ${doc}`;
        });
        fieldErrors.documents = docErrors.join('; ');
      }
      if (errorDetails.email) {
        fieldErrors.emailUsername = Array.isArray(errorDetails.email) ? errorDetails.email.join(', ') : errorDetails.email;
      }
      if (errorDetails.username) {
        fieldErrors.username = Array.isArray(errorDetails.username) ? errorDetails.username.join(', ') : errorDetails.username;
      }
    }

    setFieldErrors(fieldErrors);
    setErrorMessage(
      Object.keys(fieldErrors).length > 0
        ? `Please correct the following: ${Object.entries(fieldErrors)
            .map(([field, err]) => `${field}: ${err}`)
            .join(', ')}`
        : errorDetails || 'Failed to create user.'
    );
  } finally {
    setIsLoading(false);
  }
  return false;
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
        if (formData.zipCode) {
          children.push(
            <motion.li key="zipCode">
              <span>Zip Code</span>
              <p>{formData.zipCode}</p>
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
                      name="zipCode"
                      placeholder='Enter zip code (e.g., 12345)'
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    {fieldErrors.zipCode && (
                      <p className='erro-message-Txt'>
                        {fieldErrors.zipCode}
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
                  {fieldErrors.documents && (
                    <p className='erro-message-Txt' style={{ color: '#e53e3e', marginTop: '10px' }}>
                      {fieldErrors.documents}
                    </p>
                  )}
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