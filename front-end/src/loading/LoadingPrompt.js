import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import "./LoadingPrompt.css";

export default function LoadingPrompt({ component = null, color = "primary" }) {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress ? (
    <div className={`loader text-${color}`}>Now Loading...</div>
  ) : (
    component
  );
}
