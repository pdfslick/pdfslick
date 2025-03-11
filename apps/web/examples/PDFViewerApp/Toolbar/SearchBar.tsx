import type { TUsePDFSlickStore } from "@pdfslick/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { VscSearch, VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import Splitter from "./Splitter";

type SearchBarProps = {
  usePDFSlickStore: TUsePDFSlickStore;
};

const SearchBar = ({ usePDFSlickStore }: SearchBarProps) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightAll, setHighlightAll] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [entireWord, setEntireWord] = useState(false);
  const [term, setTerms] = useState("");

  const searchRef = useRef() as MutableRefObject<HTMLInputElement>;

  const handleEscape = (e: KeyboardEvent) => {
    let handled = false;

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "f" && e.metaKey) {
      handled = true;
      setIsOpen(true);
    }

    if (handled) {
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current.focus();
    } else {
      pdfSlick?.eventBus.dispatch("findbarclose", {});
    }
  }, [isOpen]);

  return (
    <div className="relative w-fit">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`enabled:hover:bg-slate-200 enabled:hover:text-black  disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent ${
          isOpen ? "bg-slate-200 text-black" : "text-slate-500"
        }`}
      >
        <VscSearch className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-fit">
          <div
            className={`h-9 flex items-center justify-between bg-slate-100 border border-slate-300 text-xs select-none sticky top-0 rounded-sm z-10`}
          >
            <div className="px-1 flex items-center gap-1">
              <input
                type="text"
                ref={searchRef}
                placeholder="Search... "
                className="block w-48 rounded-sm border border-slate-300 focus:shadow focus:border-blue-400 focus:ring-0 outline-none text-xs p-1 px-1.5 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
                value={term}
                onInput={(e) => {
                  const query = (e.target as HTMLInputElement).value;

                  pdfSlick?.eventBus.dispatch("find", {
                    type: "",
                    query,
                    caseSensitive,
                    highlightAll,
                    entireWord,
                  });

                  setTerms(query);
                }}
                onKeyDown={(e) => {
                  const query = (e.target as HTMLInputElement).value;

                  if (e.key === "Enter") {
                    pdfSlick?.eventBus.dispatch("find", {
                      type: "again",
                      query,
                      caseSensitive,
                      highlightAll,
                      entireWord,
                      findPrevious: e.shiftKey,
                    });
                  }
                }}
              />

              <button
                className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
                onClick={() => {
                  pdfSlick?.eventBus.dispatch("find", {
                    type: "again",
                    query: term,
                    caseSensitive,
                    highlightAll,
                    entireWord,
                    findPrevious: true,
                  });
                }}
              >
                <VscChevronLeft className="h-4 w-4" />
              </button>

              <button
                className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
                onClick={() => {
                  pdfSlick?.eventBus.dispatch("find", {
                    type: "again",
                    query: term,
                    caseSensitive,
                    highlightAll,
                    entireWord,
                  });
                }}
              >
                <VscChevronRight className="h-4 w-4" />
              </button>

              <Splitter />

              <button
                className={`enabled:hover:bg-slate-200 enabled:hover:text-black disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent text-nowrap ${
                  highlightAll ? "bg-slate-200 text-black" : "text-slate-500"
                }`}
                onClick={() => {
                  const newHighlightAll = !highlightAll;
                  pdfSlick?.eventBus.dispatch("find", {
                    type: "highlightallchange",
                    query: term,
                    caseSensitive,
                    highlightAll: newHighlightAll,
                    entireWord,
                  });

                  setHighlightAll(newHighlightAll);
                }}
              >
                Highlight All
              </button>

              <button
                className={`enabled:hover:bg-slate-200 enabled:hover:text-black disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent text-nowrap ${
                  caseSensitive ? "bg-slate-200 text-black" : "text-slate-500"
                }`}
                onClick={() => {
                  const newCaseSensitive = !caseSensitive;
                  pdfSlick?.eventBus.dispatch("find", {
                    type: "casesensitivitychange",
                    query: term,
                    caseSensitive: newCaseSensitive,
                    highlightAll,
                    entireWord,
                  });

                  setCaseSensitive(newCaseSensitive);
                }}
              >
                Match Case
              </button>

              <button
                className={`enabled:hover:bg-slate-200 enabled:hover:text-black disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent text-nowrap ${
                  entireWord ? "bg-slate-200 text-black" : "text-slate-500"
                }`}
                onClick={() => {
                  const newEntireWord = !entireWord;
                  pdfSlick?.eventBus.dispatch("find", {
                    type: "entirewordchange",
                    query: term,
                    caseSensitive,
                    highlightAll,
                    entireWord: newEntireWord,
                  });

                  setEntireWord(newEntireWord);
                }}
              >
                Whole Words
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
