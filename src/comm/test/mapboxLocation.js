const defaultOptions$3 = {
	showCompass: true,
	showZoom: true,
	visualizePitch: false
};

/**
 * A `NavigationControl` control contains zoom buttons and a compass.
 * Add this control to a map using {@link Map#addControl}.
 *
 * @implements {IControl}
 * @param {Object} [options]
 * @param {boolean} [options.showCompass=true] If `true` the compass button is included.
 * @param {boolean} [options.showZoom=true] If `true` the zoom-in and zoom-out buttons are included.
 * @param {boolean} [options.visualizePitch=false] If `true` the pitch is visualized by rotating X-axis of compass.
 * @example
 * const nav = new mapboxgl.NavigationControl();
 * map.addControl(nav, 'top-left');
 * @example
 * const nav = new mapboxgl.NavigationControl({
 *     visualizePitch: true
 * });
 * map.addControl(nav, 'bottom-right');
 * @see [Example: Display map navigation controls](https://www.mapbox.com/mapbox-gl-js/example/navigation/)
 * @see [Example: Add a third party vector tile source](https://www.mapbox.com/mapbox-gl-js/example/third-party/)
 */
class NavigationControl {









	constructor(options) {
		this.options = ref_properties.extend({}, defaultOptions$3, options);

		this._container = create$1('div', 'mapboxgl-ctrl mapboxgl-ctrl-group');
		this._container.addEventListener('contextmenu', (e) => e.preventDefault());

		if (this.options.showZoom) {
			ref_properties.bindAll([
				'_setButtonTitle',
				'_updateZoomButtons'
			], this);
			this._zoomInButton = this._createButton('mapboxgl-ctrl-zoom-in', (e) => {
				if (this._map) this._map.zoomIn({}, {
					originalEvent: e
				});
			});
			create$1('span', `mapboxgl-ctrl-icon`, this._zoomInButton).setAttribute('aria-hidden', 'true');
			this._zoomOutButton = this._createButton('mapboxgl-ctrl-zoom-out', (e) => {
				if (this._map) this._map.zoomOut({}, {
					originalEvent: e
				});
			});
			create$1('span', `mapboxgl-ctrl-icon`, this._zoomOutButton).setAttribute('aria-hidden', 'true');
		}
		if (this.options.showCompass) {
			ref_properties.bindAll([
				'_rotateCompassArrow'
			], this);
			this._compass = this._createButton('mapboxgl-ctrl-compass', (e) => {
				const map = this._map;
				if (!map) return;
				if (this.options.visualizePitch) {
					map.resetNorthPitch({}, {
						originalEvent: e
					});
				} else {
					map.resetNorth({}, {
						originalEvent: e
					});
				}
			});
			this._compassIcon = create$1('span', 'mapboxgl-ctrl-icon', this._compass);
			this._compassIcon.setAttribute('aria-hidden', 'true');
		}
	}

	_updateZoomButtons() {
		const map = this._map;
		if (!map) return;

		const zoom = map.getZoom();
		const isMax = zoom === map.getMaxZoom();
		const isMin = zoom === map.getMinZoom();
		this._zoomInButton.disabled = isMax;
		this._zoomOutButton.disabled = isMin;
		this._zoomInButton.setAttribute('aria-disabled', isMax.toString());
		this._zoomOutButton.setAttribute('aria-disabled', isMin.toString());
	}

	_rotateCompassArrow() {
		const map = this._map;
		if (!map) return;

		const rotate = this.options.visualizePitch ?
			`scale(${1 / Math.pow(Math.cos(map.transform.pitch * (Math.PI / 180)), 0.5)}) rotateX(${map.transform.pitch}deg) rotateZ(${map.transform.angle * (180 / Math.PI)}deg)` :
			`rotate(${map.transform.angle * (180 / Math.PI)}deg)`;

		map._requestDomTask(() => {
			if (this._compassIcon) {
				this._compassIcon.style.transform = rotate;
			}
		});
	}

