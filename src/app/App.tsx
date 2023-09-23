import React, { Fragment, useEffect, useState } from 'react';
import JsonViewer from '@uiw/react-json-view';
import { darkTheme } from '@uiw/react-json-view/dark';
import { lightTheme } from '@uiw/react-json-view/light';
import CopyToClipboard from '@uiw/react-copy-to-clipboard';
import GitHubCorners from '@uiw/react-github-corners';
import '@wcj/dark-mode';
import styled, { css } from 'styled-components';

const Wrapper = styled.main`
  text-align: center;
`;

const CopiedInfo = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: #03a132;
  color: #fff;
  padding: 2px 5px;
  border-radius: 2px;
`;

const Header = styled.header`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 6rem;
`;

const Keyboard = styled.div`
  display: flex;
  & > span + span {
    margin-left: 10px;
    display: inline-block;
  }
  & .deprecated {
    background-color: #ff9696;
    text-decoration: line-through;
  }
  & .copied kbd {
    background: #03a132;
  }
  & kbd {
    font-size: 18px;
    min-width: 45px;
    min-height: 23px;
    font-weight: bold;
    display: inline-block;
    background: #eff0f2;
    background: var(--color-theme-text);
    color: var(--color-theme-bg);
    border-radius: 3px;
    padding: 5px 10px;
    border-top: 1px solid #f5f5f5;
    box-shadow:
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;
    text-shadow: 0px 1px 0px #f5f5f5;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
  }
`;

const KbdKey = styled.kbd`
  font-size: 40vmin;
  text-align: center;
`;

const view = css`
  display: inline-block;
  color: var(--color-theme-text);
  text-decoration: none;
  text-align: center;
  margin: 20px auto;
  padding: 15px 20px;
  background-color: var(--color-json-bg);
  border-radius: 5px;
  min-width: 24px;
`;

const Help = styled.div`
  ${view}
  font-size: 26px;
  box-shadow: 0 14px 26px rgb(0 0 0 / 4%);
`;

const JsonView = styled.div`
  ${view}
  text-align: initial;
  min-width: 320px;
  font-size: 16px;
  background-color: var(--color-json-bg);
`;

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
  const style = (theme === 'dark' ? darkTheme : lightTheme) as React.CSSProperties;
  return (
    <Wrapper>
      <dark-mode permanent light="Light" dark="Dart" style={{ position: 'fixed', top: '6px', left: '10px', fontSize: 18 }} />
      <GitHubCorners fixed size={56} target="_blank" href="https://github.com/uiwjs/keycode-info" />
      {copied && <CopiedInfo>copied</CopiedInfo>}
      <Header>
        {!data && <Help>Press any key to get the JavaScript event keycode</Help>}
        {data && (
          <Fragment>
            <KbdKey className="key-which">{data.which}</KbdKey>
            <Keyboard>
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
            </Keyboard>
            <JsonView>
              <JsonViewer value={data} style={{ ...style, '--w-rjv-background-color': 'transparent' } as React.CSSProperties}>
                <JsonViewer.KeyName
                  render={(props, { value, keyName }) => {
                    if (/(keycode|charcode|which)/i.test(keyName?.toString() || '')) {
                      return <del {...props}>{keyName}</del>;
                    }
                  }}
                />
              </JsonViewer>
            </JsonView>
          </Fragment>
        )}
      </Header>
    </Wrapper>
  );
};

export default App;
