import { Fragment, useEffect } from "react";
import { Highlight, Prism, themes } from "prism-react-renderer";

(typeof global !== "undefined" ? global : window).Prism = Prism;

export function Fence({ children, language }: any) {
  useEffect(() => {
    (async () => {
      // @ts-ignore
      await import("prism-svelte");
    })();
  }, []);
  return (
    <Highlight
      code={children.trimEnd()}
      language={language}
      theme={themes.dracula}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={className} style={style}>
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
