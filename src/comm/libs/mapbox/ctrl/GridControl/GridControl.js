import iconGridon from '../icons/gridon';
import iconGridoff from '../icons/gridoff';
import Base from '../Base/Base';
import Button from '../Button/Button';

export default class CompassControl extends Base {
    constructor(options) {
        super();
        this.gridon = new Button();
        this.gridoff = new Button();
    }
    insert() {
        this.gridon.addClassName('compass');
        this.gridoff.addClassName('compass');
        this.gridon.setIcon(iconGridon());
        this.gridoff.setIcon(iconGridoff());
		
		this.gridoff.node.style.display = 'none'
		
        this.gridon.onClick(() => {
			
			this.gridoff.node.style.display = ''
			this.gridon.node.style.display = 'none'
			this.map.ztsGrid = false
			
			window.mbAct({act:'onGrid'})
        });
		this.gridoff.onClick(() => {
			this.gridoff.node.style.display = 'none'
			this.gridon.node.style.display = ''
			this.map.ztsGrid = true
			
			window.mbAct({act:'onGrid'})
		});
		
        this.addButton(this.gridon);
        this.addButton(this.gridoff);
    }
    onAddControl() {
        this.insert()
    }
}
//# sourceMappingURL=CompassControl.js.map