	onAdd(map) {
		this._map = map;
		if (this.options.showZoom) {
			this._setButtonTitle(this._zoomInButton, 'ZoomIn');
			this._setButtonTitle(this._zoomOutButton, 'ZoomOut');
			map.on('zoom', this._updateZoomButtons);
			this._updateZoomButtons();
		}
		if (this.options.showCompass) {
			this._setButtonTitle(this._compass, 'ResetBearing');
			if (this.options.visualizePitch) {
				map.on('pitch', this._rotateCompassArrow);
			}
			map.on('rotate', this._rotateCompassArrow);
			this._rotateCompassArrow();
			this._handler = new MouseRotateWrapper(map, this._compass, this.options.visualizePitch);
		}
		return this._container;
	}

	onRemove() {
		const map = this._map;
		if (!map) return;
		this._container.remove();
		if (this.options.showZoom) {
			map.off('zoom', this._updateZoomButtons);
		}
		if (this.options.showCompass) {
			if (this.options.visualizePitch) {
				map.off('pitch', this._rotateCompassArrow);
			}
			map.off('rotate', this._rotateCompassArrow);
			if (this._handler) this._handler.off();
			this._handler = undefined;
		}
		this._map = undefined;
	}

	_createButton(className, fn) {
		const a = create$1('button', className, this._container);
		a.type = 'button';
		a.addEventListener('click', fn);
		return a;
	}

	_setButtonTitle(button, title) {
		if (!this._map) return;
		const str = this._map._getUIString(`NavigationControl.${title}`);
		button.setAttribute('aria-label', str);
		if (button.firstElementChild) button.firstElementChild.setAttribute('title', str);
	}
}

class MouseRotateWrapper {









	constructor(map, element, pitch = false) {
		this._clickTolerance = 10;
		this.element = element;
		this.mouseRotate = new MouseRotateHandler({
			clickTolerance: map.dragRotate._mouseRotate._clickTolerance
		});
		this.map = map;
		if (pitch) this.mousePitch = new MousePitchHandler({
			clickTolerance: map.dragRotate._mousePitch._clickTolerance
		});

		ref_properties.bindAll(['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend',
			'reset'], this);
		element.addEventListener('mousedown', this.mousedown);
		element.addEventListener('touchstart', this.touchstart, {
			passive: false
		});
		element.addEventListener('touchmove', this.touchmove);
		element.addEventListener('touchend', this.touchend);
		element.addEventListener('touchcancel', this.reset);
	}

	down(e, point) {
		this.mouseRotate.mousedown(e, point);
		if (this.mousePitch) this.mousePitch.mousedown(e, point);
		disableDrag();
	}

	move(e, point) {
		const map = this.map;
		const r = this.mouseRotate.mousemoveWindow(e, point);
		const delta = r && r.bearingDelta;
		if (delta) map.setBearing(map.getBearing() + delta);
		if (this.mousePitch) {
			const p = this.mousePitch.mousemoveWindow(e, point);
			const delta = p && p.pitchDelta;
			if (delta) map.setPitch(map.getPitch() + delta);
		}
	}

	off() {
		const element = this.element;
		element.removeEventListener('mousedown', this.mousedown);
		element.removeEventListener('touchstart', this.touchstart, {
			passive: false
		});
		element.removeEventListener('touchmove', this.touchmove);
		element.removeEventListener('touchend', this.touchend);
		element.removeEventListener('touchcancel', this.reset);
		this.offTemp();
	}

	offTemp() {
		enableDrag();
		ref_properties.window.removeEventListener('mousemove', this.mousemove);
		ref_properties.window.removeEventListener('mouseup', this.mouseup);
	}

	mousedown(e) {
		this.down(ref_properties.extend({}, e, {
			ctrlKey: true,
			preventDefault: () => e.preventDefault()
		}), mousePos(this.element, e));
		ref_properties.window.addEventListener('mousemove', this.mousemove);
		ref_properties.window.addEventListener('mouseup', this.mouseup);
	}

