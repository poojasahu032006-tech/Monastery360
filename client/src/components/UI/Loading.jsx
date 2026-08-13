import React from 'react';
import './Loading.css';

export default function Loading({ fullScreen = false, text = 'Loading...' }) {
    if (fullScreen) {
        return (
            <div className="loading-fullscreen" aria-label="Loading" role="status">
                <div className="loading-content">
                    <div className="loading-spinner" />
                    <p className="loading-text">{text}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="loading-inline" aria-label="Loading" role="status">
            <div className="loading-spinner loading-spinner--sm" />
        </div>
    );
}
