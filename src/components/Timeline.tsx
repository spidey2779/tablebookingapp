// /src/components/Timeline.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Booking } from '@/types/booking';

interface TimelineProps {
  date: string;
}

const Timeline: React.FC<TimelineProps> = ({ date }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await api.getBookingsByDate(date);
      setBookings(data);
    };
    fetchBookings();
  }, [date]);

  return (
    <div className="timeline">
      {bookings.length ? (
        bookings.map((booking, index) => (
          <div key={index} className="booking">
            {`Table ${booking.tableId}: ${booking.startTime} - ${booking.endTime}`}
          </div>
        ))
      ) : (
        <p>No bookings for this date.</p>
      )}
    </div>
  );
};

export default Timeline;
