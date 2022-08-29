const svg = `
<svg t="1654927435632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10043" width="28" height="28"><path d="M843.904 783.573333 783.573333 843.904 512.042667 572.373333 240.512 843.904 180.181333 783.573333 451.712 512.042667 180.181333 240.512 240.512 180.181333 512.042667 451.712 783.573333 180.181333 843.904 240.512 572.373333 512.042667 843.904 783.573333Z" p-id="10044"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=plus.js.map