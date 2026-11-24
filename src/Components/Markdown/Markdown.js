import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const extractText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props) return extractText(node.props.children);
  return '';
};

const CodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeElement = React.Children.toArray(children)[0];
  const className = codeElement?.props?.className || '';
  const language = (className.match(/language-([\w+#.-]+)/) || [])[1];
  const code = extractText(codeElement).replace(/\n$/, '');

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <pre {...props}>
      <div className="cw-markdown-code-header">
        <span>{language || 'code'}</span>
        <button type="button" className="cw-markdown-copy" onClick={copy}>
          <i className={copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'} style={{ marginRight: '4px' }} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {children}
    </pre>
  );
};

const components = {
  pre: CodeBlock,
  table: ({ node, ...props }) => (
    <div className="cw-markdown-table-wrapper">
      <table {...props} />
    </div>
  ),
  a: ({ node, children, ...props }) => (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

// GitHub flavored markdown renderer (tables, task lists, strikethrough, autolinks)
// shared by the AI chat and the support tickets.
const Markdown = ({ children, className = '', style }) => (
  <div className={`cw-markdown ${className}`.trim()} style={style}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {typeof children === 'string' ? children : extractText(children)}
    </ReactMarkdown>
  </div>
);

export default Markdown;
