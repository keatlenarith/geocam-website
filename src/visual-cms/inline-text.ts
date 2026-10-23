type Options = {
  commit: (key: string, value: string) => void;
  complete?: (key: string, value: string) => void;
};
/** Browser-native selection and clipboard editing; stores text only, never HTML. */
export function attachInlineText(
  main: HTMLElement,
  { commit, complete }: Options,
) {
  let current: {
    el: HTMLElement;
    key: string;
    before: string;
    attributes: Map<string, string | null>;
  } | null = null;
  const finish = (cancel = false, persist = true) => {
    if (!current) return;
    const { el, key, before, attributes } = current;
    const value = cancel ? before : el.innerText;
    current = null;
    el.textContent = value;
    el.removeAttribute("data-cms-inline");
    for (const [name, value] of attributes) {
      if (value === null) el.removeAttribute(name);
      else el.setAttribute(name, value);
    }
    if (persist && !cancel && value !== before) {
      if (value.trim() === "") {
        el.textContent = "";
        el.style.setProperty("display", "none", "important");
      }
      commit(key, value);
      complete?.(key, value);
    }
  };
  const find = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return null;
    const el = target.closest<HTMLElement>("[data-cms-key]");
    return el &&
      main.contains(el) &&
      el.tagName !== "IMG" &&
      !el.hasAttribute("data-cms-background")
      ? el
      : null;
  };
  const click = (event: MouseEvent) => {
    const el = find(event);
    if (!el) return;
    event.stopPropagation();
    if (current?.el === el) return;
    if (el.closest("a,button")) event.preventDefault();
  };
  const doubleClick = (event: MouseEvent) => {
    const el = find(event);
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    if (current?.el === el) return;
    finish();
    const names = [
      "contenteditable",
      "role",
      "aria-label",
      "aria-multiline",
      "tabindex",
      "spellcheck",
    ];
    current = {
      el,
      key: el.dataset.cmsKey!,
      before: el.textContent || "",
      attributes: new Map(names.map((name) => [name, el.getAttribute(name)])),
    };
    el.setAttribute("contenteditable", "plaintext-only");
    el.setAttribute("data-cms-inline", "");
    el.setAttribute("role", "textbox");
    el.setAttribute("aria-label", "Edit page text");
    el.setAttribute("aria-multiline", "true");
    el.setAttribute("tabindex", "0");
    el.setAttribute("spellcheck", "true");
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };
  const input = () => {
    // Keep the native editing buffer until blur/Enter. Escape must preserve
    // the original English field and its existing Khmer translation.
  };
  const blur = (event: FocusEvent) => {
    if (event.target === current?.el) finish();
  };
  const key = (event: KeyboardEvent) => {
    if (!current || event.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      const el = current.el;
      finish(true);
      el.blur();
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const el = current.el;
      finish();
      el.blur();
    }
  };
  const paste = (event: ClipboardEvent) => {
    if (!current || !current.el.contains(event.target as Node)) return;
    event.preventDefault();
    // insertText preserves native selection, undo, cut and copy behavior.
    document.execCommand(
      "insertText",
      false,
      event.clipboardData?.getData("text/plain") || "",
    );
    input();
  };
  main.addEventListener("click", click, true);
  main.addEventListener("dblclick", doubleClick, true);
  main.addEventListener("input", input, true);
  main.addEventListener("focusout", blur, true);
  main.addEventListener("keydown", key, true);
  main.addEventListener("paste", paste, true);
  const pagehide = () => finish();
  window.addEventListener("pagehide", pagehide);
  return () => {
    finish(false, false);
    main.removeEventListener("click", click, true);
    main.removeEventListener("dblclick", doubleClick, true);
    main.removeEventListener("input", input, true);
    main.removeEventListener("focusout", blur, true);
    main.removeEventListener("keydown", key, true);
    main.removeEventListener("paste", paste, true);
    window.removeEventListener("pagehide", pagehide);
  };
}
