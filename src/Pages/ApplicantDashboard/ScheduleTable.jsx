import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ScheduleTable.css';

const getTopOffset = (startHour) => {
  const slotHeight = 60;
  return (startHour - 6) * slotHeight;
};

const getCurrentTimeInfo = () => {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { hours, timeString };
};

// Helper to parse time string (e.g., "10:30 AM" or "10:30 am") to hours
const parseTimeToHours = (timeString) => {
  try {
    const cleanedTimeString = timeString.trim().replace(/\s+/g, ' ');
    const [time, period] = cleanedTimeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const normalizedPeriod = period.toUpperCase(); // Normalize to uppercase
    if (isNaN(hours) || isNaN(minutes) || !['AM', 'PM'].includes(normalizedPeriod)) {
      throw new Error('Invalid time format');
    }
    let hours24 = hours;
    if (normalizedPeriod === 'PM' && hours !== 12) hours24 += 12;
    if (normalizedPeriod === 'AM' && hours === 12) hours24 = 0;
    return hours24 + (minutes || 0) / 60;
  } catch (error) {
    throw new Error('Invalid time format. Use HH:MM AM/PM');
  }
};

export default function DailySchedule() {
  // Initialize with 6:30 AM (6.5 hours in 24-hour format)
  const [currentTimeInfo, setCurrentTimeInfo] = useState({
    hours: 6.5,
    timeString: '6:30 AM',
  });
  const [appointments, setAppointments] = useState([
    {
      name: 'Virtual Interview',
      time: '6:30 AM',
      role: 'Zoom meeting',
      start: 6.5,
      duration: 1,
    },
  ]);
  const [timeInput, setTimeInput] = useState('6:30 AM');
  const [useCurrentTime, setUseCurrentTime] = useState(false); // Start with real-time updates off
  const slotHeight = 60;
  const startHour = 6;
  const endHour = 19;
  const hours = endHour - startHour + 1;

  useEffect(() => {
    let interval;
    if (useCurrentTime) {
      const updateTime = () => {
        const newTimeInfo = getCurrentTimeInfo();
        setCurrentTimeInfo(newTimeInfo);
        setAppointments([
          {
            name: 'James Williams',
            time: newTimeInfo.timeString,
            role: 'Kitchen Staff Local',
            start: newTimeInfo.hours,
            duration: 1,
          },
        ]);
        setTimeInput(newTimeInfo.timeString);
      };

      updateTime(); // Initial update
      interval = setInterval(updateTime, 1000); // Update every second
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [useCurrentTime]);

  // Handle UI input change
// Handle UI input change
const handleTimeChange = (e) => {
  const newTime = e.target.value;
  setTimeInput(newTime);
  try {
    const hours = parseTimeToHours(newTime);
    // Check if the time is within the valid range (6 AM to 7 PM)
    if (hours < 6 || hours > 19) {
      console.warn('Time is outside the schedule range (6 AM to 7 PM).');
      return; // Do not update if time is out of range
    }
    setUseCurrentTime(false); // Stop real-time updates
    setCurrentTimeInfo({ hours, timeString: newTime }); // Update current time line to input time
    setAppointments([
      {
        name: 'James Williams',
        time: newTime,
        role: 'Kitchen Staff Local',
        start: hours,
        duration: 1,
      },
    ]);
  } catch (error) {
    console.error(error.message);
  }
};
  return (
    <div className="schedule-container">
       <h2 className="schedule-header">
        June 26, Thursday <span className="year">2025</span>
      </h2>
      <div className="time-input-container">
        <input
          id="timeInput"
          type="text"
          value={timeInput}
          onChange={handleTimeChange}
          placeholder="e.g., 10:30 AM"
          className="time-input"
        />
      </div>
      <div className="schedule-body" style={{ height: `${hours * slotHeight}px` }}>
        {/* Time slots */}
        {Array.from({ length: hours }, (_, i) => {
          const hour = startHour + i;
          return (
            <div key={i} className="time-slot" style={{ top: `${i * slotHeight}px` }}>
              <div className="time-label">
                {hour === 0
                  ? '12am'
                  : hour < 12
                  ? `${hour}am`
                  : hour === 12
                  ? '12pm'
                  : `${hour - 12}pm`}
              </div>
              <div className="time-line" />
            </div>
          );
        })}

        {/* Current Time Line with Framer Motion */}
        <motion.div
          className="current-line"
          style={{ top: getTopOffset(currentTimeInfo.hours) }}
          animate={{ top: getTopOffset(currentTimeInfo.hours) }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <div className="dot" />
          {/* <div className="current-time-label">{currentTimeInfo.timeString}</div> */}
        </motion.div>

        {/* Appointments */}
        {appointments.map((appt, idx) => (
          <motion.div
            key={idx}
            className="appointment"
            style={{
              top: `${getTopOffset(appt.start)}px`,
              height: `${appt.duration * slotHeight}px`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, top: getTopOffset(appt.start) }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <h3 className='aaa-Heada'>{appt.name}</h3>
            <div className="details">
              {appt.time} · {appt.role}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}