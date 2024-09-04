const bookingData = [
  {
    id: 1,
    roomId: "A101",
    startTime: "2024-09-02 13:00:00",
    endTime: "2024-09-03 14:00:00",
    title: "Lunch with Petr",
  },
  {
    id: 2,
    roomId: "A101",
    startTime: "2024-09-04 14:00:00",
    endTime: "2024-09-05 15:00:00",
    title: "Sales Weekly Meeting",
  },
  {
    id: 3,
    roomId: "A101",
    startTime: "2024-09-28 16:00:00",
    endTime: "2024-09-28 18:00:00",
    title: "Anastasia Website Warroom",
  },
  {
    id: 4,
    roomId: "A101",
    startTime: "2024-09-29 13:00:00",
    endTime: "2024-09-29 14:00:00",
    title: "One-on-One Session",
  },
  {
    id: 5,
    roomId: "A101",
    startTime: "2024-09-29 16:00:00",
    endTime: "2024-09-29 18:00:00",
    title: "UGC Sprint Planning",
  },
  {
    id: 6,
    roomId: "A102",
    startTime: "2024-09-30 09:00:00",
    endTime: "2024-10-04 18:00:00",
    title: "5-Day Design Sprint Workshop",
  },
  {
    id: 7,
    roomId: "Auditorium",
    startTime: "2024-09-07 09:00:00",
    endTime: "2024-09-08 19:00:00",
    title: "Thai Tech Innovation 2024",
  },
  {
    id: 8,
    roomId: "A101",
    startTime: "2024-09-12 10:00:00",
    endTime: "2024-09-13 13:00:00",
    title: "Raimonland project",
  },
  {
    id: 9,
    roomId: "A102",
    startTime: "2024-09-05 18:00:00",
    endTime: "2024-09-06 20:00:00",
    title: "Management Meeting",
  },
  {
    id: 10,
    roomId: "A101",
    startTime: "2024-10-04 14:00:00",
    endTime: "2024-10-06 11:00:00",
    title: "3-day workshop Corgi costume",
  },
];

const checkAvailability = (roomId, startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const isAvailable = bookingData.every((booking) => {
    if (booking.roomId !== roomId) return true;
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    return end <= bookingStart || start >= bookingEnd;
  });

  return isAvailable;
};

const getBookingsForWeek = (roomId, weekNo) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  let startRange, endRange;

  if (weekNo === "today") {
    startRange = new Date(today);
    endRange = new Date(today);
  } else if (weekNo === "this week") {
    startRange = startOfWeek;
    endRange = new Date(startOfWeek);
    endRange.setDate(endRange.getDate() + 6);
  } else if (weekNo === "next week") {
    startRange = new Date(startOfWeek);
    startRange.setDate(startRange.getDate() + 7);
    endRange = new Date(startRange);
    endRange.setDate(endRange.getDate() + 6);
  } else {
    return [];
  }

  const bookings = bookingData.filter((booking) => {
    if (booking.roomId !== roomId) return false;
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    return bookingStart <= endRange && bookingEnd >= startRange;
  });

  return bookings;
};

//Example checkAvailability
console.log(
  checkAvailability("A101", "2024-09-02 13:30:00", "2024-09-02 14:30:00")
);
console.log(
  checkAvailability("A101", "2024-09-28 12:30:00", "2024-09-28 13:30:00")
);
console.log(
  checkAvailability("A102", "2024-09-28 13:30:00", "2024-09-28 14:30:00")
);

//Example getBookingsForWeek
console.log(getBookingsForWeek("A101", "today"));
console.log(getBookingsForWeek("A101", "this week"));
console.log(getBookingsForWeek("A101", "next week"));
