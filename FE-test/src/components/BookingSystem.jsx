import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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
    startTime: "2024-09-12 16:00:00",
    endTime: "2024-09-13 18:00:00",
    title: "Anastasia Website Warroom",
  },
  {
    id: 4,
    roomId: "A101",
    startTime: "2024-09-16 13:00:00",
    endTime: "2024-09-17 14:00:00",
    title: "One-on-One Session",
  },
  {
    id: 5,
    roomId: "A101",
    startTime: "2024-09-25 16:00:00",
    endTime: "2024-09-25 18:00:00",
    title: "UGC Sprint Planning",
  },
  {
    id: 6,
    roomId: "A102",
    startTime: "2024-09-12 09:00:00",
    endTime: "2024-09-13 18:00:00",
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
    startTime: "2024-09-06 18:00:00",
    endTime: "2024-09-07 20:00:00",
    title: "Management Meeting",
  },
  {
    id: 10,
    roomId: "A102",
    startTime: "2024-09-14 14:00:00",
    endTime: "2024-09-15 11:00:00",
    title: "3-day workshop Corgi costume",
  },
];

const getBookings = (filter, roomId) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  let startRange, endRange;

  if (filter === "today") {
    startRange = new Date(today.setHours(0, 0, 0, 0));
    endRange = new Date(today.setHours(23, 59, 59, 999));
  } else if (filter === "thisweek") {
    startRange = startOfWeek;
    endRange = new Date(startOfWeek);
    endRange.setDate(endRange.getDate() + 6);
  } else if (filter === "nextweek") {
    startRange = new Date(startOfWeek);
    startRange.setDate(startRange.getDate() + 7);
    endRange = new Date(startRange);
    endRange.setDate(endRange.getDate() + 6);
  } else if (filter === "month") {
    startRange = new Date(today.getFullYear(), today.getMonth(), 1);
    endRange = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  const filteredBookings = bookingData.filter((booking) => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    return (
      bookingStart <= endRange &&
      bookingEnd >= startRange &&
      booking.roomId === roomId
    );
  });

  if (filter === "thisweek" || filter === "nextweek") {
    const bookingsByDay = {};
    const current = new Date(startRange);
    while (current <= endRange) {
      bookingsByDay[current.toDateString()] = filteredBookings.filter(
        (booking) => {
          const bookingStart = new Date(booking.startTime);
          return bookingStart.toDateString() === current.toDateString();
        }
      );
      current.setDate(current.getDate() + 1);
    }
    return Object.entries(bookingsByDay)
      .filter(([, bookings]) => bookings.length > 0)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .reduce((obj, [date, bookings]) => {
        obj[date] = bookings;
        return obj;
      }, {});
  }

  if (filter === "month") {
    const bookingsByDate = {};
    filteredBookings.forEach((booking) => {
      const bookingDate = new Date(booking.startTime).toDateString();
      if (!bookingsByDate[bookingDate]) {
        bookingsByDate[bookingDate] = [];
      }
      bookingsByDate[bookingDate].push(booking);
    });
    return Object.entries(bookingsByDate)
      .filter(([, bookings]) => bookings.length > 0)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .reduce((obj, [date, bookings]) => {
        obj[date] = bookings;
        return obj;
      }, {});
  }

  return filteredBookings;
};

const getUpcomingBooking = (bookings) => {
  const upcomingBooking = bookings
    .filter((booking) => new Date(booking.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];

  return upcomingBooking ? [upcomingBooking] : [];
};

// Filter This week, Next week, Whole month
const BookingSystem = () => {
  const { filter } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(
    new URLSearchParams(location.search).get("roomId")
  );
  const [selectedFilter, setSelectedFilter] = useState(filter || "thisweek");
  const [bookings, setBookings] = useState({});
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const filteredBookings = getBookings(selectedFilter, roomId);
    setBookings(filteredBookings);

    const allBookings = Object.values(filteredBookings).flat();
    setUpcomingBookings(getUpcomingBooking(allBookings));
  }, [selectedFilter, roomId]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    navigate(`/bookings/${filter}?roomId=${roomId}`);
  };

  const handleRoomIdChange = (newRoomId) => {
    setRoomId(newRoomId);
    navigate(`/bookings/${selectedFilter}?roomId=${newRoomId}`);
  }; //For change roomID and Update URL

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="w-1/3 bg-[#4A5A99] text-white flex flex-col justify-start pl-16">
        <div className="bg-[#2ebaee] text-4xl font-bold p-4 mb-6 pl-12 pt-12">
          {roomId}
        </div>
        <div className="text-white p-4 mt-6">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          {upcomingBookings.length > 0 ? (
            <div className="mt-4 pt-16">
              <p className="text-5xl font-light">
                <strong>{formatDate(upcomingBookings[0].startTime)}</strong>
              </p>
              <p className="pt-12 text-gray-300 text-sm">
                {new Date(upcomingBookings[0].startTime).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                )}{" "}
                -{" "}
                {new Date(upcomingBookings[0].endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="font-medium">{upcomingBookings[0].title}</p>
            </div>
          ) : (
            <p className="pt-16 mt-4 text-5xl font-light">
              No upcoming bookings
            </p>
          )}
        </div>
      </div>
      <div className="w-2/3 bg-white">
        <div className="flex space-x-8 text-gray-400 bg-gray-200 font-semibold pl-12 pt-16">
          <button
            className={`hover:text-black ${
              selectedFilter === "thisweek"
                ? "text-black border-[#4A5A99] border-b-4 pb-3"
                : "pb-4"
            }`}
            onClick={() => handleFilterChange("thisweek")}
          >
            THIS WEEK
          </button>
          <button
            className={`hover:text-black ${
              selectedFilter === "nextweek"
                ? "text-black border-[#4A5A99] border-b-4 pb-3"
                : "pb-4"
            }`}
            onClick={() => handleFilterChange("nextweek")}
          >
            NEXT WEEK
          </button>
          <button
            className={`hover:text-black ${
              selectedFilter === "month"
                ? "text-black border-[#4A5A99] border-b-4 pb-3"
                : "pb-4"
            }`}
            onClick={() => handleFilterChange("month")}
          >
            WHOLE MONTH
          </button>
        </div>
        <div className="mt-12">
          {Object.keys(bookings).map((date) => (
            <div key={date} className="mt-6">
              <h3 className="bg-gray-200 p-4 text-gray-800 font-semibold pl-12">
                {formatDate(date)}
              </h3>
              <ul className="space-y-4">
                {bookings[date].map((booking) => (
                  <li
                    key={booking.id}
                    className="flex items-center space-x-2 border-gray-200 text-gray-500 pl-12 pt-4"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <div className="flex flex-col pl-2">
                      <p className="text-sm">
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="font-medium text-black">{booking.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
