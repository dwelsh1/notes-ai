import React from 'react';
import {
  Settings,
  Square,
  Languages,
  CheckCircle,
  FileText,
  Lightbulb,
  Home,
} from 'lucide-react';

interface HeaderProps {
  onTranslate: () => void;
  onCorrect: () => void;
  onSummarize: () => void;
  onDevelop: () => void;
  onClear: () => void;
  onStop: () => void;
  isGenerating: boolean;
  isFetching: boolean;
  currentProcess: 'translation' | 'correction' | 'summary' | 'develop' | null;
  breadcrumbs?: { id: string; label: string }[];
  onBreadcrumbClick?: (id: string) => void;
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTranslate,
  onCorrect,
  onSummarize,
  onDevelop,
  onClear,
  onStop,
  isGenerating,
  isFetching,
  currentProcess,
  breadcrumbs,
  onBreadcrumbClick,
  onHome,
}) => {
  // Mark unused props as used to satisfy linting without changing behavior
  void onClear;
  void currentProcess;
  return (
    <header
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 0,
          width: '100%',
        }}
      >
        {/* Left side - Logo and App Name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Blue P Icon - PagesAI Logo */}
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#2563eb',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}
            >
              N
            </span>
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              margin: 0,
              padding: 0,
            }}
          >
            NotesAI
          </h2>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              style={{ marginLeft: '12px', minWidth: 0, overflow: 'hidden' }}
            >
              {breadcrumbs.map((bc, idx) => (
                <span key={bc.id} style={{ whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() =>
                      onBreadcrumbClick && onBreadcrumbClick(bc.id)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                      margin: 0,
                    }}
                    title={`Go to ${bc.label}`}
                  >
                    {bc.label}
                  </button>
                  {idx < breadcrumbs.length - 1 && (
                    <span style={{ color: '#9ca3af', padding: '0 6px' }}>
                      ›
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {/* Left side ends here */}
        </div>

        {/* Right side - Home, AI Actions, Stop, Settings */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {/* Home */}
          <button
            onClick={onHome}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Home"
          >
            <Home style={{ width: '18px', height: '18px', color: '#6b7280' }} />
          </button>

          {/* Divider */}
          <div
            style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb' }}
          />

          {/* AI Action Icons moved to right side */}
          <button
            onClick={onTranslate}
            disabled={isGenerating || isFetching}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating || isFetching ? 'not-allowed' : 'pointer',
              opacity: isGenerating || isFetching ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              if (!isGenerating && !isFetching) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Translate the entire document in a new block note"
          >
            <Languages
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>

          <button
            onClick={onCorrect}
            disabled={isGenerating || isFetching}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating || isFetching ? 'not-allowed' : 'pointer',
              opacity: isGenerating || isFetching ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              if (!isGenerating && !isFetching) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Correct the entire document in a new block note"
          >
            <CheckCircle
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>

          <button
            onClick={onSummarize}
            disabled={isGenerating || isFetching}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating || isFetching ? 'not-allowed' : 'pointer',
              opacity: isGenerating || isFetching ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              if (!isGenerating && !isFetching) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Summarize the entire document"
          >
            <FileText
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>

          <button
            onClick={onDevelop}
            disabled={isGenerating || isFetching}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating || isFetching ? 'not-allowed' : 'pointer',
              opacity: isGenerating || isFetching ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              if (!isGenerating && !isFetching) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Generate text from bullet points"
          >
            <Lightbulb
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>

          {/* Stop */}
          <button
            onClick={onStop}
            disabled={!isGenerating}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: !isGenerating ? 'not-allowed' : 'pointer',
              opacity: !isGenerating ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              if (isGenerating) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Stop generation"
          >
            <Square
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>

          {/* Divider between Stop and Settings */}
          <div
            style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb' }}
          />

          <button
            onClick={() =>
              alert('Settings will be added here in future updates.')
            }
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Settings"
          >
            <Settings
              style={{ width: '18px', height: '18px', color: '#6b7280' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
