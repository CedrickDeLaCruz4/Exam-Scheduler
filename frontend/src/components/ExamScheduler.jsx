import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExamScheduler = ({ person_id }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // For new slot input
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = () => {
    axios.get('http://localhost:3001/exam_slots')
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  };

  const handleBooking = () => {
    if (!selectedSlotId) return alert("Please select a time slot.");

    const selectedSlot = slots.find(slot => slot.schedule_id === selectedSlotId);
    if (selectedSlot.current_applicants >= 50) {
      return alert("This slot is already full. Please choose another one.");
    }

    axios.post('http://localhost:3001/book_exam', {
      person_id,
      schedule_id: selectedSlot.schedule_id
    })
    .then(res => {
      alert(res.data.message);
      fetchSlots();
      setSelectedSlotId(null);
    })
    .catch(err => alert(err.response?.data?.error || "Error booking slot"));
  };

  const handleAddSlot = () => {
    if (!newDate || !newStartTime || !newEndTime) return alert("Please fill all fields.");

    axios.post('http://localhost:3001/add_exam_slot', {
      exam_date: newDate,
      start_time: newStartTime,
      end_time: newEndTime
    })
    .then(res => {
      alert(res.data.message);
      fetchSlots();
      setNewDate('');
      setNewStartTime('');
      setNewEndTime('');
    })
    .catch(err => alert(err.response?.data?.error || "Error adding slot"));
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Schedule Your Exam</h2>

      {/* Existing Slots */}
      <ul className="mb-6 space-y-3 max-h-64 overflow-y-auto">
        {slots.length === 0 && (
          <li className="text-center text-gray-500">No exam slots available.</li>
        )}
        {slots.map(slot => {
          const isFull = slot.current_applicants >= 50;
          return (
            <li
              key={slot.schedule_id}
              className={`border rounded-lg p-3 flex items-center space-x-4 
                ${isFull ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
            >
              <input
                type="radio"
                name="slot"
                value={slot.schedule_id}
                disabled={isFull}
                checked={selectedSlotId === slot.schedule_id}
                onChange={() => setSelectedSlotId(slot.schedule_id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {slot.exam_date} &nbsp;|&nbsp; {slot.start_time} - {slot.end_time}
                </p>
                <p className="text-sm text-gray-600">
                  Assigned: {slot.current_applicants} / 50 | Remaining: {Math.max(0, 50 - slot.current_applicants)}
                </p>
                {isFull && <p className="text-xs text-red-600 mt-1 font-semibold">Slot Full</p>}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        onClick={handleBooking}
        disabled={!selectedSlotId}
        className={`w-full py-2 rounded-lg text-white font-semibold transition 
          ${selectedSlotId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
      >
        Confirm Slot
      </button>

      <hr className="my-8 border-gray-300" />

      {/* New Slot Form */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Exam Slot</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddSlot();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="exam-date">Date</label>
          <input
            id="exam-date"
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="start-time">Start Time</label>
          <input
            id="start-time"
            type="time"
            value={newStartTime}
            onChange={e => setNewStartTime(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="end-time">End Time</label>
          <input
            id="end-time"
            type="time"
            value={newEndTime}
            onChange={e => setNewEndTime(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default ExamScheduler;
