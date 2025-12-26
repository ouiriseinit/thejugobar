THE JUGO BAR — static template (client cart)
--------------------------------------------

Files:
- index.html
- style.css
- script.js
- assets/  (place images, logo here)

Notes:
- Cart is fully client-side and stored in localStorage under key "jugo_cart_v1".
- Checkout button is a stub (disabled until items exist, but still not a payment flow).
- Contact form is static (no submission).
- No analytics, no external scripts included.
- To run: open index.html in a browser. For local image loading in some browsers, you may need to serve via a simple static server (e.g., `python -m http.server 8000`), but most browsers allow file:// open.

To adapt:
- Replace product cards with the exact content/images from the real site.
- Replace images in /assets with real images (keep filenames consistent).
- If you later want server-side behavior (order storage, payments), I can provide Node/Express templates.
