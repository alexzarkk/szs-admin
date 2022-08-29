const svg = `
<svg t="1654919028713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29332" width="27" height="27"><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m189.952 537.6l-261.12 150.528c-17.92 10.24-39.936-2.56-39.936-23.04V364.032c0-20.48 22.528-33.28 39.936-23.04l261.12 150.528c17.92 10.24 17.92 35.84 0 46.08z" p-id="29333" fill="#515151"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=inspect.js.map