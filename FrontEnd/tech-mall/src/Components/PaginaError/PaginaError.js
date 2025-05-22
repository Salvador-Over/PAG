import React from 'react';
import './PaginaError.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">404</h1>
        <h2 className="error-subtitle">Page Not Found</h2>
        <p className="error-description">
          Sorry, the page you're looking for doesn't exist. You might have the wrong address or the page may have moved.
        </p>
        <a href="/" className="error-link">Go Back Home</a>
      </div>
      <div className="background-animation"></div>
    </div>
  );
};

export default ErrorPage;