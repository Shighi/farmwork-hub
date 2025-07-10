import React, { useEffect, useState } from 'react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');

    // Delay loading until homepage finishes (simulate with timeout)
    const timer = setTimeout(() => {
      if (!consent) {
        setShowBanner(true);
      }
    }, 1000); // 1 second after load

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-lg rounded-t-md">
      <p className="text-sm mb-2 md:mb-0">
        We use cookies to enhance your experience. You can accept or decline the use of cookies.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded transition"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
