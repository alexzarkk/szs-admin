const svg = `
<svg t="1654411733080" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8201" width="30" height="30"><path d="M961.3 470h-65.4c-19.8-178.7-161.6-320.6-340.3-340.3V64.3h-85.7v65.4C291.2 149.5 149.3 291.3 129.6 470H64.2v85.7h65.4C149.3 734.4 291.2 876.3 469.9 896v65.4h85.7V896c178.7-19.8 320.6-161.6 340.3-340.3h65.4V470zM512.7 825.5c-172.7 0-312.6-139.9-312.6-312.6v-0.1c0-172.6 140-312.6 312.6-312.6 172.6 0 312.6 139.9 312.6 312.6v0.1c0.1 172.7-139.9 312.6-312.6 312.6z" fill="#2c2c2c" p-id="8202"></path><path d="M512.7 512.9m-171.3 0a171.3 171.3 0 1 0 342.6 0 171.3 171.3 0 1 0-342.6 0Z" fill="#2c2c2c" p-id="8203"></path></svg>`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=location.js.map