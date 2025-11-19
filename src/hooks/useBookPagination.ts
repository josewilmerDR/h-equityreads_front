import { useState, useLayoutEffect, useRef } from 'react';

interface PaginationResult {
  pages: string[];
  isPaginationDone: boolean;
}

export const useBookPagination = (
  content: string,
  chapterTitle: string | undefined,
  width: number,
  height: number,
  fontSize: number
): PaginationResult => {
  const [pages, setPages] = useState<string[]>([]);
  const [isPaginationDone, setIsPaginationDone] = useState(false);
  
  // Use a ref for the measure element to avoid state re-renders during measurement
  const measureRef = useRef<HTMLDivElement>(document.createElement('div'));

  useLayoutEffect(() => {
    if (!content || width === 0 || height === 0) return;

    const measureEl = measureRef.current;
    // Setup invisible measure element styles
    measureEl.style.position = 'fixed';
    measureEl.style.visibility = 'hidden';
    measureEl.style.top = '-10000px';
    measureEl.style.left = '-10000px';
    measureEl.style.fontFamily = '"Merriweather", "Georgia", serif';
    measureEl.style.fontSize = `${fontSize}px`;
    measureEl.style.lineHeight = '1.7';
    measureEl.style.whiteSpace = 'pre-wrap';
    measureEl.style.textAlign = 'justify';
    measureEl.style.padding = '0';
    measureEl.style.margin = '0';
    
    // IMPORTANT: We measure using a SINGLE column logic for vertical flow calculation,
    // but we simulate the width of the actual text column.
    const isTwoColumn = width > 850;
    const gap = 48; // 3rem matches tailwind gap-12
    const columnWidth = isTwoColumn ? (width - gap) / 2 : width;
    
    measureEl.style.width = `${columnWidth}px`;
    document.body.appendChild(measureEl);

    // --- 1. Measure Title Height ---
    let titleHeight = 0;
    if (chapterTitle) {
      measureEl.innerHTML = `<div style="font-size: 1.5em; font-weight: 700; text-transform: uppercase; text-align: center; padding-bottom: 48px; line-height: 1.2;">${chapterTitle}</div>`;
      titleHeight = measureEl.scrollHeight;
    }

    // --- 2. Calculate Available Heights ---
    // Page 0 available height for TEXT ONLY
    const pageZeroTextHeight = Math.max(height - titleHeight, 100); 
    // Subsequent pages available height
    const fullPageHeight = height;

    // Convert to "Linear Capacity" (How tall of a single column can we fit?)
    // If 2 columns, we can fit 2x the height.
    const pageZeroCapacity = isTwoColumn ? pageZeroTextHeight * 2 : pageZeroTextHeight;
    const fullPageCapacity = isTwoColumn ? fullPageHeight * 2 : fullPageHeight;

    // --- 3. Pagination Algorithm ---
    const generatedPages: string[] = [];
    let currentText = content;
    
    // Clean up content (simple version of your htmlToText)
    // Assuming input is plain text for this demo, or pre-cleaned.
    // If HTML, we would need a more complex parser.
    
    let loops = 0;
    const MAX_LOOPS = 1000; // Safety break

    while (currentText.length > 0 && loops < MAX_LOOPS) {
      loops++;
      
      const isFirstPage = generatedPages.length === 0;
      const targetCapacity = isFirstPage ? pageZeroCapacity : fullPageCapacity;

      // Binary Search for the fit
      let low = 0;
      let high = currentText.length;
      let bestFitIndex = 0;

      // Optimization: Start search near estimated character count
      // Avg char width approx 0.5em? Very rough guess. 
      // Better to just binary search properly.
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const slice = currentText.slice(0, mid);
        
        measureEl.textContent = slice;
        
        // Check if it fits vertically
        if (measureEl.scrollHeight <= targetCapacity) {
          bestFitIndex = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Snap to nearest whitespace to avoid cutting words
      let cutIndex = bestFitIndex;
      if (cutIndex < currentText.length) {
         const lastSpace = currentText.lastIndexOf(' ', cutIndex);
         // If space is reasonably close, use it. Otherwise strictly cut (rare long word)
         if (lastSpace > cutIndex * 0.8) {
           cutIndex = lastSpace;
         }
      }

      // Add page
      const pageContent = currentText.slice(0, cutIndex).trim();
      generatedPages.push(pageContent);
      
      // Advance
      currentText = currentText.slice(cutIndex).trim();
    }

    document.body.removeChild(measureEl);
    setPages(generatedPages);
    setIsPaginationDone(true);

  }, [content, chapterTitle, width, height, fontSize]);

  return { pages, isPaginationDone };
};