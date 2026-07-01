export default async function handler(req, res) {
  const targetUrl = 'https://unlitify-lead-flow.base44.app' + req.url;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'host': 'unlitify-lead-flow.base44.app',
        'referer': 'https://unlitify-lead-flow.base44.app/'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    }

    let html = await response.text();

    // ENHANCED: Larger, ultra-crisp badge container with high fidelity scaling rules
    const logoOverlayHtml = `
      <!-- Larger High-Definition Custom Unlitify Overlay Element -->
      <div id="unlitify-mask" style="position: fixed !important; bottom: 12px !important; right: 12px !important; z-index: 9999999 !important; background-color: #161b22 !important; border: 2px solid #444c56 !important; border-radius: 10px !important; padding: 12px 24px !important; display: flex !important; align-items: center !important; gap: 14px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; box-shadow: 0 10px 25px rgba(0,0,0,0.75) !important;">
          <span style="color: #c9d1d9 !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 1px !important; -webkit-font-smoothing: antialiased !important;">Powered by</span>
          <div style="width: 2px !important; height: 26px !important; background-color: #444c56 !important;"></div>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEir1SERzL8Vh_WEYLDNBFkBlUAInnco92xAsx-nJXwkDDh8bKqySxf1mcmsQkWp6mIMwND30vRb34mD01_Nt4h6ZMuOimwC_-WvYELU-zXVPKHkBak8M3Ysy7yHxgg1OGLA0joT0lCnsdKQJ4WvLnF5ZCoCXQfevmrC7ioWFTIEOa02mGPSauntB3z2HjDy/s939/image-removebg-preview%20(9).png" 
               style="height: 32px !important; width: auto !important; object-fit: contain !important; display: block !important; image-rendering: -webkit-optimize-contrast !important; image-rendering: crisp-edges !important;" />
      </div>
    `;

    html = html.replace('</body>', `${logoOverlayHtml}</body>`);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    return res.status(500).json({ error: 'Proxy Connection Failed', details: error.message });
  }
}