	mousemove(e) {
		this.move(e, mousePos(this.element, e));
	}

	mouseup(e) {
		this.mouseRotate.mouseupWindow(e);
		if (this.mousePitch) this.mousePitch.mouseupWindow(e);
		this.offTemp();
	}

	touchstart(e) {
		if (e.targetTouches.length !== 1) {
			this.reset();
		} else {
			this._startPos = this._lastPos = touchPos(this.element, e.targetTouches)[0];
			this.down((({
				type: 'mousedown',
				button: 0,
				ctrlKey: true,
				preventDefault: () => e.preventDefault()
			})), this._startPos);
		}
	}

	touchmove(e) {
		if (e.targetTouches.length !== 1) {
			this.reset();
		} else {
			this._lastPos = touchPos(this.element, e.targetTouches)[0];
			this.move((({
				preventDefault: () => e.preventDefault()
			})), this._lastPos);
		}
	}

	touchend(e) {
		if (e.targetTouches.length === 0 &&
			this._startPos &&
			this._lastPos &&
			this._startPos.dist(this._lastPos) < this._clickTolerance) {
			this.element.click();
		}
		this.reset();
	}

	reset() {
		this.mouseRotate.reset();
		if (this.mousePitch) this.mousePitch.reset();
		delete this._startPos;
		delete this._lastPos;
		this.offTemp();
	}
}

//      























const defaultOptions$2 = {
	positionOptions: {
		enableHighAccuracy: false,
		maximumAge: 0,
		timeout: 6000 /* 6 sec */
	},
	fitBoundsOptions: {
		maxZoom: 15
	},
	trackUserLocation: false,
	showAccuracyCircle: true,
	showUserLocation: true,
	showUserHeading: false
};

/**
 * A `GeolocateControl` control provides a button that uses the browser's geolocation
 * API to locate the user on the map.
 * Add this control to a map using {@link Map#addControl}.
 *
 * Not all browsers support geolocation,
 * and some users may disable the feature. Geolocation support for modern
 * browsers including Chrome requires sites to be served over HTTPS. If
 * geolocation support is not available, the GeolocateControl will show
 * as disabled.
 *
 * The [zoom level](https://docs.mapbox.com/help/glossary/zoom-level/) applied depends on the accuracy of the geolocation provided by the device.
 *
 * The GeolocateControl has two modes. If `trackUserLocation` is `false` (default) the control acts as a button, which when pressed will set the map's camera to target the user location. If the user moves, the map won't update. This is most suited for the desktop. If `trackUserLocation` is `true` the control acts as a toggle button that when active the user's location is actively monitored for changes. In this mode the GeolocateControl has three interaction states:
 * * active - The map's camera automatically updates as the user's location changes, keeping the location dot in the center. This is the initial state, and the state upon clicking the `GeolocateControl` button.
 * * passive - The user's location dot automatically updates, but the map's camera does not. Occurs upon the user initiating a map movement.
 * * disabled - Occurs if geolocation is not available, disabled, or denied.
 *
 * These interaction states can't be controlled programmatically. Instead, they are set based on user interactions.
 *
 * @implements {IControl}
 * @param {Object} [options]
 * @param {Object} [options.positionOptions={enableHighAccuracy: false, timeout: 6000}] A Geolocation API [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object.
 * @param {Object} [options.fitBoundsOptions={maxZoom: 15}] A {@link Map#fitBounds} options object to use when the map is panned and zoomed to the user's location. The default is to use a `maxZoom` of 15 to limit how far the map will zoom in for very accurate locations.
 * @param {Object} [options.trackUserLocation=false] If `true` the GeolocateControl becomes a toggle button and when active the map will receive updates to the user's location as it changes.
 * @param {Object} [options.showAccuracyCircle=true] By default, if `showUserLocation` is `true`, a transparent circle will be drawn around the user location indicating the accuracy (95% confidence level) of the user's location. Set to `false` to disable. Always disabled when `showUserLocation` is `false`.
 * @param {Object} [options.showUserLocation=true] By default a dot will be shown on the map at the user's location. Set to `false` to disable.
 * @param {Object} [options.showUserHeading=false] If `true` an arrow will be drawn next to the user location dot indicating the device's heading. This only has affect when `trackUserLocation` is `true`.
 * @param {Object} [options.geolocation=window.navigator.geolocation] `window.navigator.geolocation` by default; you can provide an object with the same shape to customize geolocation handling.
 *
 * @example
 * map.addControl(new mapboxgl.GeolocateControl({
 *     positionOptions: {
 *         enableHighAccuracy: true
 *     },
 *     trackUserLocation: true,
 *     showUserHeading: true
 * }));
 * @see [Example: Locate the user](https://www.mapbox.com/mapbox-gl-js/example/locate-user/)
 */
