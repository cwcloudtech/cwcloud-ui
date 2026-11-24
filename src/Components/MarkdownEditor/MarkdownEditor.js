import React, { useContext, useRef, useState } from 'react';
import GlobalContext from '../../Context/GlobalContext';
import Markdown from '../Markdown/Markdown';
import './MarkdownEditor.css';

const TOOLBAR = [
  { icon: 'fa-heading', title: 'Heading', prefix: '### ', suffix: '', block: true },
  { icon: 'fa-bold', title: 'Bold', prefix: '**', suffix: '**' },
  { icon: 'fa-italic', title: 'Italic', prefix: '_', suffix: '_' },
  { icon: 'fa-strikethrough', title: 'Strikethrough', prefix: '~~', suffix: '~~' },
  { icon: 'fa-code', title: 'Code', prefix: '`', suffix: '`' },
  { icon: 'fa-link', title: 'Link', prefix: '[', suffix: '](https://)' },
  { icon: 'fa-quote-right', title: 'Quote', prefix: '> ', suffix: '', block: true },
  { icon: 'fa-list-ul', title: 'List', prefix: '- ', suffix: '', block: true },
  { icon: 'fa-list-ol', title: 'Ordered list', prefix: '1. ', suffix: '', block: true },
  { icon: 'fa-list-check', title: 'Task list', prefix: '- [ ] ', suffix: '', block: true },
  { icon: 'fa-table', title: 'Table', prefix: '\n| Column | Column |\n| ------ | ------ |\n| ', suffix: ' |  |\n', block: true },
];

const MarkdownEditor = (props) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [selectedTab, setSelectedTab] = useState('write');
  const textareaRef = useRef(null);
  const value = props.value || '';

  const applyFormat = ({ prefix, suffix, block }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const needsNewLine = block && start > 0 && value[start - 1] !== '\n';
    const before = value.slice(0, start) + (needsNewLine ? '\n' : '') + prefix;
    const selected = value.slice(start, end);
    props.onChange(before + selected + suffix + value.slice(end));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(before.length, before.length + selected.length);
    });
  };

  return (
    <div
      data-testid="markdown-editor"
      className={`markdown-editor ${_mode === 'dark' ? 'dark-mode' : ''}`}
    >
      <div className="markdown-editor-header">
        <div className="markdown-editor-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === 'write'}
            className={selectedTab === 'write' ? 'active' : ''}
            onClick={() => setSelectedTab('write')}
          >
            <i className="icon fa-solid fa-pen"></i>
            Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === 'preview'}
            className={selectedTab === 'preview' ? 'active' : ''}
            onClick={() => setSelectedTab('preview')}
          >
            <i className="icon fa-solid fa-eye"></i>
            Preview
          </button>
        </div>
        {selectedTab === 'write' && (
          <div className="markdown-editor-toolbar">
            {TOOLBAR.map((tool) => (
              <button
                key={tool.title}
                type="button"
                title={tool.title}
                aria-label={tool.title}
                onClick={() => applyFormat(tool)}
              >
                <i className={`fa-solid ${tool.icon}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedTab === 'write' ? (
        <textarea
          ref={textareaRef}
          data-testid="markdown-editor-textarea"
          className="markdown-editor-textarea"
          value={value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ) : (
        <div className="markdown-editor-preview" data-testid="markdown-editor-preview">
          <Markdown>{value}</Markdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
