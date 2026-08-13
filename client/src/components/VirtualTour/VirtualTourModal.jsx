import React, { useEffect, useRef } from 'react';

/**
 * Full‑screen 360° panorama viewer using Pannellum (CDN).
 * Loads the panorama image from the public folder via the supplied imageUrl.
 * Includes close button, fullscreen control and interactive mouse/touch controls.
 */
export default function VirtualTourModal({ imageUrl, title, onClose }) {
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
  };

  const contentStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: 'var(--bg-card)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-inverse)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 1,
  };

  const viewerRef = useRef(null);

  // Load Pannellum script & stylesheet from CDN if not already present
  useEffect(() => {
    const loadPannellum = () => {
      if (window.pannellum && viewerRef.current) {
        window.pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: imageUrl,
          autoLoad: true,
          showControls: true,
          showFullscreenCtrl: true,
          compass: true,
          canZoom: true,
          mouseZoom: true,
        });
      }
    };

    if (!window.pannellum) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = loadPannellum;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    } else {
      loadPannellum();
    }

    // Cleanup on unmount – remove generated viewer DOM
    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }
    };
  }, [imageUrl]);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
        {title && (
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>{title}</h2>
        )}
        {/* Viewer container – pannellum will inject a canvas here */}
        <div ref={viewerRef} style={{ width: '100%', height: 'calc(100% - 2rem)' }} />
      </div>
    </div>
  );
}
