import { Fragment } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Prism } from "./Prism";

export function Fence({ children, language }: any) {
  return (
    <Highlight
      code={children.trimEnd()}
      language={language}
      theme={themes.dracula}
      prism={Prism}
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
