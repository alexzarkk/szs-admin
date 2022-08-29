const svg = `
<svg t="1655130297774" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8257" width="28" height="28"><path d="M947.648 460.544L1024 512l-512 345.088L0 512l76.352-51.456L512 754.112l435.648-293.568zM59.52 631.04L512 928l452.48-296.96 59.52 40.96L512 1024l-512-352 59.52-40.96zM512 0l512 345.088-512 345.024-512-345.024L512 0z" fill="#2c2c2c" p-id="8258"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=plus.js.map