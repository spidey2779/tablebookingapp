import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { format } from "date-fns";
import { Booking } from "@/types/booking";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface BookingWithId extends Booking {
  _id: string;
}

type EventType = { title: string; start: Date; end: Date; id: string };

const CalendarView = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayBookings, setDayBookings] = useState<BookingWithId[]>([]);

  // Fetch bookings for the calendar
  const fetchBookingsForCalendar = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`);
      const formattedEvents = res.data.map((booking: BookingWithId) => ({
        title: `Table ${booking.tableId} - ${booking.userId}`,
        start: new Date(`${booking.date}T${booking.startTime}`),
        end: new Date(`${booking.date}T${booking.endTime}`),
        id: booking._id,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch bookings for the timeline
  const fetchBookingsForTimeline = async (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${formattedDate}`
      );
      setDayBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings for timeline:", error);
    }
  };

  // Handle date selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchBookingsForTimeline(date);
  };

  // Handle calendar event click
  const handleEventClick = (event: EventType) => {
    alert(`Booking: ${event.title}`);
  };

  // Render timeline of bookings for the selected date
  const renderTimeline = () => {
    if (selectedDate && dayBookings.length > 0) {
      return (
        <div className="bg-white p-4 mt-4 rounded-md shadow-md">
          <h4 className="text-xl font-semibold text-gray-800">
            Bookings on {format(selectedDate, "yyyy-MM-dd")}
          </h4>
          <ul className="mt-2 space-y-2">
            {dayBookings.map((booking) => (
              <li
                key={booking._id}
                className="flex justify-between p-2 bg-gray-100 rounded-md shadow-sm"
              >
                <strong className="text-gray-700">
                  Table {booking.tableId}
                </strong>
                <span className="text-sm text-gray-600">
                  {booking.userId} from {booking.startTime} to {booking.endTime}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (selectedDate) {
      return <p className="mt-4 text-gray-600">No bookings for this day.</p>;
    }
    return null;
  };

  // Initial fetch of calendar bookings
  useEffect(() => {
    fetchBookingsForCalendar();
  }, []);

  return (
    <div className="calendar-view mx-auto my-8 p-4 max-w-4xl bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Bookings Calendar
      </h3>
      <div className="calendar-container bg-gray-50 p-4 rounded-lg">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={(slotInfo) => handleDateChange(slotInfo.start)}
          onSelectEvent={handleEventClick}
          selectable
          views={["month", "week", "day"]}
          className="border border-gray-300 rounded-md"
        />
      </div>
      {renderTimeline()}
    </div>
  );
};

export default CalendarView;
