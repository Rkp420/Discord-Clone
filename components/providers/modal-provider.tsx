"use client";
import { useEffect, useState } from "react";
import { CreateServerModel } from "../modals/create-modal";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CreateServerModel />;
};
