import React, { useEffect, useRef, useState } from 'react';
import {
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ChartBarIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  InboxStackIcon,
  AdjustmentsVerticalIcon,
  FaceSmileIcon,
  EllipsisHorizontalIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

import DefaulUser from '../../../assets/Img/memberIcon.png';
import MembImg1 from '../../../assets/Img/memberIcon1.jpg';
import MembImg2 from '../../../assets/Img/memberIcon2.jpg';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

function formatNumberWithCommas(x) {
  if (typeof x !== 'number') return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1.4, stiffness: 70, damping: 20 });
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) mv.set(value);
    const unsub = spring.on('change', v => setDisplay(Math.floor(v)));
    return () => unsub();
  }, [isInView, value]);

  const formattedDisplay =
    prefix === '£' ? formatNumberWithCommas(display) : display;

  return (
    <h3 ref={ref}>
      {prefix}
      {formattedDisplay}
      {suffix}
    </h3>
  );
};

// Cards Data per branch type and period
const cardsData = {
  operations: {
    'All Branches': {
      'Today': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 156, subtitle: '25 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 120, subtitle: '85% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 36, subtitle: '12 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 72, suffix: '%', subtitle: 'On track to meet the milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'This Week': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 1092, subtitle: '175 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 840, subtitle: '77% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 252, subtitle: '84 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 72, suffix: '%', subtitle: 'On track to meet the milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'Month': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 4680, subtitle: '750 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 3600, subtitle: '77% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 1080, subtitle: '360 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 72, suffix: '%', subtitle: 'On track to meet the milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'Year': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 56940, subtitle: '9125 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 43800, subtitle: '77% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 13140, subtitle: '4380 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 72, suffix: '%', subtitle: 'On track to meet the milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ]
    },
    'Main Branch': {
      'Today': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 54, subtitle: '8 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 42, subtitle: '78% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 12, subtitle: '4 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 68, suffix: '%', subtitle: 'Slightly behind milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'This Week': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 378, subtitle: '56 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 294, subtitle: '78% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 84, subtitle: '28 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 68, suffix: '%', subtitle: 'Slightly behind milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'Month': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 1620, subtitle: '240 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 1260, subtitle: '78% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 360, subtitle: '120 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 68, suffix: '%', subtitle: 'Slightly behind milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ],
      'Year': [
        { title: 'Total tasks', icon: <ClipboardDocumentCheckIcon />, value: 19710, subtitle: '2920 new tasks created', bg: '#E0F7FA', color: '#00796B' },
        { title: 'Completed tasks', icon: <CheckCircleIcon />, value: 15330, subtitle: '78% task completion rate', bg: '#E8F5E9', color: '#388E3C' },
        { title: 'Pending tasks', icon: <ClockIcon />, value: 4380, subtitle: '1460 tasks overdue', bg: '#FFF3E0', color: '#F57C00' },
        { title: 'Project progress', icon: <ChartBarIcon />, value: 68, suffix: '%', subtitle: 'Slightly behind milestone', bg: '#EDE7F6', color: '#5E35B1' },
      ]
    }
  },
  finance: {
    'All Branches': {
      'Today': [
        { title: 'Daily income', icon: <BanknotesIcon />, value: 12500, prefix: '£', subtitle: 'Up by 15%', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 8500, prefix: '£', subtitle: 'Includes salaries & utilities', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 40000, prefix: '£', subtitle: 'Awaiting clearance', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 60, suffix: '%', subtitle: 'Within monthly limit', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'This Week': [
        { title: 'Weekly income', icon: <BanknotesIcon />, value: 87500, prefix: '£', subtitle: 'Up by 12%', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 59500, prefix: '£', subtitle: 'Includes salaries & utilities', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 40000, prefix: '£', subtitle: 'Awaiting clearance', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 60, suffix: '%', subtitle: 'Within monthly limit', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Month': [
        { title: 'Monthly income', icon: <BanknotesIcon />, value: 375000, prefix: '£', subtitle: 'Up by 10%', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 255000, prefix: '£', subtitle: 'Includes salaries & utilities', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 40000, prefix: '£', subtitle: 'Awaiting clearance', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 60, suffix: '%', subtitle: 'Within monthly limit', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Year': [
        { title: 'Annual income', icon: <BanknotesIcon />, value: 4562500, prefix: '£', subtitle: 'Up by 8%', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 3107500, prefix: '£', subtitle: 'Includes salaries & utilities', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 40000, prefix: '£', subtitle: 'Awaiting clearance', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 60, suffix: '%', subtitle: 'Within yearly limit', bg: '#ECE8FC', color: '#450CD5' },
      ]
    },
    'Main Branch': {
      'Today': [
        { title: 'Daily income', icon: <BanknotesIcon />, value: 4200, prefix: '£', subtitle: 'Main branch revenue', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 3100, prefix: '£', subtitle: 'Payroll + power bills', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 10000, prefix: '£', subtitle: 'Yet to be received', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 52, suffix: '%', subtitle: 'Moderate usage', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'This Week': [
        { title: 'Weekly income', icon: <BanknotesIcon />, value: 29400, prefix: '£', subtitle: 'Main branch revenue', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 21700, prefix: '£', subtitle: 'Payroll + power bills', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 10000, prefix: '£', subtitle: 'Yet to be received', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 52, suffix: '%', subtitle: 'Moderate usage', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Month': [
        { title: 'Monthly income', icon: <BanknotesIcon />, value: 126000, prefix: '£', subtitle: 'Main branch revenue', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 93000, prefix: '£', subtitle: 'Payroll + power bills', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 10000, prefix: '£', subtitle: 'Yet to be received', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 52, suffix: '%', subtitle: 'Moderate usage', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Year': [
        { title: 'Annual income', icon: <BanknotesIcon />, value: 1533000, prefix: '£', subtitle: 'Main branch revenue', bg: '#E8FFF3', color: '#0FA958' },
        { title: 'Expenses', icon: <CreditCardIcon />, value: 1131500, prefix: '£', subtitle: 'Payroll + power bills', bg: '#FFEFEC', color: '#FF5724' },
        { title: 'Outstanding payments', icon: <InboxStackIcon />, value: 10000, prefix: '£', subtitle: 'Yet to be received', bg: '#FFF8E1', color: '#FFC107' },
        { title: 'Budget utilization', icon: <AdjustmentsVerticalIcon />, value: 52, suffix: '%', subtitle: 'Moderate usage', bg: '#ECE8FC', color: '#450CD5' },
      ]
    }
  },
  workforce: {
    'All Branches': {
      'Today': [
        { title: 'Active employees', icon: <UsersIcon />, value: 220, subtitle: 'Across all branches', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 80, subtitle: 'Real‑time workload', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 120, subtitle: 'Great job team!', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 85, suffix: '%', subtitle: 'Completed vs assigned', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'This Week': [
        { title: 'Active employees', icon: <UsersIcon />, value: 220, subtitle: 'Across all branches', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 560, subtitle: 'Weekly workload', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 840, subtitle: 'Great job team!', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 85, suffix: '%', subtitle: 'Completed vs assigned', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'Month': [
        { title: 'Active employees', icon: <UsersIcon />, value: 220, subtitle: 'Across all branches', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 2400, subtitle: 'Monthly workload', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 3600, subtitle: 'Great job team!', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 85, suffix: '%', subtitle: 'Completed vs assigned', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'Year': [
        { title: 'Active employees', icon: <UsersIcon />, value: 220, subtitle: 'Across all branches', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 29200, subtitle: 'Yearly workload', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 43800, subtitle: 'Great job team!', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 85, suffix: '%', subtitle: 'Completed vs assigned', bg: '#F0E9FF', color: '#7226FF' },
      ]
    },
    'Main Branch': {
      'Today': [
        { title: 'Active employees', icon: <UsersIcon />, value: 60, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 22, subtitle: 'Real‑time tasks', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 36, subtitle: 'Well done team', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 81, suffix: '%', subtitle: 'Main branch progress', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'This Week': [
        { title: 'Active employees', icon: <UsersIcon />, value: 60, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 154, subtitle: 'Weekly tasks', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 252, subtitle: 'Well done team', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 81, suffix: '%', subtitle: 'Main branch progress', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'Month': [
        { title: 'Active employees', icon: <UsersIcon />, value: 60, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 660, subtitle: 'Monthly tasks', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 1080, subtitle: 'Well done team', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 81, suffix: '%', subtitle: 'Main branch progress', bg: '#F0E9FF', color: '#7226FF' },
      ],
      'Year': [
        { title: 'Active employees', icon: <UsersIcon />, value: 60, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Active tasks in progress', icon: <ClipboardDocumentListIcon />, value: 8030, subtitle: 'Yearly tasks', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Tasks completed', icon: <CheckCircleIcon />, value: 13140, subtitle: 'Well done team', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Productivity', icon: <ChartBarIcon />, value: 81, suffix: '%', subtitle: 'Main branch progress', bg: '#F0E9FF', color: '#7226FF' },
      ]
    }
  },
  service: {
    'All Branches': {
      'Today': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 45, subtitle: 'Created', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 38, subtitle: 'Team response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 7, subtitle: 'Need attention', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 92, suffix: '%', subtitle: 'Happy clients', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'This Week': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 315, subtitle: 'Created', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 266, subtitle: 'Team response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 49, subtitle: 'Need attention', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 92, suffix: '%', subtitle: 'Happy clients', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Month': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 1350, subtitle: 'Created', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 1140, subtitle: 'Team response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 210, subtitle: 'Need attention', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 92, suffix: '%', subtitle: 'Happy clients', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Year': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 16425, subtitle: 'Created', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 13870, subtitle: 'Team response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 2555, subtitle: 'Need attention', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 92, suffix: '%', subtitle: 'Happy clients', bg: '#ECE8FC', color: '#450CD5' },
      ]
    },
    'Main Branch': {
      'Today': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 12, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 9, subtitle: 'Quick response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 1, subtitle: 'Needs review', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 89, suffix: '%', subtitle: 'Feedback collected', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'This Week': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 84, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 63, subtitle: 'Quick response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 7, subtitle: 'Needs review', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 89, suffix: '%', subtitle: 'Feedback collected', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Month': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 360, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 270, subtitle: 'Quick response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 30, subtitle: 'Needs review', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 89, suffix: '%', subtitle: 'Feedback collected', bg: '#ECE8FC', color: '#450CD5' },
      ],
      'Year': [
        { title: 'New service requests', icon: <ClipboardDocumentListIcon />, value: 4380, subtitle: 'Main branch only', bg: '#E5F4FF', color: '#0077C8' },
        { title: 'Resolved', icon: <CheckCircleIcon />, value: 3285, subtitle: 'Quick response', bg: '#EDF7ED', color: '#2E7D32' },
        { title: 'Escalated issues', icon: <ExclamationCircleIcon />, value: 365, subtitle: 'Needs review', bg: '#FFF5E5', color: '#FF9800' },
        { title: 'Customer satisfaction', icon: <FaceSmileIcon />, value: 89, suffix: '%', subtitle: 'Feedback collected', bg: '#ECE8FC', color: '#450CD5' },
      ]
    }
  }
};

// Helper function to format dates
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Calendar component
const CalendarDropdown = ({ selectedDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const calendarRef = useRef(null);
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Generate days array
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="OOcalendar-dropdown" ref={calendarRef}>
      <div className="OOcalendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h4>
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </h4>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className="OOcalendar-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
          <div key={i} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="OOcalendar-days">
        {/* Empty cells for days before the first day of the month */}
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}
        
        {/* Days of the month */}
        {days.map(day => {
          const isSelected = day === selectedDate.getDate() && 
                             currentMonth === selectedDate.getMonth() &&
                             currentYear === selectedDate.getFullYear();
          const isToday = day === new Date().getDate() && 
                          currentMonth === new Date().getMonth() &&
                          currentYear === new Date().getFullYear();
          
          return (
            <div 
              key={day} 
              className={`OOcalendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => {
                const newDate = new Date(currentYear, currentMonth, day);
                onSelect(newDate);
                onClose();
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Chart data for each section using the new color scheme
const getChartData = (tab, branchView, period) => {
  // Color definitions
  const PRIMARY_COLOR = '#7226FF';
  const SECONDARY_COLOR = '#450CD5';
  const ACCENT_COLOR = '#F042FF';
  const BG_OPACITY = 0.2;

  // Period factor for scaling data
  const periodFactor = {
    'Today': 1,
    'This Week': 7,
    'Month': 30,
    'Year': 365
  }[period] || 1;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
      }
    },
  };

  // Adjust data based on period
  const adjustData = (data) => {
    return data.map(value => Math.round(value * periodFactor));
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  switch (tab) {
    case 'operations':
      return {
        lineChart: {
          data: {
            labels: days,
            datasets: [
              {
                label: 'Tasks Created',
                data: adjustData(branchView === 'All Branches' 
                  ? [20, 25, 18, 22, 28, 15, 12] 
                  : [6, 8, 5, 7, 9, 4, 3]),
                borderColor: PRIMARY_COLOR,
                backgroundColor: `rgba(114, 38, 255, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Tasks Completed',
                data: adjustData(branchView === 'All Branches' 
                  ? [18, 22, 15, 20, 25, 10, 10] 
                  : [5, 7, 5, 7, 9, 3, 3]),
                borderColor: SECONDARY_COLOR,
                backgroundColor: `rgba(69, 12, 213, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Task Progress Over Time Chart',
                font: { size: 13 },
                color: '#666084',
              }
            }
          }
        },
        barChart: {
          data: {
            labels: ['Completed', 'Pending', 'Overdue'],
            datasets: [
              {
                label: 'Tasks',
                data: adjustData(branchView === 'All Branches' 
                  ? [120, 36, 12] 
                  : [42, 12, 4]),
                backgroundColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR
                ],
                borderColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Task Distribution Chart',
                font: { size: 13 },
                color: '#666084',
              }
            }
          }
        }
      };
    case 'finance':
      return {
        lineChart: {
          data: {
            labels: days,
            datasets: [
              {
                label: 'Income (£)',
                data: adjustData(branchView === 'All Branches' 
                  ? [1800, 2100, 1950, 2400, 2200, 2000, 2100] 
                  : [600, 700, 650, 800, 750, 700, 700]),
                borderColor: PRIMARY_COLOR,
                backgroundColor: `rgba(114, 38, 255, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Expenses (£)',
                data: adjustData(branchView === 'All Branches' 
                  ? [1200, 1300, 1100, 1400, 1250, 1000, 1150] 
                  : [400, 450, 380, 500, 420, 350, 400]),
                borderColor: ACCENT_COLOR,
                backgroundColor: `rgba(240, 66, 255, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Income vs Expenses',
                font: { size: 16 }
              }
            }
          }
        },
        barChart: {
          data: {
            labels: days,
            datasets: [
              {
                label: 'Net Profit (£)',
                data: adjustData(branchView === 'All Branches' 
                  ? [600, 800, 850, 1000, 950, 1000, 950] 
                  : [200, 250, 270, 300, 330, 350, 300]),
                backgroundColor: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                borderWidth: 1
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Daily Profit',
                font: { size: 16 }
              }
            }
          }
        }
      };
    case 'workforce':
      return {
        lineChart: {
          data: {
            labels: days,
            datasets: [
              {
                label: 'Active Employees',
                data: branchView === 'All Branches' 
                  ? [210, 215, 220, 218, 220, 205, 200] 
                  : [58, 59, 60, 60, 60, 55, 52],
                borderColor: PRIMARY_COLOR,
                backgroundColor: `rgba(114, 38, 255, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Tasks Completed',
                data: adjustData(branchView === 'All Branches' 
                  ? [15, 18, 20, 22, 25, 10, 10] 
                  : [4, 5, 6, 7, 8, 3, 3]),
                borderColor: SECONDARY_COLOR,
                backgroundColor: `rgba(69, 12, 213, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Employee Activity',
                font: { size: 16 }
              }
            }
          }
        },
        pieChart: {
          data: {
            labels: ['Productive', 'Moderate', 'Low'],
            datasets: [
              {
                data: branchView === 'All Branches' ? [65, 20, 15] : [60, 25, 15],
                backgroundColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR
                ],
                borderColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            ...pieOptions,
            plugins: {
              ...pieOptions.plugins,
              title: {
                display: true,
                text: 'Productivity Distribution',
                font: { size: 16 }
              }
            }
          }
        }
      };
    case 'service':
      return {
        lineChart: {
          data: {
            labels: days,
            datasets: [
              {
                label: 'Service Requests',
                data: adjustData(branchView === 'All Branches' 
                  ? [6, 8, 7, 9, 6, 5, 4] 
                  : [2, 3, 2, 2, 1, 1, 1]),
                borderColor: PRIMARY_COLOR,
                backgroundColor: `rgba(114, 38, 255, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Resolved',
                data: adjustData(branchView === 'All Branches' 
                  ? [5, 7, 6, 8, 5, 4, 3] 
                  : [1, 2, 2, 2, 1, 1, 0]),
                borderColor: SECONDARY_COLOR,
                backgroundColor: `rgba(69, 12, 213, ${BG_OPACITY})`,
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Service Requests & Resolution',
                font: { size: 16 }
              }
            }
          }
        },
        barChart: {
          data: {
            labels: ['New', 'In Progress', 'Resolved', 'Escalated'],
            datasets: [
              {
                label: 'Requests',
                data: adjustData(branchView === 'All Branches' 
                  ? [45, 30, 38, 7] 
                  : [12, 8, 9, 1]),
                backgroundColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR,
                  '#FF9800'
                ],
                borderColor: [
                  PRIMARY_COLOR,
                  ACCENT_COLOR,
                  SECONDARY_COLOR,
                  '#FF9800'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Service Request Status',
                font: { size: 16 }
              }
            }
          }
        }
      };
    default:
      return {
        lineChart: { data: {}, options: {} },
        barChart: { data: {}, options: {} },
        pieChart: { data: {}, options: {} }
      };
  }
};

// ───────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────
const Home = () => {
  const [activeTab, setActiveTab] = useState('operations');
  const [branchView, setBranchView] = useState('All Branches');
  const [activePeriod, setActivePeriod] = useState('Today');
  const [selectedMonth, setSelectedMonth] = useState('Month');
  const [selectedYear, setSelectedYear] = useState('Year');
  const [periodText, setPeriodText] = useState('Today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const tabTitles = {
    operations: 'Operation Statistics',
    finance: 'Finance Statistics',
    workforce: 'Workforce Activity Statistics',
    service: 'Service/Request Statistics',
  };

  // Get current period type
  const getCurrentPeriodType = () => {
    if (activePeriod === 'Today' || activePeriod === 'This Week') {
      return activePeriod;
    } else if (selectedMonth !== 'Month') {
      return 'Month';
    } else if (selectedYear !== 'Year') {
      return 'Year';
    }
    return 'Today'; // default
  };

  const currentPeriod = getCurrentPeriodType();

  // Get chart data for current tab, branch view and period
  const chartData = getChartData(activeTab, branchView, currentPeriod);

  // Handle period tab selection
  const handlePeriodSelect = (period) => {
    setActivePeriod(period);
    setPeriodText(period);
    // Reset dropdowns when a tab is selected
    setSelectedMonth('Month');
    setSelectedYear('Year');
    setShowCalendar(false);
  };

  // Handle calendar selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setPeriodText(formatDate(date));
    setActivePeriod('Today');
    setShowCalendar(false);
  };

  // Handle month selection
  const handleMonthSelect = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    setActivePeriod(null);
    setPeriodText(`Month: ${month}`);
    setShowCalendar(false);
  };

  // Handle year selection
  const handleYearSelect = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setActivePeriod(null);
    setPeriodText(`Year: ${year}`);
    setShowCalendar(false);
  };

  return (
    <div className='MM-Dash-HOoma'>
      {/* Header */}
      <div className='Toop-DDag-SEc'>
        <div className='Toop-DDag-1'>
          <h3>Manalius King <span>Admin</span></h3>
        </div>
        <div className='Toop-DDag-2'>
          <div className='Toop-DDag-2-Main'>
            <h4>Proliance LTD</h4>
            <p>Central Hub</p>
          </div>
        </div>
      </div>

      {/* Summary cards always show All Branches */}
      <div className='Synnc-Cards'>
        <a href='#' className='Synnc-Card Simp-Boxshadow'>
          <h4>Active Branches <span>All Branches</span></h4>
          <h3><span>20/<b>200</b></span> <span className='ppeSC-Count'>10%</span></h3>
        </a>
        <a href='#' className='Synnc-Card Simp-Boxshadow'>
          <h4>Total Employees <span>All Branches</span></h4>
          <h3><span>300</span></h3>
        </a>
        <a href='#' className='Synnc-Card Simp-Boxshadow'>
          <h4>Active Employees <span>All Branches</span></h4>
          <h3><span>220/<b>300</b></span> <span className='ppeSC-Count'>85%</span></h3>
        </a>
        <a href='#' className='Synnc-Card Simp-Boxshadow'>
          <h4>Customer Count <span>All Branches</span></h4>
          <h3><span>20K+</span></h3>
        </a>
      </div>

      {/* Statistics Section */}
      <div className='GHGb-MMIn-DDahs-Sec Simp-Boxshadow'>
        <div className='GHGb-MMIn-DDahs-Top'>
          <div className='olikk-IOkiks'>
            <h3>{tabTitles[activeTab]}</h3>
            <p>{periodText}</p>
          </div>
          <ul className='period-controls'>
            <li 
              className={activePeriod === 'Today' ? 'active-GGTba-LI' : ''}
              onClick={() => handlePeriodSelect('Today')}
            >
              Today
            </li>
            <li 
              className={activePeriod === 'This Week' ? 'active-GGTba-LI' : ''}
              onClick={() => handlePeriodSelect('This Week')}
            >
              This Week
            </li>
            <li 
              className={activePeriod === 'Calendar' ? 'active-GGTba-LI' : ''}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarDaysIcon /> Calendar
            </li>
            <select value={selectedMonth} onChange={handleMonthSelect}>
              <option value='Month'>Month</option>
              <option value='January'>January</option>
              <option value='February'>February</option>
              <option value='March'>March</option>
              <option value='April'>April</option>
              <option value='May'>May</option>
              <option value='June'>June</option>
              <option value='July'>July</option>
              <option value='August'>August</option>
              <option value='September'>September</option>
              <option value='October'>October</option>
              <option value='November'>November</option>
              <option value='December'>December</option>
            </select>
            <select value={selectedYear} onChange={handleYearSelect}>
              <option value='Year'>Year</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
              <option value='2027'>2027</option>
              <option value='2028'>2028</option>
              <option value='2029'>2029</option>
              <option value='2030'>2030</option>
            </select>
          </ul>
        </div>

        {/* Calendar dropdown */}
        {showCalendar && (
          <div className='OOcalendar-container'>
            <CalendarDropdown 
              selectedDate={selectedDate} 
              onSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        )}

        {/* Cards */}
        <div className='ooilaui-Cards'>
          {cardsData[activeTab][branchView][currentPeriod].map((card, index) => (
            <Link
              key={index}
              to={`/company/${card.title.toLowerCase().replace(/\s+/g, '-')}`}
              className='ooilaui-Card'
            >
              <h4>
                {card.title}
                <span style={{ backgroundColor: card.bg, color: card.color }}>
                  {card.icon}
                </span>
              </h4>
              <AnimatedCounter
                value={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
              />
              <p><ArrowUpIcon /> {card.subtitle}</p>
            </Link>
          ))}
        </div>

        <div className='GHGb-MMIn-DDahs-Top Subb-Oa'>
          <ul>
            <li className={activeTab === 'operations' ? 'active-MMinLi' : ''} onClick={() => setActiveTab('operations')}>
              <WrenchScrewdriverIcon /> Operations
            </li>
            <li className={activeTab === 'finance' ? 'active-MMinLi' : ''} onClick={() => setActiveTab('finance')}>
              <CreditCardIcon /> Finance
            </li>
            <li className={activeTab === 'workforce' ? 'active-MMinLi' : ''} onClick={() => setActiveTab('workforce')}>
              <UsersIcon /> Workforce Activity
            </li>
            <li className={activeTab === 'service' ? 'active-MMinLi' : ''} onClick={() => setActiveTab('service')}>
              <ClipboardDocumentListIcon /> Service/Request
            </li>
          </ul>

          <div className='olikk-IOkiks olkk-Hnn'>
            <h3>{branchView}</h3>
            <select
              value={branchView}
              onChange={e => setBranchView(e.target.value)}
              className='BranchSelectDropdown'
            >
              <option value='All Branches'>All Branches</option>
              <option value='Main Branch'>Main Branch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='GGTh-Grppak-Sec Simp-Boxshadow'>
        <div className='GGTh-Grppak GGTh-Grppak-1'>
          <div className='GGTh-Grppak-header'>
            <h3>
              {activeTab === 'workforce' ? 'Activity Trend' : 
               activeTab === 'operations' ? 'Task Progress' : 
               activeTab === 'finance' ? 'Financial Trend' : 
               'Service Requests'}
            </h3>
          <p>{periodText}</p>
          </div>
          <div className='chart-container' style={{ height: '300px' }}>
            <Line data={chartData.lineChart.data} options={chartData.lineChart.options} />
          </div>
        </div>
        
        <div className='GGTh-Grppak GGTh-Grppak-2'>
          <div className='GGTh-Grppak-header'>
            <h3>
              {activeTab === 'workforce' ? 'Productivity Distribution' : 
               activeTab === 'operations' ? 'Task Distribution' : 
               activeTab === 'finance' ? 'Profit Analysis' : 
               'Request Status'}
            </h3>
            <p>{periodText}</p>
          </div>
          <div className='chart-container' style={{ height: '300px' }}>
            {activeTab === 'workforce' ? (
              <Pie data={chartData.pieChart.data} options={chartData.pieChart.options} />
            ) : (
              <Bar data={chartData.barChart.data} options={chartData.barChart.options} />
            )}
          </div>
        </div>
      </div>


      <div className='Attendd-Sec Simp-Boxshadow'>
         <div className='GHGb-MMIn-DDahs-Top'>
          <div className='olikk-IOkiks'>
            <h3>Attendance - Mon, Jul 7, 2025</h3>
          </div>
          <ul className='period-controls'>
            <li>
              <CalendarDaysIcon /> Calendar
            </li>
   
          </ul>
        </div>

            <div className="table-container">
                 <table className="Gen-Sys-table OIk-TTTatgs">
                  <thead>
                  <tr>
                    <th>S/N</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Clock In Time</th>
                    <th>Clock Out Time</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                   <tbody>
                    <tr>
                       <td>1</td>
                      <td>POL-00021</td>
                      <td>
                        <div className='Proliks-Seec'>
                          <div className='Proliks-1'>
                            <span>
                              <img src={DefaulUser} />
                            </span>
                          </div>
                          <div className='Proliks-2'>
                            <div>
                              <h4>Ndubuisi Prince Godson</h4>
                              <span>Active</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>Staff</td>
                      <td>IT Department</td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>7:30 AM</p>
                          <span className='early-entry'>Early Entry</span>
                        </div>
                      </td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>5:45 PM</p>
                          <span className='late-exit'>Late Exit</span>
                        </div>
                      </td>
                      <td className='remack-SmmmnRy'>
                        <span>Clocked in <b>early</b> and clocked out <b>late</b></span>
                      </td>
                      <td>
                       <button
                        aria-label="More options"
                        title="More options"
                        className="mmmo-BBTH-Drop"
                      >
                        <EllipsisHorizontalIcon />
                      </button>

                      </td>
                    </tr>
                     <tr>
                       <td>2</td>
                      <td>POL-00021</td>
                      <td>
                        <div className='Proliks-Seec'>
                          <div className='Proliks-1'>
                            <span>
                              <img src={MembImg1} />
                            </span>
                          </div>
                          <div className='Proliks-2'>
                            <div>
                              <h4>Mary Danis</h4>
                              <span>Active</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>Staff</td>
                      <td>Mrketing</td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>7:30 AM</p>
                          <span className='late-entry'>Late Entry</span>
                        </div>
                      </td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>5:45 PM</p>
                          <span className='early-exit'>Early Exit</span>
                        </div>
                      </td>
                      <td className='remack-SmmmnRy'>
                        <span>Clocked in <b>late</b> and clocked out <b>early</b></span>
                      </td>
                      <td>
                       <button
                        aria-label="More options"
                        title="More options"
                        className="mmmo-BBTH-Drop"
                      >
                        <EllipsisHorizontalIcon />
                      </button>

                      </td>
                    </tr>
                       <tr>
                       <td>2</td>
                      <td>POL-00021</td>
                      <td>
                        <div className='Proliks-Seec'>
                          <div className='Proliks-1'>
                            <span>
                              <img src={MembImg2} />
                            </span>
                          </div>
                          <div className='Proliks-2'>
                            <div>
                              <h4>Promise Eze</h4>
                              <span>Active</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>Staff</td>
                      <td>HR</td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>7:30 AM</p>
                          <span className='late-entry'>Late Entry</span>
                        </div>
                      </td>
                      <td>
                        <div className='DDa-Statuss'>
                          <p>5:45 PM</p>
                          <span className='late-exit'>Late Exit</span>
                        </div>
                      </td>
                      <td className='remack-SmmmnRy'>
                        <span>Clocked in <b>late</b> and clocked out <b>late</b></span>
                      </td>
                      <td>
                       <button
                        aria-label="More options"
                        title="More options"
                        className="mmmo-BBTH-Drop"
                      >
                        <EllipsisHorizontalIcon />
                      </button>

                      </td>
                    </tr>
                   </tbody>
                 </table>
            </div>
      </div>

    </div>
  );
};

export default Home;