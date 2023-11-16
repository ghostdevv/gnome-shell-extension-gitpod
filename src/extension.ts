import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { PopupMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { gettext as t } from 'gettext';
import GObject from 'gi://GObject';
import St from 'gi://St';

class CIndicator extends Button {
	constructor() {
		super(0.0, t('My Shiny Indicator'));
	}

	_init() {
		super._init(0.0, t('My Shiny Indicator'));

		this.add_child(
			new St.Icon({
				icon_name: 'face-smile-symbolic',
				style_class: 'system-status-icon',
			}),
		);

		let item = new PopupMenuItem(t('Show Notification'));

		item.connect('activate', () => {
			Main.notify(t('Hello World! :)'));
		});

		this.menu.addMenuItem(item);
	}
}

const Indicator = GObject.registerClass(CIndicator);

export default class HelloWorldExtension extends Extension {
	_indicator: CIndicator | null = null;

	enable() {
		log(`enabling ${JSON.stringify(this.metadata, null, 2)}`);
		this._indicator = new Indicator();
		Main.panel.addToStatusArea(this.uuid, this._indicator);
	}

	disable() {
		Main.panel.remove_child(this._indicator);
		this._indicator?.destroy();
		this._indicator = null;
	}
}
