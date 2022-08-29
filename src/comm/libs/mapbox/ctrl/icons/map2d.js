const svg = `
<svg t="1654566132027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32349" width="30" height="30"><path d="M782.4 139.7H539v306h335l-66-279.9c-3.6-15.6-13.9-26.1-25.6-26.1zM215.9 165.8l-66 279.9h335v-306H241.6c-11.7 0-22 10.5-25.7 26.1zM892.1 499.2H539v385.1h407.5c8.7 0 16.8-5.9 21.9-15.9 5.1-10 6.5-22.8 3.7-34.5l-80-334.7zM51.9 834c-2.8 11.6-1.4 24.5 3.7 34.5s13.3 15.9 21.9 15.9H485V499.2H132L51.9 834z" p-id="32350"></path></svg>
`
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=location.js.map