// Stable keys follow the DOM element tree, not element indices, so inserting a paragraph does not renumber every following field.
export function stableKey(el: Element, root: Element) {
  const explicit = el.getAttribute("data-cms-id");
  if (explicit) return explicit;
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== root) {
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const peers = Array.from(parent.children).filter(
      (c) => c.tagName === node!.tagName,
    );
    parts.unshift(node.tagName.toLowerCase() + ":" + peers.indexOf(node));
    node = parent;
  }
  return parts.join("/");
}
export function candidates(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      "h1,h2,h3,h4,h5,p,span,li,button,a,blockquote,img,figcaption,label,[data-cms-background]",
    ),
  ).filter((el) => {
    if (
      el.closest(
        '[data-cms-ui],.leaflet-container,.maplibregl-map,svg,script,style,form,[role="tablist"],[role="status"],[role="alert"]',
      )
    )
      return false;
    if (el.matches("[data-cms-background]")) return true;
    if (el.tagName === "IMG") return true;
    if (el.hasAttribute("data-cms-inline")) return true;
    if (el.children.length > 0) return false;
    return el.hasAttribute("data-cms-key") || !!el.textContent?.trim();
  });
}
