import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { gettext as _ } from 'gettext';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

export default class ExamplePreferences extends ExtensionPreferences {
	fillPreferencesWindow(window) {
		const page = new Adw.PreferencesPage({
			title: _('Settings'),
			icon_name: 'dialog-information-symbolic',
		});

		window.add(page);

		const group = new Adw.PreferencesGroup({
			title: _('Access'),
			description: _('Configure access to Gitpod'),
		});

		page.add(group);

		// Create a new preferences row
		const row = new Adw.PasswordEntryRow({
			title: _('Access Token'),
		});

		group.add(row);

		window._settings = this.getSettings();

		window._settings.bind(
			'access-token',
			row,
			'text',
			Gio.SettingsBindFlags.DEFAULT,
		);
	}
}
