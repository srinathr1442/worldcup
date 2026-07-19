# FutbolKits — FIFA Jersey Catalog

A full-stack product catalog for FIFA football jerseys.

- **Frontend:** Vanilla HTML5 / CSS3 / ES6+ JavaScript (no frameworks)
- **Backend:** Java, Spring Boot REST controllers (`@RestController`), embedded Tomcat
- **Communication:** `fetch()` from the browser to JSON endpoints on the Spring Boot app

## Folder structure

```
futbolkits/
├── frontend/
│   ├── index.html      # Page structure: nav, hero, filters, product grid, cart drawer
│   ├── styles.css       # Design tokens + sporty responsive styling
│   └── app.js           # Fetch, filter/sort, cart state, checkout POST
└── backend/
    ├── pom.xml
    └── src/main/java/com/futbolkits/catalog/
        ├── FutbolKitsApplication.java
        ├── model/
        │   ├── Product.java
        │   ├── CartItem.java
        │   └── CartRequest.java
        └── controller/
            ├── ProductController.java   # GET /api/products (league filter, price sort)
            └── CartController.java      # POST /api/cart (mock checkout)
```

## Running the backend

Requires Java 17+ and Maven.

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`:

- `GET  /api/products` — full catalog
- `GET  /api/products?league=World%20Cup` — filter by league
- `GET  /api/products?sort=asc|desc` — sort by price
- `POST /api/cart` — accepts `{ "items": [...], "subtotal": number }`, returns a mock confirmation

CORS is open (`@CrossOrigin(origins = "*")`) on both controllers so the static frontend can call it from a different port during development. Tighten this to a specific origin before deploying.

## Running the frontend

Any static file server works, e.g.:

```bash
cd frontend
python3 -m http.server 5500
```

Then open `http://localhost:5500`. The frontend expects the backend at `http://localhost:8080/api` (see the `API_BASE` constant at the top of `app.js` — update it if your backend runs elsewhere).

If the backend isn't running, `app.js` falls back to a small in-memory product list so the UI still renders for local design/UI work.

## Notes

- Images are CSS-drawn jersey placeholders (no binary image assets needed) — swap `product-placeholder` for real `<img>` tags and wire up `imageUrl` from `Product` once real product photography is available.
- Cart state lives in memory in `app.js` for this demo; wire it to `localStorage` or a user session if you need it to persist across page reloads.