class GeolocateControl extends ref_properties.Evented {













	// set to true once the control has been setup







	constructor(options) {
		super();
		const geolocation = ref_properties.window.navigator.geolocation;
		this.options = ref_properties.extend({
			geolocation
		}, defaultOptions$2, options);

		ref_properties.bindAll([
			'_onSuccess',
			'_onError',
			'_onZoom',
			'_finish',
			'_setupUI',
			'_updateCamera',
			'_updateMarker',
			'_updateMarkerRotation',
			'_onDeviceOrientation'
		], this);

		this._updateMarkerRotationThrottled = throttle(this._updateMarkerRotation, 20);
		this._numberOfWatches = 0;
	}

	onAdd(map) {
		this._map = map;
		this._container = create$1('div', `mapboxgl-ctrl mapboxgl-ctrl-group`);
		this._checkGeolocationSupport(this._setupUI);
		return this._container;
	}

	onRemove() {
		// clear the geolocation watch if exists
		if (this._geolocationWatchID !== undefined) {
			this.options.geolocation.clearWatch(this._geolocationWatchID);
			this._geolocationWatchID = (undefined);
		}

		// clear the markers from the map
		if (this.options.showUserLocation && this._userLocationDotMarker) {
			this._userLocationDotMarker.remove();
		}
		if (this.options.showAccuracyCircle && this._accuracyCircleMarker) {
			this._accuracyCircleMarker.remove();
		}

		this._container.remove();
		this._map.off('zoom', this._onZoom);
		this._map = (undefined);
		this._numberOfWatches = 0;
		this._noTimeout = false;
	}

	_checkGeolocationSupport(callback) {
		if (this._supportsGeolocation !== undefined) {
			callback(this._supportsGeolocation);
		} else if (ref_properties.window.navigator.permissions !== undefined) {
			// navigator.permissions has incomplete browser support
			// http://caniuse.com/#feat=permissions-api
			// Test for the case where a browser disables Geolocation because of an
			// insecure origin
			ref_properties.window.navigator.permissions.query({
				name: 'geolocation'
			}).then((p) => {
				this._supportsGeolocation = p.state !== 'denied';
				callback(this._supportsGeolocation);
			});
		} else {
			this._supportsGeolocation = !!this.options.geolocation;
			callback(this._supportsGeolocation);
		}
	}

	/**
	 * Check if the Geolocation API Position is outside the map's maxbounds.
	 *
	 * @param {Position} position the Geolocation API Position
	 * @returns {boolean} Returns `true` if position is outside the map's maxbounds, otherwise returns `false`.
	 * @private
	 */
	_isOutOfMapMaxBounds(position) {
		const bounds = this._map.getMaxBounds();
		const coordinates = position.coords;

		return !!bounds && (
			coordinates.longitude < bounds.getWest() ||
			coordinates.longitude > bounds.getEast() ||
			coordinates.latitude < bounds.getSouth() ||
			coordinates.latitude > bounds.getNorth()
		);
	}

