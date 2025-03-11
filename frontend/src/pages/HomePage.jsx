import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { authUser } = useAuthStore();
  return (
    <div>
      <h1>{authUser}</h1>
    </div>
  );
}

export default HomePage;
