# Payment brand icons — placeholder notice

This folder is reserved for the **official logo artwork** of each payment
method, once licensed/downloaded from the provider's brand-asset kit:

- `visa.svg`
- `mastercard.svg`
- `yape.svg`
- `plin.svg`
- `paypal.svg`
- `izipay.svg`
- `niubiz.svg`

**Why it's empty right now:** reproducing a payment network's trademarked
logo from memory isn't reliable or safe to ship — the shapes and colors
are trademarked and each brand publishes its own guidelines. The MVP
instead displays elegant text badges (see `js/render/renderPaymentBadges.js`
and `.pay-pill` in `css/components/footer.css`) in the exact order the
brand requires: Visa, Mastercard, Yape, Plin, PayPal, Izipay, Niubiz.

**To upgrade to official logos before launch:**
1. Download each brand's official SVG from their developer/brand portal.
2. Drop the files into this folder using the filenames above.
3. Update `renderPaymentBadges.js` to render an `<img>`/inline `<svg>`
   sourced from `/assets/icons/payments/{id}.svg` instead of the text
   pill, keeping the same `js/data/payment-methods.json` order.