	_setErrorState() {
		switch (this._watchState) {
			case 'WAITING_ACTIVE':
				this._watchState = 'ACTIVE_ERROR';
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');
				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active-error');
				break;
			case 'ACTIVE_LOCK':
				this._watchState = 'ACTIVE_ERROR';
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');
				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active-error');
				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
				// turn marker grey
				break;
			case 'BACKGROUND':
				this._watchState = 'BACKGROUND_ERROR';
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background');
				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background-error');
				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
				// turn marker grey
				break;
			case 'ACTIVE_ERROR':
				break;
			default:
				ref_properties.assert_1(false, `Unexpected watchState ${this._watchState}`);
		}
	}

	/**
	 * When the Geolocation API returns a new location, update the GeolocateControl.
	 *
	 * @param {Position} position the Geolocation API Position
	 * @private
	 */
	_onSuccess(position) {
		if (!this._map) {
			// control has since been removed
			return;
		}

		if (this._isOutOfMapMaxBounds(position)) {
			this._setErrorState();

			this.fire(new ref_properties.Event('outofmaxbounds', position));
			this._updateMarker();
			this._finish();

			return;
		}

		if (this.options.trackUserLocation) {
			// keep a record of the position so that if the state is BACKGROUND and the user
			// clicks the button, we can move to ACTIVE_LOCK immediately without waiting for
			// watchPosition to trigger _onSuccess
			this._lastKnownPosition = position;

			switch (this._watchState) {
				case 'WAITING_ACTIVE':
				case 'ACTIVE_LOCK':
				case 'ACTIVE_ERROR':
					this._watchState = 'ACTIVE_LOCK';
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active-error');
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active');
					break;
				case 'BACKGROUND':
				case 'BACKGROUND_ERROR':
					this._watchState = 'BACKGROUND';
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background-error');
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background');
					break;
				default:
					ref_properties.assert_1(false, `Unexpected watchState ${this._watchState}`);
			}
		}

		// if showUserLocation and the watch state isn't off then update the marker location
		if (this.options.showUserLocation && this._watchState !== 'OFF') {
			this._updateMarker(position);
		}

		// if in normal mode (not watch mode), or if in watch mode and the state is active watch
		// then update the camera
		if (!this.options.trackUserLocation || this._watchState === 'ACTIVE_LOCK') {
			this._updateCamera(position);
		}

		if (this.options.showUserLocation) {
			this._dotElement.classList.remove('mapboxgl-user-location-dot-stale');
		}

		this.fire(new ref_properties.Event('geolocate', position));
		this._finish();
	}

	/**
	 * Update the camera location to center on the current position
	 *
	 * @param {Position} position the Geolocation API Position
	 * @private
	 */
	_updateCamera(position) {
		const center = new ref_properties.LngLat(position.coords.longitude, position.coords.latitude);
		const radius = position.coords.accuracy;
		const bearing = this._map.getBearing();
		const options = ref_properties.extend({
			bearing
		}, this.options.fitBoundsOptions);

		this._map.fitBounds(center.toBounds(radius), options, {
			geolocateSource: true // tag this camera change so it won't cause the control to change to background state
		});
	}

	/**
	 * Update the user location dot Marker to the current position
	 *
	 * @param {Position} [position] the Geolocation API Position
	 * @private
	 */
	_updateMarker(position) {
		if (position) {
			const center = new ref_properties.LngLat(position.coords.longitude, position.coords.latitude);
			this._accuracyCircleMarker.setLngLat(center).addTo(this._map);
			this._userLocationDotMarker.setLngLat(center).addTo(this._map);
			this._accuracy = position.coords.accuracy;
			if (this.options.showUserLocation && this.options.showAccuracyCircle) {
				this._updateCircleRadius();
			}
		} else {
			this._userLocationDotMarker.remove();
			this._accuracyCircleMarker.remove();
		}
	}

