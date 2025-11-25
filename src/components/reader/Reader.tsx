import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import ReaderHeader from "./ReaderHeader";
import "./Reader.css";

const Icons = {
  Library: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Aa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16" />
      <path d="M12 4v16" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bookmark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Headphones: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Stop: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
       <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  )
};

interface Selection {
  cfiRange: string;
  text: string;
  color: string;
}

interface ReaderProps {
  url: string;
  title: string;
  author?: string;
  bookId?: string;
}

interface TocItem {
  label: string;
  href: string;
  subitems?: TocItem[];
}

interface SearchResult {
  cfi: string;
  excerpt: string;
}

const Reader: React.FC<ReaderProps> = ({ url, title, bookId }) => {
  const [location, setLocation] = useState<string | number>(() => {
    if (bookId) {
      const saved = localStorage.getItem(`book-progress-${bookId}`);
      return saved || 0;
    }
    return 0;
  });

  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [fontSize, setFontSize] = useState(100); 
  const [fontFamily, setFontFamily] = useState("Merriweather");
  const [lineHeight, setLineHeight] = useState(1.5);
  const [margin, setMargin] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [showToc, setShowToc] = useState(false);
  
  // Header visibility state
  const [showHeader, setShowHeader] = useState(true);
  
  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selections, setSelections] = useState<Selection[]>(() => {
    if (bookId) {
      const saved = localStorage.getItem(`book-highlights-${bookId}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectionMenu, setSelectionMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    cfiRange: string;
    text: string;
  } | null>(null);

  const renditionRef = useRef<any>(null); 
  const bookRef = useRef<any>(null); 
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle mouse movement and show/hide header
  const handleMouseMove = useCallback((e?: MouseEvent) => {
    // If movement is near the top, show header immediately
    if (e && e.clientY < 80) {
      setShowHeader(true);
    } 
    // Otherwise, general movement keeps it visible if it was hidden by timeout
    // But logic is: show on move, hide if no move or specific action?
    // Requirement: "Show when moving mouse or touching edge"
    
    // Let's simplify: Show header on any mouse move, set timeout to hide it?
    // No, requirement says: "Hide when user starts reading or clicks center" and "Show when moving mouse or touching edge"
    
    setShowHeader(true);
    
    // Clear existing timeout
    /* if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    } */
    
    // Optionally auto-hide after few seconds of inactivity?
    // The prompt implies manual hiding mostly by reading action, but let's stick to prompt:
    // "Hide ... when user starts reading or clicks center" -> Action based
    // "Show ... when moving mouse" -> Action based
    
  }, []);

  // Effect to attach global mouse move listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);


  const locationChanged = (epubcifi: string | number) => {
    setLocation(epubcifi);
    if (bookId && epubcifi) {
      localStorage.setItem(`book-progress-${bookId}`, epubcifi.toString());
    }
    // Hiding header when location changes (user is "reading" / navigating)
    // setShowHeader(false); // Optional: aggressive hiding on page turn
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowToc(false);
    setShowSearch(false);
  };

  const changeTheme = (newTheme: "light" | "sepia" | "dark") => {
    setTheme(newTheme);
  };

  const toggleToc = () => {
    setShowToc(!showToc);
    setShowSettings(false);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setShowSettings(false);
    setShowToc(false);
  };

  const handleTocClick = (href: string) => {
    setLocation(href); 
    setShowToc(false); 
  };

  // Perform search (doSearch)
  const doSearch = async (q: string) => {
    if (!q.trim() || !bookRef.current) return;

    setIsSearching(true);
    setSearchResults([]); 

    try {
        const spineItems = bookRef.current.spine.spineItems;
        const resultsArray: any[] = [];

        for (const item of spineItems) {
            try {
                await item.load(bookRef.current.load.bind(bookRef.current));
                const itemResults = item.find(q);
                item.unload();

                if (itemResults && itemResults.length > 0) {
                    resultsArray.push(...itemResults);
                }
            } catch (err) {
                console.warn(`Error searching in item ${item.idref}`, err);
            }
        }
        
        const formattedResults = resultsArray.map(result => ({
            cfi: result.cfi,
            excerpt: result.excerpt.trim()
        }));
        
        setSearchResults(formattedResults);

    } catch (error) {
        console.error("Search failed:", error);
    } finally {
        setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchQuery);
  };

  const handleSearchResultClick = (cfi: string) => {
    setLocation(cfi);
  };

  // Update Styles
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}%`);
      renditionRef.current.themes.font(fontFamily);

       const iframeStyles = {
        body: { 
          color: theme === "dark" ? "#dedede" : (theme === "sepia" ? "#5b4636" : "#111"), 
          background: theme === "dark" ? "#111" : (theme === "sepia" ? "#f4ecd8" : "#fff"),
          'padding-top': '40px !important', 
          'line-height': `${lineHeight} !important`,
          'padding-left': `${margin}px !important`,
          'padding-right': `${margin}px !important`,
        },
        'h1, h2, h3': {
          'margin-top': '60px !important' 
        },
        ".epubjs-hl": {
           "fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"
        }
      };
      
      renditionRef.current.themes.register("custom", iframeStyles);
      renditionRef.current.themes.select("custom");
    }
  }, [fontSize, fontFamily, theme, lineHeight, margin]);


  const addHighlight = (color: string) => {
    if (!selectionMenu || !renditionRef.current) return;

    const newSelection = {
      cfiRange: selectionMenu.cfiRange,
      text: selectionMenu.text,
      color: color
    };

    renditionRef.current.annotations.add("highlight", selectionMenu.cfiRange, {}, undefined, `hl-${color}`);
    
    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);
    
    if (bookId) {
      localStorage.setItem(`book-highlights-${bookId}`, JSON.stringify(updatedSelections));
    }

    setSelectionMenu(null);
    const selection = window.getSelection();
    selection?.removeAllRanges();
  };


  const handleToggleSpeech = () => {
    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    if (renditionRef.current) {
      const visibleRange = renditionRef.current.getRange(renditionRef.current.currentLocation().start.cfi);
      const textToRead = visibleRange.toString();
      if (textToRead) {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "es-ES";
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synth.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const containerStyles = {
    ...ReactReaderStyle.container,
    // Adjust top to be 0 so it fills the space, we'll manage padding/overlap if needed
    // But header overlays now, so 0 is fine.
    top: 0, 
    bottom: 30,
    transition: 'top 0.3s ease-in-out'
  };

  return (
    <div className={`reader reader--${theme}`} style={{ height: "100vh", display: "flex", flexDirection: "column", position: 'relative', overflow: 'hidden' }}>
      <ReaderHeader
        title={title} 
        onToggleTheme={toggleSettings} 
        onToggleMenu={toggleToc} 
        onToggleSearch={toggleSearch}
        onToggleSpeech={handleToggleSpeech}
        isSpeaking={isSpeaking}
        isVisible={showHeader}
        Icons={Icons}
      />

      {/* SEARCH SIDEBAR (Panel Lateral) */}
      <div className={`reader-search-sidebar ${showSearch ? 'open' : ''} reader--${theme}`}>
         <div className="reader-search-header">
            <h2>Buscar</h2>
            <button onClick={() => setShowSearch(false)} className="reader-search-close">
               <Icons.Close />
            </button>
         </div>
         <div className="reader-search-input-container">
            <form onSubmit={handleSearchSubmit}>
                <div className="reader-search-box">
                    <input 
                        type="text" 
                        placeholder="Buscar en el libro..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="reader-search-input"
                    />
                    <button type="submit" className="reader-search-btn-icon" disabled={isSearching}>
                        {isSearching ? <span className="loader">...</span> : <Icons.Search />}
                    </button>
                </div>
            </form>
         </div>
         <div className="reader-search-results">
            {searchResults.length === 0 && !isSearching && searchQuery && isSearching === false && (
                <p className="no-results">No se encontraron resultados.</p>
            )}
            {searchResults.map((result, idx) => (
                <div key={idx} className="search-result-item" onClick={() => handleSearchResultClick(result.cfi)}>
                    <p>...{result.excerpt}...</p>
                </div>
            ))}
         </div>
      </div>
      
      {/* OVERLAY for Search (same as TOC) */}
      <div className={`reader-toc-overlay ${showSearch ? 'open' : ''}`} onClick={() => setShowSearch(false)}></div>


      {/* SETTINGS PANEL (Aa) */}
      {showSettings && (
        <div className="reader-settings-panel">
          <div className="reader-settings-row">
            <span>Tema</span>
            <div className="reader-theme-toggles">
              <button 
                className={`theme-btn light ${theme === 'light' ? 'active' : ''}`} 
                onClick={() => changeTheme('light')}
              >Aa</button>
              <button 
                className={`theme-btn sepia ${theme === 'sepia' ? 'active' : ''}`} 
                onClick={() => changeTheme('sepia')}
              >Aa</button>
              <button 
                className={`theme-btn dark ${theme === 'dark' ? 'active' : ''}`} 
                onClick={() => changeTheme('dark')}
              >Aa</button>
            </div>
          </div>

          <div className="reader-settings-row">
             <span>Fuente</span>
             <div className="reader-font-controls">
                <button onClick={() => setFontSize(Math.max(80, fontSize - 10))}>A-</button>
                <span>{fontSize}%</span>
                <button onClick={() => setFontSize(Math.min(200, fontSize + 10))}>A+</button>
             </div>
          </div>

          <div className="reader-settings-row">
            <span>Tipo</span>
            <select 
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value)}
              className="reader-font-select"
            >
              <option value="Merriweather">Merriweather (Serif)</option>
              <option value="Helvetica, Arial, sans-serif">Sans-Serif</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="OpenDyslexic">OpenDyslexic</option>
            </select>
          </div>

          <div className="reader-settings-row">
             <span>Interlineado</span>
             <div className="reader-font-controls">
                <button onClick={() => setLineHeight(Math.max(1, lineHeight - 0.1))}>-</button>
                <span>{lineHeight.toFixed(1)}</span>
                <button onClick={() => setLineHeight(Math.min(3, lineHeight + 0.1))}>+</button>
             </div>
          </div>

          <div className="reader-settings-row">
             <span>Márgenes</span>
             <div className="reader-font-controls">
                <button onClick={() => setMargin(Math.max(0, margin - 10))}>-</button>
                <span>{margin}px</span>
                <button onClick={() => setMargin(Math.min(100, margin + 10))}>+</button>
             </div>
          </div>
        </div>
      )}

      {selectionMenu && (
        <div className="reader-selection-menu">
           <button className="reader-hl-btn yellow" onClick={() => addHighlight("yellow")} />
           <button className="reader-hl-btn green" onClick={() => addHighlight("green")} />
           <button className="reader-hl-btn pink" onClick={() => addHighlight("pink")} />
           <button className="reader-hl-btn blue" onClick={() => addHighlight("blue")} />
           <div className="divider" />
           <button className="reader-hl-action" onClick={() => {
               navigator.clipboard.writeText(selectionMenu.text);
               setSelectionMenu(null);
           }}>Copiar</button>
        </div>
      )}

      <div className={`reader-toc-overlay ${showToc ? 'open' : ''}`} onClick={() => setShowToc(false)}></div>
      <div className={`reader-toc-sidebar ${showToc ? 'open' : ''} reader--${theme}`}>
        <div className="reader-toc-header">
          <h2>Contenido</h2>
          <button onClick={() => setShowToc(false)} className="reader-toc-close">
            <Icons.Close />
          </button>
        </div>
        <ul className="reader-toc-list">
          {toc.map((item, index) => (
            <li key={index} className="reader-toc-item" onClick={() => handleTocClick(item.href)}>
              {item.label}
            </li>
          ))}
          {toc.length === 0 && <li className="p-4 text-sm opacity-70">Cargando índice...</li>}
        </ul>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <ReactReader
          url={url}
          location={location}
          locationChanged={locationChanged}
          tocChanged={(toc) => setToc(toc)}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            bookRef.current = rendition.book; 
            
            rendition.hooks.content.register((contents: any) => {
              // Handle click inside iframe to toggle header
              const doc = contents.document;
              const body = doc.body;
              
              // We attach a click listener to the body of the book iframe
              body.addEventListener('click', (e: any) => {
                 // Simple logic: Toggle visibility on center click or hide on reading interaction
                 // If we want to detect "center" click specifically vs just "any" click that might be a page turn
                 // epub.js usually handles page turns on sides. 
                 
                 // Let's try to detect if it's a link or selection first? 
                 // If just a click on text/background:
                 
                 // Determine click position relative to width
                 const width = window.innerWidth;
                 const x = e.clientX;
                 
                 // Central 30%?
                 const isCenter = x > width * 0.3 && x < width * 0.7;
                 
                 if (isCenter) {
                    setShowHeader(prev => !prev);
                 } else {
                    // Side clicks might be page turns, usually we hide header on reading
                    setShowHeader(false);
                 }
              });
              
              // Also handle mouse move inside iframe to show header if near top
               body.addEventListener('mousemove', (e: any) => {
                   if (e.clientY < 80) { // Near top
                       setShowHeader(true);
                   } else {
                       // Optionally handle general movement inside iframe to show it?
                       // The outer window listener handles outer movement.
                       // For consistent experience:
                       setShowHeader(true); 
                   }
               });

              const fontFace = `
                @font-face {
                  font-family: 'OpenDyslexic';
                  src: url('https://cdnjs.cloudflare.com/ajax/libs/opendyslexic/0.91.0/fonts/OpenDyslexic-Regular.otf') format("opentype");
                  font-weight: normal;
                  font-style: normal;
                }
                @font-face {
                  font-family: 'OpenDyslexic';
                  src: url('https://cdnjs.cloudflare.com/ajax/libs/opendyslexic/0.91.0/fonts/OpenDyslexic-Bold.otf') format("opentype");
                  font-weight: bold;
                  font-style: normal;
                }
              `;
              const style = contents.document.createElement('style');
              style.innerHTML = fontFace;
              contents.document.head.appendChild(style);

              contents.addStylesheetRules({
                 "body": { "padding-top": "0 !important" }, // Reset padding since header is overlay now
                 "h1": { "margin-top": "60pt !important" },
                 "h2": { "margin-top": "60pt !important" },
                 ".chapter-title": { "margin-top": "60pt !important" },
                 
                 ".hl-yellow": { "fill": "#fde047 !important", "fill-opacity": "0.3 !important", "mix-blend-mode": "multiply !important" },
                 ".hl-green": { "fill": "#86efac !important", "fill-opacity": "0.3 !important", "mix-blend-mode": "multiply !important" },
                 ".hl-pink": { "fill": "#f9a8d4 !important", "fill-opacity": "0.3 !important", "mix-blend-mode": "multiply !important" },
                 ".hl-blue": { "fill": "#93c5fd !important", "fill-opacity": "0.3 !important", "mix-blend-mode": "multiply !important" }
              });
            });
            
            rendition.themes.fontSize(`${fontSize}%`);
            rendition.themes.font(fontFamily);
            
            const iframeStyles = {
                body: { 
                  color: theme === "dark" ? "#dedede" : (theme === "sepia" ? "#5b4636" : "#111"), 
                  background: theme === "dark" ? "#111" : (theme === "sepia" ? "#f4ecd8" : "#fff"),
                  'line-height': `${lineHeight} !important`,
                  'padding-left': `${margin}px !important`,
                  'padding-right': `${margin}px !important`,
                  'padding-top': '60px !important', // Add padding to body so content isn't hidden under overlay header initially
                }
            };
            rendition.themes.register("custom", iframeStyles);
            rendition.themes.select("custom");

            rendition.on("selected", (cfiRange: string, contents: any) => {
              const range = rendition.getRange(cfiRange);
              const text = range ? range.toString() : "";

              setSelectionMenu({
                show: true,
                x: 0, 
                y: 0,
                cfiRange,
                text
              });
            });

            rendition.on("click", () => setSelectionMenu(null));
            rendition.on("relocated", () => setSelectionMenu(null));

            selections.forEach(sel => {
               const colorClass = sel.color ? `hl-${sel.color}` : "hl-yellow";
               rendition.annotations.add("highlight", sel.cfiRange, {}, undefined, colorClass);
            });
          }}
          
          readerStyles={theme === "dark" ? { ...darkReaderStyles, container: { ...darkReaderStyles.container, ...containerStyles } } : { ...lightReaderStyles, container: { ...lightReaderStyles.container, ...containerStyles } }}
          
          epubOptions={{
            flow: "paginated",
            manager: "default",
          }}
        />
      </div>
    </div>
  );
};

const lightReaderStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#555",
  },
};

const darkReaderStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#dedede",
  },
  container: {
    ...ReactReaderStyle.container,
    backgroundColor: "#111",
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#dedede",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
};

export default Reader;
