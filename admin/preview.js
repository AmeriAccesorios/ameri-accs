(function () {
  var h = window.h;
  var createClass = window.createClass;

  function value(entry, name, fallback) {
    var v = entry.getIn(["data", name]);
    return v == null || String(v).trim() === "" ? fallback : v;
  }

  function asset(props, entry, name) {
    var raw = entry.getIn(["data", name]);
    if (!raw) return "";
    try {
      return props.getAsset(raw).toString();
    } catch (e) {
      return String(raw);
    }
  }

  function imageBox(props, entry, field, className, label) {
    var src = asset(props, entry, field);
    if (src) {
      return h("div", { className: className + " has-image" },
        h("img", { src: src, alt: label || "" })
      );
    }
    return h("div", { className: className },
      h("span", { className: "preview-placeholder" }, "Vista previa · " + (label || "imagen"))
    );
  }

  var GeneralPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var props = this.props;

      var heroTitle = value(entry, "hero_title", "ACCESORIOS QUE HABLAN DE VOS.");
      var heroText = value(entry, "hero_text", "Accesorios únicos, papelería creativa y detalles para expresar tu estilo.");
      var aboutTitle = value(entry, "about_title", "AMERI ✦");
      var aboutText = value(entry, "about_text", "Somos un emprendimiento de accesorios y papelería creativa pensado para acompañar tu día a día con detalles que te representan.");

      var categoryData = [
        ["category_accessories_image", "category_accessories_title", "category_accessories_text", "ACCESORIOS", "Collares, pulseras, anillos y más."],
        ["category_stationery_image", "category_stationery_title", "category_stationery_text", "PAPELERÍA", "Stickers, libretas, papeles y más."],
        ["category_new_image", "category_new_title", "category_new_text", "NOVEDADES", "Lo último que llegó a Ameri."],
        ["category_collections_image", "category_collections_title", "category_collections_text", "COLECCIONES", "Descubrí nuestras colecciones especiales."]
      ];

      var categories = categoryData.map(function (item) {
        var imageField = item[0], titleField = item[1], textField = item[2];
        var title = value(entry, titleField, item[3]);
        var text = value(entry, textField, item[4]);

        return h("div", { className: "preview-category", key: imageField },
          imageBox(props, entry, imageField, "preview-category-image", title),
          h("div", { className: "preview-category-copy" },
            h("h3", {}, title),
            h("p", {}, text)
          )
        );
      });

      var steps = [1,2,3,4].map(function (n) {
        return h("div", { className: "preview-step", key: n },
          h("div", { className: "preview-step-number" }, String(n)),
          h("h4", {}, value(entry, "how_step_" + n + "_title", n + ". " + ["ELEGÍ","CONSULTÁ","CONFIRMAMOS","RECIBÍ"][n-1])),
          h("p", {}, value(entry, "how_step_" + n + "_text", "" ))
        );
      });

      var hero = asset(props, entry, "hero_image");

      return h("div", { className: "ameri-preview" },
        h("div", { className: "preview-browser-bar" },
          h("span", {}, "AMERI"),
          h("span", {}, "Vista previa en vivo")
        ),

        h("header", { className: "preview-header" },
          h("div", { className: "preview-brand" },
            (function () {
              var src = asset(props, entry, "logo_image");
              return src
                ? h("img", { src: src, alt: "Ameri" })
                : h("span", { className: "preview-brand-fallback" }, "AMERI ✦");
            })()
          ),
          h("span", { className: "preview-menu" }, "INICIO   CATÁLOGO   DESTACADOS   CONTACTO")
        ),

        h("section", { className: "preview-hero" },
          h("div", { className: "preview-hero-copy" },
            h("span", { className: "preview-eyebrow" }, "AMERI"),
            h("h1", {}, heroTitle),
            h("p", {}, heroText),
            h("span", { className: "preview-button" }, "VER COLECCIÓN ✦")
          ),
          h("div", { className: "preview-hero-image" + (hero ? " has-image" : "") },
            hero
              ? h("img", { src: hero, alt: "Imagen principal" })
              : h("span", { className: "preview-placeholder" }, "Imagen principal")
          )
        ),

        h("section", { className: "preview-section" },
          h("div", { className: "preview-section-heading" },
            h("span", { className: "preview-eyebrow" }, "EXPLORÁ AMERI"),
            h("h2", {}, "Categorías")
          ),
          h("div", { className: "preview-categories" }, categories)
        ),

        h("section", { className: "preview-section preview-products" },
          h("div", { className: "preview-section-heading" },
            h("span", { className: "preview-eyebrow" }, "AMERI / SHOP"),
            h("h2", {}, "Catálogo")
          ),
          h("div", { className: "preview-product-placeholder" },
            "El catálogo se administra desde “Productos”. La vista previa de los productos aparece al editar el catálogo."
          )
        ),

        h("section", { className: "preview-about" },
          h("div", { className: "preview-about-copy" },
            h("span", { className: "preview-eyebrow" }, "SOBRE AMERI"),
            h("h2", {}, aboutTitle),
            h("p", {}, aboutText)
          ),
          h("div", { className: "preview-about-gallery" },
            imageBox(props, entry, "about_image_1", "preview-about-image", "Sobre Ameri 1"),
            imageBox(props, entry, "about_image_2", "preview-about-image", "Sobre Ameri 2"),
            imageBox(props, entry, "about_image_3", "preview-about-image", "Sobre Ameri 3")
          )
        ),

        h("section", { className: "preview-section" },
          h("div", { className: "preview-section-heading" },
            h("h2", {}, value(entry, "how_title", "¿CÓMO COMPRAR?"))
          ),
          h("div", { className: "preview-steps" }, steps)
        ),

        h("footer", { className: "preview-footer" },
          h("strong", {}, "AMERI"),
          h("span", {}, value(entry, "instagram", "@ameri")),
          h("span", {}, value(entry, "location", "Ubicación"))
        )
      );
    }
  });

  var CatalogPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var props = this.props;
      var rawProducts = entry.getIn(["data", "products"]);
      var products = rawProducts && rawProducts.toJS ? rawProducts.toJS() : (rawProducts || []);

      var cards = products.map(function (p, idx) {
        var src = "";
        if (p.image) {
          try { src = props.getAsset(p.image).toString(); } catch (e) { src = String(p.image); }
        }

        return h("article", { className: "catalog-preview-card", key: idx },
          h("div", { className: "catalog-preview-art" },
            src
              ? h("div", { className: "catalog-preview-image-stack" },
                  h("img", { className: "catalog-preview-bg", src: src, alt: "", "aria-hidden": "true" }),
                  h("img", { className: "catalog-preview-fg", src: src, alt: p.title || "Producto Ameri" })
                )
              : h("div", { className: "catalog-preview-placeholder" }, "Sin imagen")
          ),
          h("div", { className: "catalog-preview-body" },
            h("div", { className: "catalog-preview-category" }, p.category || ""),
            h("h3", {}, p.title || "Producto sin nombre"),
            h("div", { className: "catalog-preview-price" }, p.price || ""),
            h("div", { className: "catalog-preview-button" }, "CONSULTAR POR WHATSAPP")
          )
        );
      });

      if (!cards.length) {
        cards = [
          h("div", { className: "catalog-preview-empty" },
            "Todavía no hay productos para mostrar en la vista previa."
          )
        ];
      }

      return h("div", { className: "catalog-preview-shell" },
        h("div", { className: "preview-browser-bar" },
          h("span", {}, "AMERI / CATÁLOGO"),
          h("span", {}, "Vista previa en vivo")
        ),
        h("div", { className: "catalog-preview-heading" },
          h("span", { className: "preview-eyebrow" }, "AMERI / SHOP"),
          h("h1", {}, "Catálogo"),
          h("p", {}, "Así se verán las tarjetas de tus productos en la página principal.")
        ),
        h("div", { className: "catalog-preview-grid" }, cards)
      );
    }
  });

  CMS.registerPreviewTemplate("general", GeneralPreview);
  CMS.registerPreviewTemplate("catalog", CatalogPreview);
  CMS.registerPreviewStyle("./preview.css");
})();
