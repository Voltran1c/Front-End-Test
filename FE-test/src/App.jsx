import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookingSystem from "./components/BookingSystem";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/bookings/:filter" element={<BookingSystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
