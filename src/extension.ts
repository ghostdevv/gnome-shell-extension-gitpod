import {
	PopupMenuItem,
	PopupSubMenuMenuItem,
} from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { spawn } from 'resource:///org/gnome/shell/misc/util.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { getWorkspaces } from './lib/workspaces';
import { currentPath, hr } from './lib/utils';
import { gettext as _ } from 'gettext';
import Gio from 'gi://Gio';
import St from 'gi://St';

function nullIfEmpty(string: any): string | null {
	return typeof string == 'string' && string.trim().length > 0
		? string
		: null;
}

class Indicator {
	public button: any;

	constructor(settings: Gio.Settings) {
		// * Setup
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

		// todo refresh extension on change
		const accessToken = nullIfEmpty(settings.get_string('access-token'));

		// * Workspaces
		if (accessToken) {
			try {
				const workspacesMenu = new PopupSubMenuMenuItem(
					_('Workspaces'),
				);

				const workspaces = getWorkspaces(accessToken).result;

				for (const workspace of workspaces) {
					const item = new PopupMenuItem(workspace.workspaceId);

					item.connect('activate', () => {
						spawn([
							'xdg-open',
							`https://gitpod.io/start#${workspace.workspaceId}`,
						]);
					});

					workspacesMenu.menu.addMenuItem(item);
				}

				this.button.menu.addMenuItem(workspacesMenu);

				//* HR
				this.button.menu.addMenuItem(hr());
			} catch {
				// todo handle error, a notification maybe?
			}
		}

		// * gitpod.new
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

		this.indicator = new Indicator(this.getSettings());
		Main.panel.addToStatusArea(this.uuid, this.indicator.button);
	}

	disable() {
		Main.panel.remove_child(this.indicator.button);
		this.indicator.destroy();
	}
}
