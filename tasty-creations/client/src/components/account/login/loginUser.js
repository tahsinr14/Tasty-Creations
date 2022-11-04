import React, { useState } from "react";

const LoginUser = ({ userName, password }) => {
  const [details, setDetails] = useState({ userName, password });

  return <p>${details}</p>;
};
export default LoginUser;
