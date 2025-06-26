import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div 
        className={`loading-spinner ${sizeClasses[size]} mb-2`}
        style={{
          width: size === 'sm' ? '16px' : size === 'lg' ? '48px' : '32px',
          height: size === 'sm' ? '16px' : size === 'lg' ? '48px' : '32px'
        }}
      ></div>
      {text && <p className="text-muted mb-0">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;