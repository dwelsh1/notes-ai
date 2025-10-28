import React from 'react';
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
} from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

export const DividerBlock = createReactBlockSpec(
  {
    type: 'divider' as const,
    propSchema: defaultProps,
    content: 'none',
  },
  {
    render: () => <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />,
    toExternalHTML: () => (
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
    ),
  }
);

export const createSchemaWithDivider = () =>
  BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      divider: DividerBlock,
    },
  });


