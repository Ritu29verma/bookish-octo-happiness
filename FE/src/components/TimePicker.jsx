import React, { useState, useEffect } from 'react';

const TimePicker = ({ setAppointmentTime, resetTime }) => {
  const [hours, setHours] = useState('--');
  const [minutes, setMinutes] = useState('--');
  const [period, setPeriod] = useState('--');

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteOptions = ['00', '15', '30', '45'];
  const periodOptions = ['AM', 'PM'];

  
  useEffect(() => {
    if (resetTime) {
      setHours('--');
      setMinutes('--');
      setPeriod('--');
    }
  }, [resetTime]);

  const handleTimeChange = () => {
    if (hours !== '--' && minutes !== '--' && period !== '--') {
      // Convert to 24-hour format and pass the time back to parent
      let hour24 = parseInt(hours, 10);
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      const formattedTime24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
      setAppointmentTime(formattedTime24); // Pass 24-hour time to parent
    }
  };

  useEffect(() => {
    // Trigger handleTimeChange when all time fields are selected
    handleTimeChange();
  }, [hours, minutes, period]);
  

  return (
    <div className="flex flex-col items-center justify-center bg-cream">
      <div className="bg-coffee text-cream p-6 rounded-lg shadow-lg w-72 sm:w-96">
        <div className="flex justify-between items-center space-x-4">
          {/* Hour Dropdown */}
          <div className="flex flex-col items-center">
            <label htmlFor="hours" className="mb-2">Hours</label>
            <select
              id="hours"
              value={hours}
              onChange={(e) => { setHours(e.target.value); handleTimeChange(); }}
              className="p-2 bg-cream text-coffee rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
            >
              <option value="--">--</option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>

          {/* Minute Dropdown */}
          <div className="flex flex-col items-center">
            <label htmlFor="minutes" className="mb-2">Minutes</label>
            <select
              id="minutes"
              value={minutes}
              onChange={(e) => { setMinutes(e.target.value); handleTimeChange(); }}
              className="p-2 bg-cream text-coffee rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
            >
              <option value="--">--</option>
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>

          {/* Period Dropdown */}
          <div className="flex flex-col items-center">
            <label htmlFor="period" className="mb-2">AM/PM</label>
            <select
              id="period"
              value={period}
              onChange={(e) => { setPeriod(e.target.value); handleTimeChange(); }}
              className="p-2 bg-cream text-coffee rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
            >
              <option value="">--</option>
              {periodOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden text-center mt-8">
          <p className="text-lg">
            Selected Time: {hours && minutes && period ? `${hours}:${minutes} ${period}` : '--'}
          </p>
          <p className="hidden text-lg mt-2">
            24-Hour Time: {hours !== '--' && minutes !== '--' && period !== '--' ? `${(parseInt(hours, 10) + (period === 'PM' && parseInt(hours, 10) !== 12 ? 12 : 0) - (period === 'AM' && parseInt(hours, 10) === 12 ? 12 : 0)).toString().padStart(2, '0')}:${minutes}` : '--'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
