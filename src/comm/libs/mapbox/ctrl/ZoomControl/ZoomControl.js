import Base from '../Base/Base';
import Button from '../Button/Button';
import iconPlus from '../icons/plus';
import iconMinus from '../icons/minus';
export default class ZoomControl extends Base {
    constructor() {
        super();
        this.zoomIn = new Button();
        this.zoomOut = new Button();
    }
    insert() {
        this.addClassName('mapbox-zoom');
        this.zoomIn.setIcon(iconPlus());
        this.zoomIn.onClick(() => this.map.setZoom(this.map.getZoom()+0.5));
        this.zoomOut.setIcon(iconMinus());
        this.zoomOut.onClick(() => this.map.setZoom(this.map.getZoom()-0.5));
        this.addButton(this.zoomIn);
        this.addButton(this.zoomOut);
    }
    onAddControl() {
        this.insert();
    }
}
//# sourceMappingURL=ZoomControl.js.map