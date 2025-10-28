import React from 'react';
import {
  Settings,
  Square,
  Languages,
  CheckCircle,
  FileText,
  Lightbulb,
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
}) => {
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
            <nav style={{ marginLeft: '12px', minWidth: 0, overflow: 'hidden' }}>
              {breadcrumbs.map((bc, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={bc.id} style={{ whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => onBreadcrumbClick && onBreadcrumbClick(bc.id)}
                      disabled={isLast}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isLast ? '#111827' : '#2563eb',
                        fontWeight: isLast ? 600 : 500,
                        cursor: isLast ? 'default' : 'pointer',
                        padding: 0,
                        margin: 0,
                      }}
                      title={isLast ? undefined : `Go to ${bc.label}`}
                    >
                      {bc.label}
                    </button>
                    {!isLast && <span style={{ color: '#9ca3af', padding: '0 6px' }}>/</span>}
                  </span>
                );
              })}
            </nav>
          )}

          {/* AI Action Icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: 0,
            }}
          >
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
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
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
