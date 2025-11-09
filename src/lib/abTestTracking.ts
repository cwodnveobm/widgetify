export const generateABTestTrackingScript = (variationId: string) => {
  return `
<!-- A/B Test Tracking Script -->
<script>
  (function() {
    const VARIATION_ID = '${variationId}';
    const API_URL = '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-ab-test-event';
    const SESSION_ID = sessionStorage.getItem('ab_test_session') || Math.random().toString(36).substring(7);
    sessionStorage.setItem('ab_test_session', SESSION_ID);
    
    // Track impression on load
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}'
      },
      body: JSON.stringify({
        variation_id: VARIATION_ID,
        event_type: 'impression',
        session_id: SESSION_ID,
        event_data: {
          url: window.location.href,
          referrer: document.referrer
        }
      })
    }).catch(err => console.log('Tracking error:', err));
    
    // Track clicks on widget
    document.addEventListener('click', function(e) {
      const widget = e.target.closest('[data-widget-id]');
      if (widget) {
        fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': '${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}'
          },
          body: JSON.stringify({
            variation_id: VARIATION_ID,
            event_type: 'click',
            session_id: SESSION_ID,
            event_data: {
              url: window.location.href,
              timestamp: new Date().toISOString()
            }
          })
        }).catch(err => console.log('Tracking error:', err));
      }
    });
    
    // Expose conversion tracking function
    window.trackWidgetConversion = function() {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}'
        },
        body: JSON.stringify({
          variation_id: VARIATION_ID,
          event_type: 'conversion',
          session_id: SESSION_ID,
          event_data: {
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(err => console.log('Tracking error:', err));
    };
  })();
</script>
`;
};

export const wrapWidgetWithTracking = (widgetCode: string, variationId: string): string => {
  // Add tracking attribute to the widget container
  const trackingAttr = ` data-widget-id="${variationId}"`;
  const wrappedCode = widgetCode.replace(
    /(<div[^>]*class="[^"]*widget[^"]*")/i,
    `$1${trackingAttr}`
  );
  
  // Append tracking script
  return wrappedCode + '\n' + generateABTestTrackingScript(variationId);
};