import { Source } from '@storybook/addon-docs';
import React from 'react';
import { SupportedLanguage } from 'storybook/internal/components';
/**
 * DocBlock components for use in Storybook documentation.
 * This file exports React components that can be imported and used
 * across various documentation files.
 */

/**
 * Props for the CodeBlock component
 */
interface CodeBlockProps {
  /**
   * The language for syntax highlighting
   */
  language?: SupportedLanguage;

  /**
   * The code to display
   */
  children: string;

  /**
   * Whether to show line numbers
   */
  showLineNumbers?: boolean;
}

/**
 * A component for displaying code with syntax highlighting
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'typescript', children, showLineNumbers = false }) => (
  <Source language={language} code={children} format={true} dark={true} />
);

/**
 * Props for a property in TypeTable
 */
interface TypeProperty {
  /**
   * Property name
   */
  name: string;

  /**
   * Property type
   */
  type: string;

  /**
   * Whether the property is required
   */
  required: boolean;

  /**
   * Property description
   */
  description: string;

  /**
   * Default value, if any
   */
  defaultValue?: string;
}

/**
 * Props for the TypeTable component
 */
interface TypeTableProps {
  /**
   * The name of the type being documented
   */
  type: string;

  /**
   * Properties of the type
   */
  properties: TypeProperty[];
}

/**
 * A component for displaying type definitions in a table format
 */
export const TypeTable: React.FC<TypeTableProps> = ({ type, properties }) => (
  <div>
    <h3>{type}</h3>
    <table className='docblock-argstable'>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
          {properties.some((p) => p.defaultValue !== undefined) && <th>Default</th>}
        </tr>
      </thead>
      <tbody>
        {properties.map((prop) => (
          <tr key={prop.name}>
            <td>
              <code>{prop.name}</code>
            </td>
            <td>
              <code>{prop.type}</code>
            </td>
            <td>{prop.required ? 'Yes' : 'No'}</td>
            <td>{prop.description}</td>
            {properties.some((p) => p.defaultValue !== undefined) && (
              <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : '-'}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Example code for a method
 */
interface MethodExample {
  /**
   * Example code
   */
  code: string;

  /**
   * Example description
   */
  description?: string;
}

/**
 * Props for the MethodSignature component
 */
interface MethodSignatureProps {
  /**
   * Method name
   */
  name: string;

  /**
   * Method signature
   */
  signature: string;

  /**
   * Method description
   */
  description: string;

  /**
   * Method examples
   */
  examples?: MethodExample[];
}

/**
 * A component for displaying method signatures
 */
export const MethodSignature: React.FC<MethodSignatureProps> = ({ name, signature, description, examples = [] }) => (
  <div className='method-signature'>
    <h3>{name}</h3>
    <CodeBlock language='typescript'>{signature}</CodeBlock>
    <p>{description}</p>
    {examples.length > 0 && (
      <>
        <h4>Examples</h4>
        {examples.map((example, index) => (
          <div key={index}>
            <CodeBlock language='typescript'>{example.code}</CodeBlock>
            {example.description && <p>{example.description}</p>}
          </div>
        ))}
      </>
    )}
  </div>
);

/**
 * Props for the InfoBox component
 */
interface InfoBoxProps {
  /**
   * Type of info box: 'info', 'warning', 'tip', etc.
   */
  type?: 'info' | 'warning' | 'tip' | 'note' | 'danger';

  /**
   * Box title
   */
  title?: string;

  /**
   * Box content
   */
  children: React.ReactNode;
}

/**
 * A component for displaying information boxes
 */
export const InfoBox: React.FC<InfoBoxProps> = ({ type = 'info', title, children }) => (
  <div className={`info-box ${type}`} style={getInfoBoxStyle(type)}>
    {title && <h4 style={{ marginTop: 0 }}>{title}</h4>}
    <div>{children}</div>
  </div>
);

/**
 * Helper function to get styles for info boxes
 */
const getInfoBoxStyle = (type: InfoBoxProps['type']) => {
  const baseStyle = {
    padding: '1rem',
    marginBottom: '1rem',
    borderLeft: '4px solid',
    borderRadius: '4px',
  };

  switch (type) {
    case 'warning':
      return {
        ...baseStyle,
        backgroundColor: '#fff3cd',
        borderLeftColor: '#ffc107',
      };
    case 'tip':
      return {
        ...baseStyle,
        backgroundColor: '#d4edda',
        borderLeftColor: '#28a745',
      };
    case 'note':
      return {
        ...baseStyle,
        backgroundColor: '#e2e3e5',
        borderLeftColor: '#6c757d',
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: '#f8d7da',
        borderLeftColor: '#dc3545',
      };
    case 'info':
    default:
      return {
        ...baseStyle,
        backgroundColor: '#d1ecf1',
        borderLeftColor: '#17a2b8',
      };
  }
};
