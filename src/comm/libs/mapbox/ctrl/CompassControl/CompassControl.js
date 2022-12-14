import iconPointer from '../icons/pointer';
import Base from '../Base/Base';
import Button from '../Button/Button';
export default class CompassControl extends Base {
    constructor(options) {
        var _a;
        super();
        this.button = new Button();
        this.instant = (_a = options === null || options === void 0 ? void 0 : options.instant) !== null && _a !== void 0 ? _a : true;
        this.syncRotate = this.syncRotate.bind(this);
    }
    insert() {
		this.button.addClassName('compass');
        this.addClassName('mapbox-compass');
        if (!this.instant)
            this.node.hidden = true;
        this.button.setIcon(iconPointer());
        this.button.onClick(() => {
            this.map.easeTo({ bearing: 0, pitch: 0 });
        });
        this.addButton(this.button);
    }
    onAddControl() {
        this.insert();
        this.syncRotate();
        this.map.on('rotate', this.syncRotate);
    }
    syncRotate() {
        const angle = this.map.getBearing() * (-1);
        if (!this.instant) {
            this.node.hidden = angle === 0;
        }
        this.button.icon.style.transform = `rotate(${angle}deg)`;
    }
}
//# sourceMappingURL=CompassControl.js.map