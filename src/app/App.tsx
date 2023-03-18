import React, { Fragment, useEffect, useState } from 'react';
import { JsonViewer } from '@textea/json-viewer';
import CopyToClipboard from '@uiw/react-copy-to-clipboard';
import GitHubCorners from '@uiw/react-github-corners';
import '@wcj/dark-mode';
import './App.css';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type KeyboardEventType = Writeable<KeyboardEvent>;

const App = () => {
  const [data, setData] = useState<KeyboardEventType>();
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  function keypressHandle(evn: KeyboardEvent) {
    evn.preventDefault();
    const protoKeys: (keyof KeyboardEventType)[] = [
      'altKey',
      'code',
      'ctrlKey',
      'isComposing',
      'key',
      // 'locale',
      'location',
      'metaKey',
      'repeat',
      'shiftKey',
      // 'char',
      'charCode',
      'keyCode',
      // 'keyIdentifier',
      // 'keyLocation',
      'which',

      'cancelBubble',
      'cancelable',
      'composed',
      'defaultPrevented',
      'detail',
      'eventPhase',
      'isTrusted',
      'timeStamp',
      'returnValue',
      'type',
    ];
    const result = {} as any;
    for (let key of protoKeys) {
      result[key] = evn[key];
    }
    setData(result as KeyboardEventType);
  }
  let timer: NodeJS.Timeout;
  function handleClick(text: string, isCopy: boolean, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    event.preventDefault();
    const target = event.target as HTMLSpanElement;
    target.parentElement!.classList.add('copied');
    if (timer) clearTimeout(timer);
    setCopied(true);
    timer = setTimeout(() => {
      setCopied(false);
      target.parentElement!.classList.remove('copied');
      clearTimeout(timer);
    }, 1000);
  }
  useEffect(() => {
    document.addEventListener('colorschemechange', (evn) => {
      setTheme(evn.detail.colorScheme === 'dark' ? 'dark' : 'light');
    });
    setTheme(document.documentElement.dataset.colorMode === 'dark' ? 'dark' : 'light');
    document.addEventListener('keydown', keypressHandle);
    return () => {
      document.removeEventListener('keydown', keypressHandle);
    };
  }, []);
  return (
    <div className="App">
      <dark-mode permanent light="Light" dark="Dart" style={{ position: 'fixed', top: '6px', left: '10px' }}></dark-mode>
      <GitHubCorners fixed size={56} target="_blank" href="https://github.com/uiwjs/keycode-info" />
      {copied && <div className="copied-info">copied</div>}
      <header className="App-header">
        {!data && <div className="help">Press any key to get the JavaScript event keycode</div>}
        {data && (
          <Fragment>
            <kbd className="key-which">{data.which}</kbd>
            <div className="keyboard">
              <CopyToClipboard onClick={handleClick} text={data.key}>
                <kbd title="event.key">{data.key}</kbd>
              </CopyToClipboard>
              <CopyToClipboard onClick={handleClick} text={`${data.location}`}>
                <kbd title="event.location">{data.location}</kbd>
              </CopyToClipboard>
              <CopyToClipboard onClick={handleClick} text={`${data.which}`}>
                <kbd title="event.which" className="deprecated">
                  {data.which}
                </kbd>
              </CopyToClipboard>
              <CopyToClipboard onClick={handleClick} text={`${data.keyCode}`}>
                <kbd title="event.keyCode" className="deprecated">
                  {data.keyCode}
                </kbd>
              </CopyToClipboard>
              <CopyToClipboard onClick={handleClick} text={`${data.code}`}>
                <kbd title="event.code">{data.code}</kbd>
              </CopyToClipboard>
            </div>
            <div className="json-view">
              <JsonViewer value={data} theme={theme} />
            </div>
          </Fragment>
        )}
      </header>
    </div>
  );
};

export default App;
