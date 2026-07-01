export default async function handler(req, res) {
  const targetUrl = 'https://unlitify-lead-flow.base44.app' + req.url;

  try {
    // 1. Fetch the live page data from the original base44 server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        // Override host headers to avoid security trigger mismatches
        'host': 'unlitify-lead-flow.base44.app',
        'referer': 'https://unlitify-lead-flow.base44.app/'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });

    // Handle non-HTML assets directly (images, scripts, styles)
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    }

    // 2. Extract HTML contents
    let html = await response.text();

    // 3. Define your custom branding script overlay text string
    const logoOverlayHtml = `
      <!-- Embedded Custom Unlitify Overlay Element -->
      <div id="unlitify-mask" style="position: fixed !important; bottom: 12px !important; right: 12px !important; z-index: 9999999 !important; background-color: #161b22 !important; border: 1px solid #30363d !important; border-radius: 6px !important; padding: 6px 12px !important; display: flex !important; align-items: center !important; gap: 8px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;">
          <span style="color: #8b949e !important; font-size: 10px !important; font-weight: 500 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">Powered by</span>
          <div style="width: 1px !important; height: 14px !important; background-color: #30363d !important;"></div>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRhGGBz2scOQ-dTnF0eLK00WBaZysS7dFI7eSH_iZ2p6HQQvtDW8QN6OkIAts8dT9c-B8XNvqMviltLkXHlgW9WW8q61_KaM7-6YbFW2H0gfOO0eJriYjtL3j9FcFx1CQ0jaUDKYsefQqMjhxCiRRwIUTfUfPV3CJvSk2vj8fRmeBSq38VlUnqaeZNrT_B/s897/image-removebg-preview%20(10).png" 
               alt="Unlitify Logo" 
               style="height: 18px !important; width: auto !important; object-fit: contain !important; display: block !important;" />
      </div>
    `;

    // Inject the badge right before the closing body tag
    html = html.replace('</body>', `${logoOverlayHtml}</body>`);

    // 4. Return modified HTML markup safely back to client browser
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    return res.status(500).json({ error: 'Proxy Connection Failed', details: error.message });
  }
}
