import React, { useState, useEffect } from "react";
import axios from "axios";
import { Booking } from "@/types/booking";
import { toast } from "react-toastify";

const BookedTables = ({ url }: { url: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch bookings for a specific date
  const fetchBookingsByDate = async () => {
    if (date) {
      try {
        const res = await axios.get(
          `${url}/bookings/${date}`
        );
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings by date:", error);
      }
    }
  };

  // Fetch bookings for a specific user
  const fetchUserBookings = async () => {
    if (userId) {
      try {
        const res = await axios.get(
          `${url}/bookings/user/${userId}`
        );
        setUserBookings(res.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        toast.error("Failed to fetch user bookings.");
      }
    }
  };

  // Cancel a booking by its ID
  const cancelBooking = async (booking: Booking) => {
    try {
      await axios.post(
        `${url}/bookings/deletebooking`,
        booking
      );

      fetchUserBookings(); // Refresh the user's bookings list after cancellation
      toast.success("Booking successfully canceled!");
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  // UseEffect to fetch bookings when the date changes
  useEffect(() => {
    if (date) {
      fetchBookingsByDate();
    }
  }, [date]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Section 1: Check Bookings for a Specific Date */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">
          Bookings for a Specific Date
        </h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Select a date"
        />
        <button
          onClick={fetchBookingsByDate}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none mb-4"
        >
          Check Bookings
        </button>
        {date && bookings.length === 0 && (
          <p className="text-gray-500">No bookings for this date.</p>
        )}
        <ul>
          {bookings.map((booking) => (
            <li
              key={
                booking.userId +
                booking.tableId +
                booking.date +
                booking.startTime +
                booking.endTime
              }
              className="border-b py-2"
            >
              <p className="font-medium">
                Table {booking.tableId} is booked by {booking.userId} on{" "}
                {booking.date} from {booking.startTime} to {booking.endTime}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: Check and Cancel User Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Your Bookings</h3>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter your User ID"
        />
        <button
          onClick={fetchUserBookings}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none mb-4"
        >
          Check Your Bookings
        </button>
        {userId && userBookings.length === 0 && (
          <p className="text-gray-500">No bookings for this user.</p>
        )}
        <ul>
          {userBookings.map((booking) => (
            <li
              key={
                booking.userId +
                booking.tableId +
                booking.date +
                booking.startTime +
                booking.endTime
              }
              className="border-b py-2 flex justify-between items-center"
            >
              <p className="font-medium">
                Table {booking.tableId} is booked by you on {booking.date} from{" "}
                {booking.startTime} to {booking.endTime}
              </p>
              <button
                onClick={() => cancelBooking(booking)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookedTables;
