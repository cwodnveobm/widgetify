import { useEffect } from 'react';
import LastSetPublic from './LastSetPublic';

/**
 * Iframe-friendly bio embed. Renders LastSetPublic in a transparent,
 * compact mode (?embed=1 ensures noindex + tighter padding).
 */
export default function LastSetEmbed() {
  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    // Ensure ?embed=1 is in the URL for the inner page
    const url = new URL(window.location.href);
    if (url.searchParams.get('embed') !== '1') {
      url.searchParams.set('embed', '1');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);
  return <LastSetPublic />;
}
