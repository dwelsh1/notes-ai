import React from 'react';
import { render } from '@testing-library/react';

// Mock heavy editor deps before importing the module under test
jest.mock('@blocknote/core', () => ({
  BlockNoteSchema: { create: (cfg: unknown) => cfg },
  defaultBlockSpecs: { paragraph: {} },
  defaultProps: {},
}));

jest.mock('@blocknote/react', () => ({
  createReactBlockSpec: (def: any, impl: any) => ({ ...def, ...impl }),
}));

// Now import subject under test (after mocks)
import { DividerBlock, createSchemaWithDivider } from '../../blocks/DividerBlock';

describe('DividerBlock', () => {
  it('registers a divider block in the schema', () => {
    const schema: any = createSchemaWithDivider();
    expect(Object.keys(schema.blockSpecs)).toContain('divider');
    expect(schema.blockSpecs.divider.type).toBe('divider');
  });

  it('render() outputs an hr with expected styles', () => {
    const el = (DividerBlock as any).render();
    const { container } = render(<>{el}</>);
    const hr = container.querySelector('hr');
    expect(hr).toBeTruthy();
    expect(hr).toHaveStyle({
      borderTop: '1px solid #e5e7eb',
      margin: '12px 0',
    });
  });

  it('toExternalHTML() outputs an hr element', () => {
    const el = (DividerBlock as any).toExternalHTML();
    const { container } = render(<>{el}</>);
    const hr = container.querySelector('hr');
    expect(hr).toBeTruthy();
  });
});