	_updateCircleRadius() {
		ref_properties.assert_1(this._circleElement);
		const map = this._map;
		const tr = map.transform;

		const pixelsPerMeter = ref_properties.mercatorZfromAltitude(1.0, tr._center.lat) * tr.worldSize;
		ref_properties.assert_1(pixelsPerMeter !== 0.0);
		const circleDiameter = Math.ceil(2.0 * this._accuracy * pixelsPerMeter);

		this._circleElement.style.width = `${circleDiameter}px`;
		this._circleElement.style.height = `${circleDiameter}px`;
	}

	_onZoom() {
		if (this.options.showUserLocation && this.options.showAccuracyCircle) {
			this._updateCircleRadius();
		}
	}

	/**
	 * Update the user location dot Marker rotation to the current heading
	 *
	 * @private
	 */
	_updateMarkerRotation() {
		if (this._userLocationDotMarker && typeof this._heading === 'number') {
			this._userLocationDotMarker.setRotation(this._heading);
			this._dotElement.classList.add('mapboxgl-user-location-show-heading');
		} else {
			this._dotElement.classList.remove('mapboxgl-user-location-show-heading');
			this._userLocationDotMarker.setRotation(0);
		}
	}

	_onError(error) {
		if (!this._map) {
			// control has since been removed
			return;
		}

		if (this.options.trackUserLocation) {
			if (error.code === 1) {
				// PERMISSION_DENIED
				this._watchState = 'OFF';
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-waiting');
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active-error');
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background');
				this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background-error');
				this._geolocateButton.disabled = true;
				const title = this._map._getUIString('GeolocateControl.LocationNotAvailable');
				this._geolocateButton.setAttribute('aria-label', title);
				if (this._geolocateButton.firstElementChild) this._geolocateButton.firstElementChild
					.setAttribute('title', title);

				if (this._geolocationWatchID !== undefined) {
					this._clearWatch();
				}
			} else if (error.code === 3 && this._noTimeout) {
				// this represents a forced error state
				// this was triggered to force immediate geolocation when a watch is already present
				// see https://github.com/mapbox/mapbox-gl-js/issues/8214
				// and https://w3c.github.io/geolocation-api/#example-5-forcing-the-user-agent-to-return-a-fresh-cached-position
				return;
			} else {
				this._setErrorState();
			}
		}

		if (this._watchState !== 'OFF' && this.options.showUserLocation) {
			this._dotElement.classList.add('mapboxgl-user-location-dot-stale');
		}

		this.fire(new ref_properties.Event('error', error));

		this._finish();
	}

	_finish() {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		this._timeoutId = undefined;
	}

	_setupUI(supported) {
		this._container.addEventListener('contextmenu', (e) => e.preventDefault());
		this._geolocateButton = create$1('button', `mapboxgl-ctrl-geolocate`, this._container);
		create$1('span', `mapboxgl-ctrl-icon`, this._geolocateButton).setAttribute('aria-hidden', 'true');

		this._geolocateButton.type = 'button';

		if (supported === false) {
			ref_properties.warnOnce(
				'Geolocation support is not available so the GeolocateControl will be disabled.');
			const title = this._map._getUIString('GeolocateControl.LocationNotAvailable');
			this._geolocateButton.disabled = true;
			this._geolocateButton.setAttribute('aria-label', title);
			if (this._geolocateButton.firstElementChild) this._geolocateButton.firstElementChild.setAttribute(
				'title', title);
		} else {
			const title = this._map._getUIString('GeolocateControl.FindMyLocation');
			this._geolocateButton.setAttribute('aria-label', title);
			if (this._geolocateButton.firstElementChild) this._geolocateButton.firstElementChild.setAttribute(
				'title', title);
		}

		if (this.options.trackUserLocation) {
			this._geolocateButton.setAttribute('aria-pressed', 'false');
			this._watchState = 'OFF';
		}

		// when showUserLocation is enabled, keep the Geolocate button disabled until the device location marker is setup on the map
		if (this.options.showUserLocation) {
			this._dotElement = create$1('div', 'mapboxgl-user-location');
			this._dotElement.appendChild(create$1('div', 'mapboxgl-user-location-dot'));
			this._dotElement.appendChild(create$1('div', 'mapboxgl-user-location-heading'));

			this._userLocationDotMarker = new Marker({
				element: this._dotElement,
				rotationAlignment: 'map',
				pitchAlignment: 'map'
			});

			this._circleElement = create$1('div', 'mapboxgl-user-location-accuracy-circle');
			this._accuracyCircleMarker = new Marker({
				element: this._circleElement,
				pitchAlignment: 'map'
			});

			if (this.options.trackUserLocation) this._watchState = 'OFF';

			this._map.on('zoom', this._onZoom);
		}

		this._geolocateButton.addEventListener('click',
			this.trigger.bind(this));

		this._setup = true;

		// when the camera is changed (and it's not as a result of the Geolocation Control) change
		// the watch mode to background watch, so that the marker is updated but not the camera.
		if (this.options.trackUserLocation) {
			this._map.on('movestart', (event) => {
				const fromResize = event.originalEvent && event.originalEvent.type === 'resize';
				if (!event.geolocateSource && this._watchState === 'ACTIVE_LOCK' && !fromResize) {
					this._watchState = 'BACKGROUND';
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');

					this.fire(new ref_properties.Event('trackuserlocationend'));
				}
			});
		}
	}

