import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const BookingForm = ({
  tables,
  url,
}: {
  tables: { tableId: string; capacity: number }[];
  url: string;
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [numGuests, setNumGuests] = useState<number>(0);

  const handleBooking = async () => {
    if (
      !selectedTable ||
      !bookingDate ||
      !customerName ||
      !startTime ||
      !endTime ||
      !numGuests
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const selectedTableData = tables.find(
      (table) => table.tableId === selectedTable
    );

    if (!selectedTableData) {
      toast.error("Selected table not found!");
      return;
    }

    if (Number(numGuests) > selectedTableData.capacity) {
      toast.error("Number of guests exceeds table capacity!");
      return;
    }

    try {
      const response = await axios.post(`${url}/bookings`, {
        tableId: selectedTable,
        date: bookingDate,
        userId: customerName,
        startTime,
        endTime,
        guests: numGuests,
      });
      //   console.log(
      //     bookingDate,
      //     selectedTable,
      //     customerName,
      //     startTime,
      //     endTime,
      //     numGuests
      //   );
      if (!response.data) {
        toast.error("Booking Failed!");
        return;
      }
      setSelectedTable("");
      setBookingDate("");
      setCustomerName("");
      setStartTime("");
      setEndTime("");
      setNumGuests(0);
      toast.success("Booking Successful!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h3 className="text-2xl font-semibold text-center">Book a Table</h3>
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
      </div>
      <div>
        <select
          onChange={(e) => setSelectedTable(e.target.value)}
          value={selectedTable || ""}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        >
          <option value="">Select a Table</option>
          {tables.map((table) => (
            <option key={table.tableId} value={table.tableId}>
              Table {table.tableId} - Capacity {table.capacity}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Enter the guest count
        </label>
        <input
          type="number"
          value={numGuests}
          onChange={(e) => setNumGuests(Number(e.target.value))}
          placeholder="Number of Guests"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          min={0}
          step={1}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
      </div>
      <div>
        <button
          onClick={handleBooking}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
