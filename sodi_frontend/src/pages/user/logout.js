import React from "react";
import {Navigate} from "react-router-dom";

const Logout = React.memo(() => {
    localStorage.removeItem("accessToken");
    return <Navigate to={'/auth/login'} />;
});

export default Logout;
