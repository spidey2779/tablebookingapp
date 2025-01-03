"use client";
import React, { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import BookedTables from "../components/BookedTables";
// import CalendarView from "../components/CalenderView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Page = () => {
  const [tables, setTables] = useState<{ tableId: string; capacity: number }[]>(
    []
  );
  // const url="http://localhost:4000/api"
  const url="https://tablebookingappbackend.onrender.com/api"

  const fetchTables = async () => {
    const res = await axios.get(`${url}/tables`);
    setTables(res.data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Restaurant Table Booking
      </h1>

      {/* Booking Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Book a Table</h2>
        <BookingForm tables={tables} url={url}/>
      </div>

      {/* Booked Tables Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Booked Tables</h2>
        <BookedTables url={url} />
      </div>

      {/* Calendar View Section */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Bookings Calendar</h2>
        <CalendarView />
      </div> */}

      <ToastContainer />
    </div>
  );
};

export default Page;
