import React, { useContext, useState } from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import GlobalContext from '../../Context/GlobalContext';
import './MarkdownEditor.css';

const MarkdownEditor = (props) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;
  const [selectedTab, setSelectedTab] = useState("write");

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <div className={`markdown-editor ${_mode === 'dark' ? 'dark-mode' : ''}`}>
      <ReactMde
        value={props.value}
        onChange={props.onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
      />
    </div>
  );
};

export default MarkdownEditor;