	/**
	 * Programmatically request and move the map to the user's location.
	 *
	 * @returns {boolean} Returns `false` if called before control was added to a map, otherwise returns `true`.
	 * Called on a deviceorientation event.
	 *
	 * @param deviceOrientationEvent {DeviceOrientationEvent}
	 * @private
	 * @example
	 * // Initialize the GeolocateControl.
	 * var geolocate = new mapboxgl.GeolocateControl({
	 *  positionOptions: {
	 *    enableHighAccuracy: true
	 *  },
	 *  trackUserLocation: true
	 * });
	 * // Add the control to the map.
	 * map.addControl(geolocate);
	 * map.on('load', function() {
	 *   geolocate.trigger();
	 * });
	 */
	_onDeviceOrientation(deviceOrientationEvent) {
		// absolute is true if the orientation data is provided as the difference between the Earth's coordinate frame and the device's coordinate frame, or false if the orientation data is being provided in reference to some arbitrary, device-determined coordinate frame.
		if (this._userLocationDotMarker) {
			if (deviceOrientationEvent.webkitCompassHeading) {
				// Safari
				this._heading = deviceOrientationEvent.webkitCompassHeading;
			} else if (deviceOrientationEvent.absolute === true) {
				// non-Safari alpha increases counter clockwise around the z axis
				this._heading = deviceOrientationEvent.alpha * -1;
			}
			this._updateMarkerRotationThrottled();
		}
	}

