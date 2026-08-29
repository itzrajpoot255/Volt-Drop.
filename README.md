# 👟 Volt Drop 

**A limited-stock sneaker drop store with a live countdown, real-time inventory, and a cart that survives a refresh.**

Volt Drop is a front-end e-commerce storefront built to simulate a real streetwear/sneaker "drop" — products rendered dynamically from a data file, a countdown to when the drop closes, stock that ticks down live as items sell, and a cart + wishlist that persist across page reloads, all from a single static site.

🔗 **Repository:** 
🌐 **Live Demo:** _(add your Vercel link here after deploying)_

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Made with](https://img.shields.io/badge/made%20with-JavaScript-yellow)
![Framework](https://img.shields.io/badge/UI-Bootstrap%205-purple)
![Type](https://img.shields.io/badge/type-Frontend%20App-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| ⏱️ **Countdown Timer** | Live countdown to when the drop closes, updates every second, stops cleanly at zero |
| 📦 **Live Stock Indicator** | Each product shows remaining stock ("Only 3 left") and updates instantly as items are added to cart |
| 🛒 **Persistent Cart** | Cart contents are saved to `localStorage` and survive a full page refresh |
| 🔍 **Search + Filter** | Search bar plus category and price filters, all working together on the same product set |
| ↕️ **Sort Products** | Sort by price (low→high, high→low) or by rating |
| 🔥 **Trending Strip** | Horizontal scroll of the store's trending picks, pulled straight from the catalog |
| 👟 **24-Product Catalog** | 3 categories (running, basketball, lifestyle), each with sizes, colorways and ratings |
| 🔔 **Toast Notifications** | Instant "Added to cart" confirmation toast on every add |
| ❤️ **Wishlist** | Save products for later with a heart icon, kept separate from the cart |
| 🏷️ **Discount Codes** | Apply a promo code (`VOLT10`, `DROP20`) for a live discount on the cart total |
| 🌗 **Dark / Light Mode** | Theme toggle with the choice remembered on return visits |
| 🗂️ **Multi-Tab Sync** | Cart and stock automatically stay in sync if the store is open in more than one browser tab |
| ✅ **Checkout Validation** | Bootstrap-validated checkout form with a simulated order confirmation |

---

## 🛠️ Tech Stack

- **Language:** Vanilla JavaScript (ES6)
- **UI Framework:** Bootstrap 5 (via CDN — no build step)
- **Data storage:** Browser `localStorage` (cart, wishlist, theme)
- **Interface:** Single-page static site, fully client-side

---

## 📂 Project Structure

```
volt-drop/
├── index.html      # Page structure — navbar, hero, filters, modals, offcanvas panels
├── style.css        # Custom "sneaker drop" theme (dark/light tokens, cards, layout)
├── data.js           # Product catalog — every card is generated FROM this array
├── script.js          # Rendering, cart, wishlist, filters, countdown, checkout logic
├── hero-bg.jpg          # Hero artwork
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/volt-drop.git
   cd volt-drop
   ```

2. **Run it** — no install, no build step required. Either:
   - Open `index.html` directly in your browser, **or**
   - Serve it locally for the best experience:
     ```bash
     python3 -m http.server
     ```
     then visit `http://localhost:8000`

3. **Try it out** — search products, filter by category/price, sort, add items to your cart, save some to your wishlist, apply a discount code, and check out.

---

## 📸 Sample Output

More screenshots (desktop grid, mobile view, cart panel) are in the [`assets/`](./assets) folder.

---

## ⚠️ Known Limitations

- Stock resets to its original value on a hard page reload once an order is placed (no backend/database yet — a full order would need one)
- Discount codes are hardcoded, not managed through an admin panel
- Single "drop" only — no support for scheduling multiple drops at once
- No real payment gateway — checkout is simulated

## 🗺️ Roadmap

- [ ] Connect a real backend + database for persistent, multi-user stock
- [ ] Add a payment gateway integration
- [ ] Admin panel for managing products and discount codes
- [ ] Support multiple simultaneous drops

---

## 👤 Author

**(Muhammad Rehan Khalid)**
CloudExify Full Stack Web Development Internship 2026 — Month 1, Project 2


---

## 📄 License

This project is licensed under the MIT License.
