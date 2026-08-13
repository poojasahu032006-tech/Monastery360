import React from 'react';
import './UI.css';

/* ── Button ──────────────────────────────────────────────────────────────── */
export function Button({
    children, variant = 'primary', size = 'md',
    loading = false, fullWidth = false,
    className = '', ...props
}) {
    return (
        <button
            className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
            {children}
        </button>
    );
}

/* ── Card ────────────────────────────────────────────────────────────────── */
export function Card({ children, className = '', hover = false, ...props }) {
    return (
        <div className={`card ${hover ? 'card--hover' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = 'default', className = '' }) {
    return (
        <span className={`badge badge--${variant} ${className}`}>
            {children}
        </span>
    );
}

/* ── Input ───────────────────────────────────────────────────────────────── */
export function Input({ label, error, id, className = '', ...props }) {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={id}>{label}</label>}
            <input
                id={id}
                className={`input-field ${error ? 'input-field--error' : ''}`}
                {...props}
            />
            {error && <p className="input-error" role="alert">{error}</p>}
        </div>
    );
}

/* ── Select ──────────────────────────────────────────────────────────────── */
export function Select({ label, error, id, children, className = '', ...props }) {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={id}>{label}</label>}
            <select id={id} className={`select-field ${error ? 'input-field--error' : ''}`} {...props}>
                {children}
            </select>
            {error && <p className="input-error" role="alert">{error}</p>}
        </div>
    );
}

/* ── SearchBar ───────────────────────────────────────────────────────────── */
export function SearchBar({ placeholder = 'Search...', onSearch, id = 'search-bar', ...props }) {
    return (
        <div className="search-bar">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
                id={id}
                type="search"
                className="search-input"
                placeholder={placeholder}
                onChange={(e) => onSearch?.(e.target.value)}
                {...props}
            />
        </div>
    );
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export function EmptyState({ icon = '🏯', title = 'Nothing here yet', message = '' }) {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">{icon}</span>
            <h3 className="empty-state-title">{title}</h3>
            {message && <p className="empty-state-message">{message}</p>}
        </div>
    );
}

/* ── ErrorState ──────────────────────────────────────────────────────────── */
export function ErrorState({ title = 'Something went wrong', message = '', onRetry }) {
    return (
        <div className="error-state">
            <span className="error-state-icon">⚠️</span>
            <h3 className="error-state-title">{title}</h3>
            {message && <p className="error-state-message">{message}</p>}
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} style={{ marginTop: '1rem' }}>
                    Try Again
                </Button>
            )}
        </div>
    );
}
