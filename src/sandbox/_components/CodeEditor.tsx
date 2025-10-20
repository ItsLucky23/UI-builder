import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';

export default function CodeEditor() {
  const [code, setCode] = useState(`
    import { useState } from "react";

    export default function App() {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
    }
  `);

  return (
    <CodeMirror
      value={code}
      height="100%"
      extensions={[javascript({ jsx: true, typescript: true })]}
      theme="dark"
      onChange={(value) => setCode(value)}
    />
  );
}