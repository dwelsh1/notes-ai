import React from 'react';
import { BlockNoteSchema, defaultBlockSpecs, defaultProps } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

export const QuoteBlock = createReactBlockSpec(
  {
    type: 'blockquote' as const,
    propSchema: defaultProps,
    content: 'inline',
  },
  {
    render: ({ contentRef }) => (
      <blockquote
        style={{
          borderLeft: '4px solid #e5e7eb',
          margin: '12px 0',
          paddingLeft: '12px',
          color: '#374151',
        }}
      >
        <div ref={contentRef} />
      </blockquote>
    ),
    toExternalHTML: () => (
      <blockquote
        style={{
          borderLeft: '4px solid #e5e7eb',
          margin: '12px 0',
          paddingLeft: '12px',
          color: '#374151',
        }}
      />
    ),
  }
);

export const createSchemaWithQuote = () =>
  BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      blockquote: QuoteBlock,
    },
  });


