# Alberto Clocks — Image Layout Notes

Product, package, watch-part and gallery card images use fixed responsive frames with `object-fit: cover` so portrait source images fill the card without leaving large empty bands.

Detail modals intentionally use `object-fit: contain` so the complete timepiece/component remains visible when a user opens it.

If a future image has the subject positioned unusually high or low, adjust only that item's `object-position` rather than changing the global card sizing.
