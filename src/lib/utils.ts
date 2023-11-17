import { PopupSeparatorMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';

export function currentPath() {
	// ty https://github.com/pop-os/shell/blob/aafc9458a47a68c396933c637de00421f5198a2a/src/paths.ts#L2
	return import.meta.url.split('://')[1].split('/').slice(0, -1).join('/');
}

export function hr(text = ''): unknown {
	return new PopupSeparatorMenuItem(text);
}
