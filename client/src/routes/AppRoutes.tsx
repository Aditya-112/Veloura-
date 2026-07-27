import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Wardrobe from "../pages/Wardrobe";
import Upload from "../pages/Upload";
import NotFound from "../pages/NotFound";

const AppRoutes =() =>{
    return (
        <BrowserRouter>
        <Routes>
            {/*Public Routes */}
            <Route path="/login" element= {<Login/>} />
            <Route path="/Signup" element= {<Signup/>} />

            {/*Protected Routes */}
            <Route path="/" element= {<Dashboard/>} />
            <Route path="/Wardrobe" element= {<Wardrobe/>} />
            <Route path="/upload" element= {<Upload/>} />

            {/* 404*/}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;