	/**
	 * Trigger a geolocation event.
	 *
	 * @example
	 * // Initialize the geolocate control.
	 * const geolocate = new mapboxgl.GeolocateControl({
	 *     positionOptions: {
	 *         enableHighAccuracy: true
	 *     },
	 *     trackUserLocation: true
	 * });
	 * // Add the control to the map.
	 * map.addControl(geolocate);
	 * map.on('load', () => {
	 *     geolocate.trigger();
	 * });
	 * @returns {boolean} Returns `false` if called before control was added to a map, otherwise returns `true`.
	 */
	trigger() {
		if (!this._setup) {
			ref_properties.warnOnce('Geolocate control triggered before added to a map');
			return false;
		}
		if (this.options.trackUserLocation) {
			// update watchState and do any outgoing state cleanup
			switch (this._watchState) {
				case 'OFF':
					// turn on the GeolocateControl
					this._watchState = 'WAITING_ACTIVE';

					this.fire(new ref_properties.Event('trackuserlocationstart'));
					break;
				case 'WAITING_ACTIVE':
				case 'ACTIVE_LOCK':
				case 'ACTIVE_ERROR':
				case 'BACKGROUND_ERROR':
					// turn off the Geolocate Control
					this._numberOfWatches--;
					this._noTimeout = false;
					this._watchState = 'OFF';
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active-error');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background');
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background-error');

					this.fire(new ref_properties.Event('trackuserlocationend'));
					break;
				case 'BACKGROUND':
					this._watchState = 'ACTIVE_LOCK';
					this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-background');
					// set camera to last known location
					if (this._lastKnownPosition) this._updateCamera(this._lastKnownPosition);

					this.fire(new ref_properties.Event('trackuserlocationstart'));
					break;
				default:
					ref_properties.assert_1(false, `Unexpected watchState ${this._watchState}`);
			}

			// incoming state setup
			switch (this._watchState) {
				case 'WAITING_ACTIVE':
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active');
					break;
				case 'ACTIVE_LOCK':
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active');
					break;
				case 'ACTIVE_ERROR':
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-active-error');
					break;
				case 'BACKGROUND':
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background');
					break;
				case 'BACKGROUND_ERROR':
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
					this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background-error');
					break;
				case 'OFF':
					break;
				default:
					ref_properties.assert_1(false, `Unexpected watchState ${this._watchState}`);
			}

			// manage geolocation.watchPosition / geolocation.clearWatch
			if (this._watchState === 'OFF' && this._geolocationWatchID !== undefined) {
				// clear watchPosition as we've changed to an OFF state
				this._clearWatch();
			} else if (this._geolocationWatchID === undefined) {
				// enable watchPosition since watchState is not OFF and there is no watchPosition already running

				this._geolocateButton.classList.add('mapboxgl-ctrl-geolocate-waiting');
				this._geolocateButton.setAttribute('aria-pressed', 'true');

				this._numberOfWatches++;
				let positionOptions;
				if (this._numberOfWatches > 1) {
					positionOptions = {
						maximumAge: 600000,
						timeout: 0
					};
					this._noTimeout = true;
				} else {
					positionOptions = this.options.positionOptions;
					this._noTimeout = false;
				}

				this._geolocationWatchID = this.options.geolocation.watchPosition(
					this._onSuccess, this._onError, positionOptions);

				if (this.options.showUserHeading) {
					this._addDeviceOrientationListener();
				}
			}
		} else {
			this.options.geolocation.getCurrentPosition(
				this._onSuccess, this._onError, this.options.positionOptions);

			// This timeout ensures that we still call finish() even if
			// the user declines to share their location in Firefox
			this._timeoutId = setTimeout(this._finish, 10000 /* 10sec */ );
		}

		return true;
	}

	_addDeviceOrientationListener() {
		const addListener = () => {
			if ('ondeviceorientationabsolute' in ref_properties.window) {
				ref_properties.window.addEventListener('deviceorientationabsolute', this
					._onDeviceOrientation);
			} else {
				ref_properties.window.addEventListener('deviceorientation', this._onDeviceOrientation);
			}
		};

		if (typeof ref_properties.window.DeviceMotionEvent !== "undefined" &&
			typeof ref_properties.window.DeviceMotionEvent.requestPermission === 'function') {
			// $FlowFixMe
			DeviceOrientationEvent.requestPermission()
				.then(response => {
					if (response === 'granted') {
						addListener();
					}
				})
				.catch(console.error);
		} else {
			addListener();
		}
	}

	_clearWatch() {
		this.options.geolocation.clearWatch(this._geolocationWatchID);

		ref_properties.window.removeEventListener('deviceorientation', this._onDeviceOrientation);
		ref_properties.window.removeEventListener('deviceorientationabsolute', this._onDeviceOrientation);

		this._geolocationWatchID = (undefined);
		this._geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-waiting');
		this._geolocateButton.setAttribute('aria-pressed', 'false');

		if (this.options.showUserLocation) {
			this._updateMarker(null);
		}
	}
}
