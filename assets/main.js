(function () {
  "use strict";
  // Working labels only. Titles, prices, materials and sizes to be confirmed by the artist.
  var works = [
    { id: "portrait-01", label: "Portrait 01", src: "assets/art/portrait-01.jpg", alt: "Portrait 01: drawing of a young man with blue eyes and red lips, hand at his chin" },
    { id: "portrait-02", label: "Portrait 02", src: "assets/art/portrait-02.jpg", alt: "Portrait 02: sepia-toned drawing of a woman with windswept hair looking to the side" },
    { id: "portrait-03", label: "Portrait 03", src: "assets/art/portrait-03.jpg", alt: "Portrait 03: graphite drawing of a young man in a T-shirt in dramatic light" },
    { id: "portrait-04", label: "Portrait 04", src: "assets/art/portrait-04.jpg", alt: "Portrait 04: pencil drawing of a girl with a ponytail, hand raised to her hair" },
    { id: "portrait-05", label: "Portrait 05", src: "assets/art/portrait-05.jpg", alt: "Portrait 05: dark-toned drawing of a man in a suit and tie, signed lower left" }
  ];
  var FAV_KEY = "lotusArtworkFavourites";
  var favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { favs = []; }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html) n.innerHTML = html;
    return n;
  }
  function artButton(w, i) {
    var b = el("button", { "class": "art-btn frame", "data-index": i, "aria-label": "View " + w.label + " full size" });
    b.appendChild(el("img", { src: w.src, alt: w.alt, loading: "lazy" }));
    return b;
  }

  var grid = document.getElementById("grid");
  var shop = document.getElementById("shop-grid");
  works.forEach(function (w, i) {
    var fig = el("figure", { "class": "card" });
    fig.appendChild(artButton(w, i));
    fig.appendChild(el("figcaption", {}, w.label));
    grid.appendChild(fig);

    var item = el("article", { "class": "item" });
    item.appendChild(artButton(w, i));
    var body = el("div", { "class": "item-body" });
    body.appendChild(el("h3", {}, w.label));
    body.appendChild(el("p", { "class": "price" }, "Price to be confirmed"));
    body.appendChild(el("p", { "class": "status" }, "Purchasing not yet available"));
    var fav = el("button", { "class": "fav", type: "button", "aria-pressed": String(favs.indexOf(w.id) > -1) });
    function paint() { fav.textContent = fav.getAttribute("aria-pressed") === "true" ? "\u2665 Favourited" : "\u2661 Add to favourites"; }
    paint();
    fav.addEventListener("click", function () {
      var on = favs.indexOf(w.id) > -1;
      favs = on ? favs.filter(function (x) { return x !== w.id; }) : favs.concat(w.id);
      try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
      fav.setAttribute("aria-pressed", String(!on)); paint();
    });
    body.appendChild(fav);
    item.appendChild(body);
    shop.appendChild(item);
  });

  // Lightbox
  var lb = document.getElementById("lightbox"), img = document.getElementById("lb-img"), cap = document.getElementById("lb-cap");
  var cur = 0, opener = null;
  function show(i) { cur = (i + works.length) % works.length; img.src = works[cur].src; img.alt = works[cur].alt; cap.textContent = works[cur].label + " (" + (cur + 1) + " of " + works.length + ")"; }
  function open(i, from) { opener = from; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".art-btn");
    if (b) open(parseInt(b.getAttribute("data-index"), 10), b);
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(cur - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(cur - 1);
    else if (e.key === "ArrowRight") show(cur + 1);
    else if (e.key === "Tab") {
      var f = lb.querySelectorAll("button"), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Mobile nav
  var tog = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  tog.addEventListener("click", function () { var o = nav.classList.toggle("open"); tog.setAttribute("aria-expanded", String(o)); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); tog.setAttribute("aria-expanded", "false"); } });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
