import Base from '../Base/Base'
import Button from '../Button/Button'
import iconLocation from '../icons/location'
import iLoading from '../icons/loading'
import { trans, getLocation } from '@/comm/geotools'
import { async } from 'regenerator-runtime'

export default class LocationControl extends Base {
    constructor() {
        super()
        this.loc = new Button()
    }
    insert() {
		this.loc.addClassName('compass')
		this.addClassName('mapbox-location')
		
        this.loc.setIcon(iconLocation())
        this.loc.onClick(async() => {
			if(this.map.play) return
			this.loc.node.childNodes[0].remove()
			this.loc.setIcon(iLoading())
			
			let p = await getLocation().finally(e=>{
				this.loc.node.childNodes[0].remove()
				this.loc.setIcon(iconLocation())
			})
			this.map.flyTo({center: this.map.sid=='amap'? trans(p.coord):p.coord, zoom:16})
		});
		
        this.addButton(this.loc)
    }
    onAddControl() {
        this.insert()
    }
}