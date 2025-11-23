import React from 'react';

const Spinner: React.FC = () => {
    const spinnerStyle = {
        border: '4px solid #f3f3f3', 
        borderTop: '4px solid #3498db', 
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 2s linear infinite',
    };

    const spinnerAnimation = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    return (
        <div>
            <div style={spinnerStyle}></div>
            <style>{spinnerAnimation}</style>
        </div>
    );
};

export default Spinner;
