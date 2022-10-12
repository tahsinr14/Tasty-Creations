import React, { useState } from "react";

const LoginUser = ({ userName, password }) => {
  const [details, setDetails] = useState({ userName, password });

  // console.log(userName);
  //  console.log(password);

  return <p>${details}</p>;
};
export default LoginUser;
