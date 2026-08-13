import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Original Monastery360 SVG Brand Icon
 * Combines Sikkimese monastic pagoda roof architecture with a 360° virtual heritage orbit ring.
 */
export function LogoIcon({ size = 32, className = '', style = {} }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`monastery360-icon ${className}`}
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="m360-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary-light, #A53A3A)" />
                    <stop offset="100%" stopColor="var(--color-primary, #8B2E2E)" />
                </linearGradient>
                <linearGradient id="m360-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-secondary, #B58B3A)" />
                    <stop offset="100%" stopColor="var(--dark-secondary, #C5A45A)" />
                </linearGradient>
            </defs>

            {/* 360° Outer Orbit Ring representing digital digitization & virtual connectivity */}
            <circle
                cx="20"
                cy="20"
                r="17.5"
                stroke="url(#m360-gold-grad)"
                strokeWidth="2"
                strokeDasharray="92 12"
                strokeDashoffset="12"
                strokeLinecap="round"
            />

            {/* Orbit Node points representing spatial precision */}
            <circle cx="37.5" cy="20" r="1.75" fill="var(--color-secondary, #B58B3A)" />
            <circle cx="20" cy="37.5" r="1.25" fill="var(--color-secondary, #B58B3A)" opacity="0.8" />

            {/* Monastery Finial Apex (Ganjira Spire) */}
            <path d="M20 5 L20 9.5" stroke="url(#m360-gold-grad)" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="20" cy="4.5" r="1.5" fill="url(#m360-gold-grad)" />

            {/* Upper Monastic Pagoda Roof */}
            <path
                d="M12 14.5 C14.5 13, 17.5 10.8, 20 10.8 C22.5 10.8, 25.5 13, 28 14.5 L28.8 15.3 C26.2 14.2, 22.5 13.2, 20 13.2 C17.5 13.2, 13.8 14.2, 11.2 15.3 Z"
                fill="url(#m360-primary-grad)"
            />

            {/* Lower Monastic Pagoda Roof Eaves */}
            <path
                d="M7 21 C10.5 19.2, 15.5 16.5, 20 16.5 C24.5 16.5, 29.5 19.2, 33 21 L34 22 C30 20.5, 25 19, 20 19 C15 19, 10 20.5, 6 22 Z"
                fill="url(#m360-primary-grad)"
            />

            {/* Monastic Pillars & Gate Base */}
            <path
                d="M13.5 21 V30.5 H26.5 V21"
                stroke="url(#m360-primary-grad)"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />

            {/* Sacred Arched Sanctuary Doorway */}
            <path
                d="M17 30.5 V25.5 C17 24, 23 24, 23 25.5 V30.5 Z"
                fill="url(#m360-gold-grad)"
            />
        </svg>
    );
}

/**
 * Full Monastery360 Brand Component (Icon + Wordmark)
 */
export default function Logo({
    size = 'md',
    showTagline = false,
    to = '/',
    className = '',
    style = {}
}) {
    const iconSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;
    const titleSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '1.75rem' : '1.3rem';

    const content = (
        <div
            className={`monastery360-logo-wrap ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                ...style
            }}
        >
            <LogoIcon size={iconSize} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: titleSize,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                    }}
                >
                    Monastery<span className="gradient-text">360</span>
                </span>
                {showTagline && (
                    <span
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.725rem',
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                            color: 'var(--text-muted)',
                            marginTop: '3px',
                        }}
                    >
                        Digital Heritage of Sikkim
                    </span>
                )}
            </div>
        </div>
    );

    if (to) {
        return (
            <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Monastery360 Home">
                {content}
            </Link>
        );
    }

    return content;
}
