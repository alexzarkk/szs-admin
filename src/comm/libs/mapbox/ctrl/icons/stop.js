const svg = `
<svg t="1654924116280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24461" width="27" height="27"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM320 320v384h384V320H320z" fill="#595959" p-id="24462"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=inspect.js.map