const svg = `
<svg t="1654918773423" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23050" width="32" height="32"><path d="M971.3664 418.304L606.3104 207.9744 244.224 418.304l161.792 93.0816-161.792 94.8224 364.4416 210.432L971.3664 606.208 808.96 511.3856zM887.1936 606.208l-278.528 162.4064L326.5536 606.208l118.5792-69.9392 163.84 93.696 158.8224-92.16zM49.7664 439.0912h58.6752v209.2032h59.2896V439.0912h58.6752l-88.2688-105.472z m0 0" p-id="23051" fill="#515151"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=plus.js.map