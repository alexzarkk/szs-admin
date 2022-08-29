const svg = `
<svg t="1654918828032" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23296" width="32" height="32"><path d="M971.3664 418.304L606.3104 207.9744 244.224 418.304l161.792 93.0816-161.792 94.8224 364.4416 210.432L971.3664 606.208 808.96 511.3856zM608.6656 580.7104L326.5536 418.304l279.7568-161.792 280.8832 162.4064zM167.7312 333.6192h-59.2896V542.72H49.7664l88.3712 105.472L226.4064 542.72h-58.6752z m0 0" p-id="23297" fill="#515151"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=plus.js.map