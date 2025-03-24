import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";



function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<Navbar />} />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
