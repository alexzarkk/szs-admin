import Base from '../Base/Base';
import Button from '../Button/Button';
import iconFullscreen from '../icons/fullscreen';
import iconShrink from '../icons/shrink';

export default class FullscreenControl extends Base {
    constructor(full) {
        super()
        this.fullscreen = new Button()
		this.full = full||false
    }
    insert() {
		this.fullscreen.addClassName('square-btn')
        this.fullscreen.setIcon(this.full? iconShrink() : iconFullscreen())
        this.fullscreen.onClick(() => {
			// window.mbAct({act:'fullscreen', e: document.getElementById('mbContainer').style.height.replace('px','')})
			window.mbAct({act:'fullscreen', e: this.full})
		})
        this.addButton(this.fullscreen)
    }
    onAddControl() {
        this.insert()
    }
}