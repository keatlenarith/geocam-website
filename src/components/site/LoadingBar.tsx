import React, { useEffect, useState } from "react";

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const handleStart = () => {
      setProgress(15);
      setLoading(true);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(timer);
            return 85;
          }
          return prev + Math.floor(Math.random() * 15 + 10);
        });
      }, 120);
    };

    const handleStop = () => {
      clearInterval(timer);
      setProgress(100);
      completeTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
    };

    const handlePopState = () => {
      handleStart();
      setTimeout(handleStop, 300);
    };

    window.addEventListener("geocam:route-loading-start", handleStart);
    window.addEventListener("geocam:route-loading-stop", handleStop);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
      window.removeEventListener("geocam:route-loading-start", handleStart);
      window.removeEventListener("geocam:route-loading-stop", handleStop);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading"
      className="fixed left-0 top-0 z-[9999] h-1 w-full overflow-hidden bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.7)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
