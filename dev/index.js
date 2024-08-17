import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { serverFunctions } from '../src/client/utils/serverFunctions.ts';

const { FILENAME, PORT } = process.env;

const DevServer = () => {
  const iframe = React.useRef(null);

  useEffect(() => {
    const handleRequest = (event) => {
      const request = event.data;
      const { type, functionName, id, args } = request;

      if (type !== 'REQUEST') return;

      // Determine the URL based on the environment
      const origin = process.env.NODE_ENV === 'development' 
        ? `https://localhost:${PORT}`
        : '*'; // In production, use wildcard or specify the actual origin if known

      serverFunctions[functionName](...args)
        .then((response) => {
          iframe.current.contentWindow.postMessage(
            { type: 'RESPONSE', id, status: 'SUCCESS', response },
            origin
          );
        })
        .catch((err) => {
          iframe.current.contentWindow.postMessage(
            {
              type: 'RESPONSE',
              id,
              status: 'ERROR',
              response: err,
            },
            origin
          );
        });
    };

    window.addEventListener('message', handleRequest, false);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('message', handleRequest, false);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: '0',
          position: 'absolute',
        }}
        ref={iframe}
        // Set the iframe source based on the environment
        src={
          process.env.NODE_ENV === 'development' 
            ? `https://localhost:${PORT}/${FILENAME}-impl.html`
            : `/${FILENAME}-impl.html` // Use relative path in production
        }
        allow={'clipboard-read; clipboard-write'}
      />
    </div>
  );
};

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<DevServer />);
