import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { PopupMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { spawn } from 'resource:///org/gnome/shell/misc/util.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { gettext as _ } from 'gettext';
import { currentPath } from './utils';
import Gio from 'gi://Gio';
import St from 'gi://St';

class Indicator {
	public button: any;

	constructor() {
		this.button = new Button(0.0, _('Gitpod Menu'));

		this.button.add_actor(
			//? Add the Gitpod icon to the button in the top bar
			new St.Icon({
				gicon: Gio.icon_new_for_string(
					`${currentPath()}/icons/gitpod.svg`,
				),
				style_class: 'system-status-icon',
			}),
		);

		const item = new PopupMenuItem(_('New Empty Workspace'));

		item.connect('activate', () => {
			spawn([
				'xdg-open',
				'https://gitpod.io/new?autostart=true#https://github.com/gitpod-io/empty',
			]);
		});

		this.button.menu.addMenuItem(item);
	}

	destroy() {
		this.button?.destroy();
	}
}

export default class GitpodExtension extends Extension {
	private indicator: Indicator | null = null;

	enable() {
		log(`enabling ${JSON.stringify(this.metadata, null, 2)}`);

		this.indicator = new Indicator();
		Main.panel.addToStatusArea(this.uuid, this.indicator.button);
	}

	disable() {
		Main.panel.remove_child(this.indicator.button);
		this.indicator.destroy();
	}
}
