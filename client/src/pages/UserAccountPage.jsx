// import React from 'react'

import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import useUserStore from "../store";


export default function UserAccountPage() {
  // const {user} = useContext(UserContext);
  const user = useUserStore((state) => state.user)

  if(!user){
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      Account page for {user.name}
    </div>
  );
}
