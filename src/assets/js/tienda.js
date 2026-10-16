/* Hotel Playa de Aguilar — carrito de bonos regalo (sin dependencias) */
(function () {
  "use strict";
  var KEY = "hpa_cart_v1";
  var lang = (document.documentElement.lang || "es").slice(0, 2);
  var es = lang !== "en";

  var T = {
    es: {
      added: "Añadido al carrito", empty: "Tu carrito está vacío.",
      unit: "Precio", qty: "Cantidad", sub: "Subtotal", total: "Total",
      remove: "Quitar", cont: "Seguir comprando", go: "Finalizar compra",
      shop: "/tienda.html", cart: "/tienda/carrito.html", checkout: "/tienda/checkout.html"
    },
    en: {
      added: "Added to cart", empty: "Your cart is empty.",
      unit: "Price", qty: "Quantity", sub: "Subtotal", total: "Total",
      remove: "Remove", cont: "Continue shopping", go: "Checkout",
      shop: "/en/shop.html", cart: "/en/shop/cart.html", checkout: "/en/shop/checkout.html"
    }
  }[es ? "es" : "en"];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    badge();
  }
  function count() { return read().reduce(function (n, i) { return n + i.qty; }, 0); }
  function total() { return read().reduce(function (n, i) { return n + i.qty * i.price; }, 0); }
  function money(n) {
    return new Intl.NumberFormat(es ? "es-ES" : "en-IE",
      { style: "currency", currency: "EUR" }).format(n);
  }

  function add(item, qty) {
    var c = read(), found = false;
    for (var i = 0; i < c.length; i++) {
      if (c[i].slug === item.slug) { c[i].qty += qty; found = true; break; }
    }
    if (!found) { item.qty = qty; c.push(item); }
    write(c);
  }
  function setQty(slug, qty) {
    var c = read();
    for (var i = 0; i < c.length; i++) {
      if (c[i].slug === slug) { c[i].qty = Math.max(1, qty); break; }
    }
    write(c);
  }
  function remove(slug) {
    write(read().filter(function (i) { return i.slug !== slug; }));
  }

  // Contador en la barra de navegación
  function badge() {
    var n = count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.style.display = n > 0 ? "" : "none";
    });
  }

  // --- Catálogo: filtro por categoría ---
  function initShop() {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;
    var chips = document.querySelectorAll("[data-filter]");
    var cards = grid.querySelectorAll("[data-cat]");
    var countEl = document.getElementById("shop-count");
    var word = es ? "resultados" : "results";
    function apply(cat) {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = cat === "all" || card.dataset.cat === cat;
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      chips.forEach(function (ch) { ch.setAttribute("aria-pressed", ch.dataset.filter === cat ? "true" : "false"); });
      if (countEl) countEl.textContent = (es ? "Página 1 de 1 · " : "Page 1 of 1 · ") + shown + " " + word;
    }
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () { apply(ch.dataset.filter); });
    });
    apply("all");
  }

  // --- Página de producto: botón "Añadir al carrito" ---
  function initProduct() {
    var btn = document.getElementById("add-to-cart");
    if (!btn) return;
    var qtyInput = document.getElementById("qty");
    var dec = document.getElementById("qty-dec"), inc = document.getElementById("qty-inc");
    if (dec) dec.addEventListener("click", function () { qtyInput.value = Math.max(1, (+qtyInput.value || 1) - 1); });
    if (inc) inc.addEventListener("click", function () { qtyInput.value = (+qtyInput.value || 1) + 1; });
    btn.addEventListener("click", function () {
      var q = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);
      add({
        slug: btn.dataset.slug, sku: btn.dataset.sku, name: btn.dataset.name,
        price: parseFloat(btn.dataset.price), image: btn.dataset.image
      }, q);
      window.location.href = T.cart;
    });
  }

  // --- Página de carrito ---
  function initCart() {
    var body = document.getElementById("cart-body");
    if (!body) return;
    function render() {
      var c = read();
      var wrap = document.getElementById("cart-wrap");
      var empty = document.getElementById("cart-empty");
      if (!c.length) {
        if (wrap) wrap.style.display = "none";
        if (empty) empty.style.display = "";
        return;
      }
      if (wrap) wrap.style.display = "";
      if (empty) empty.style.display = "none";
      body.innerHTML = "";
      c.forEach(function (i) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          '<td><div style="display:flex;gap:12px;align-items:center">' +
          '<img class="ci-img" src="' + i.image + '" alt="">' +
          '<span>' + i.name + '</span></div></td>' +
          '<td class="num">' + money(i.price) + '</td>' +
          '<td><div class="qty"><button type="button" aria-label="-" data-dec>−</button>' +
          '<input type="text" inputmode="numeric" value="' + i.qty + '" data-qty aria-label="' + T.qty + '">' +
          '<button type="button" aria-label="+" data-inc>+</button></div></td>' +
          '<td class="num">' + money(i.price * i.qty) + '</td>' +
          '<td class="num"><button class="cart-rm" type="button" data-rm aria-label="' + T.remove + '">✕</button></td>';
        tr.querySelector("[data-dec]").addEventListener("click", function () { setQty(i.slug, i.qty - 1); render(); });
        tr.querySelector("[data-inc]").addEventListener("click", function () { setQty(i.slug, i.qty + 1); render(); });
        tr.querySelector("[data-qty]").addEventListener("change", function (e) { setQty(i.slug, parseInt(e.target.value, 10) || 1); render(); });
        tr.querySelector("[data-rm]").addEventListener("click", function () { remove(i.slug); render(); });
        body.appendChild(tr);
      });
      var tv = document.getElementById("cart-total-val");
      if (tv) tv.textContent = money(total());
    }
    render();
  }

  // --- Página de checkout ---
  function initCheckout() {
    var lines = document.getElementById("co-lines");
    if (!lines) return;
    var c = read();
    var form = document.getElementById("form-pedido");
    var emptyMsg = document.getElementById("co-empty");
    if (!c.length) {
      if (form) form.style.display = "none";
      if (emptyMsg) emptyMsg.style.display = "";
      return;
    }
    var resumen = [];
    lines.innerHTML = "";
    c.forEach(function (i) {
      var row = document.createElement("div");
      row.className = "co-line";
      row.innerHTML = '<span>' + i.qty + ' × ' + i.name + '</span><span class="num">' + money(i.price * i.qty) + '</span>';
      lines.appendChild(row);
      resumen.push(i.qty + " x " + i.name + " (" + i.sku + ") = " + money(i.price * i.qty));
    });
    var tot = document.getElementById("co-total");
    if (tot) tot.textContent = money(total());
    var hid = document.getElementById("pedido-resumen");
    if (hid) hid.value = resumen.join("\n") + "\n-----\nTOTAL: " + money(total());
    var ht = document.getElementById("pedido-total");
    if (ht) ht.value = money(total());
    // Al enviar correctamente, el formulario redirige a la página de gracias (Netlify);
    // vaciamos el carrito al llegar allí.
  }

  // --- Página de gracias: vaciar carrito ---
  function initGracias() {
    if (document.getElementById("pedido-ok")) {
      try { localStorage.removeItem(KEY); } catch (e) {}
      badge();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    badge();
    initShop();
    initProduct();
    initCart();
    initCheckout();
    initGracias();
  });
})();
