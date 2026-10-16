// Computed data for EN product pages (SEO + hreflang)
module.exports = {
  eleventyComputed: {
    title: (data) => (data.b ? `${data.b.name_en} · Gift voucher | Hotel Playa de Aguilar ****` : ""),
    description: (data) => (data.b ? data.b.short_en : ""),
    canonicalPath: (data) => (data.b ? `/en/shop/${data.b.slug}/` : ""),
    altEs: (data) => (data.b ? `/tienda/${data.b.slug}/` : ""),
    altEn: (data) => (data.b ? `/en/shop/${data.b.slug}/` : "")
  }
};
