"use client"
import CameraComponent from "@/components/CameraComponent";
import { useState } from "react";

export default function Store() {
    const [selectedUserId, setSelectedUserId] = useState("");

  return (
    <div className="h-screen w-full flex-col flex justify-center items-center font-mono">
      <p>Loja</p>
      <CameraComponent setSelectedUserId={setSelectedUserId } />
    </div>
  );
}
