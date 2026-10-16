// Datos computados para las páginas de producto ES (SEO + hreflang)
module.exports = {
  eleventyComputed: {
    title: (data) => (data.b ? `${data.b.name_es} · Bono regalo | Hotel Playa de Aguilar ****` : ""),
    description: (data) => (data.b ? data.b.short_es : ""),
    canonicalPath: (data) => (data.b ? `/tienda/${data.b.slug}/` : ""),
    altEs: (data) => (data.b ? `/tienda/${data.b.slug}/` : ""),
    altEn: (data) => (data.b ? `/en/shop/${data.b.slug}/` : "")
  }
};
