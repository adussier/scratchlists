import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function Logout(props) {
    useEffect(() => props.unsetUser());
    return <Redirect to="/" />
}