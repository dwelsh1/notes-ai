import React from 'react';

interface FooterProps {
  progress: string;
  progressPercentage: number;
  output: string;
  error: string;
  errorBrowserMessage: string;
  runtimeStats: string;
  isFetching: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  progress,
  progressPercentage,
  output,
  error,
  errorBrowserMessage,
  runtimeStats,
  isFetching,
}) => {
  return (
    <footer
      style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '4px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        {/* Left side - Status messages */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Progress bar */}
          {isFetching && progressPercentage > 0 && (
            <div style={{ marginBottom: '2px' }}>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '2px',
                }}
              >
                <div
                  role="progressbar"
                  aria-valuenow={progressPercentage * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{
                    backgroundColor: '#2563eb',
                    height: '2px',
                    borderRadius: '9999px',
                    transition: 'all 0.3s',
                    width: `${progressPercentage * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Status messages */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {progress && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#4b5563',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {progress}
              </span>
            )}

            {output && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#2563eb',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {output}
              </span>
            )}

            {error && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#dc2626',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {error}
              </span>
            )}

            {errorBrowserMessage && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#dc2626',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {errorBrowserMessage} Please check{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API#browser_compatibility"
                  style={{ textDecoration: 'underline' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this page
                </a>{' '}
                to see browser compatibility.
              </span>
            )}
          </div>
        </div>

        {/* Right side - Performance stats */}
        {runtimeStats && (
          <div style={{ marginLeft: '8px', flexShrink: 0 }}>
            <p
              style={{
                fontSize: '11px',
                color: '#6b7280',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0,
              }}
            >
              Performance: {runtimeStats}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};
