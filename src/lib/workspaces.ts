import GLib from 'gi://GLib';
import Soup from 'gi://Soup';
import Gio from 'gi://Gio';

export function getWorkspaces(): WorkspaceFetchResponse {
	const session = Soup.Session.new();

	const message = Soup.Message.new(
		'POST',
		'https://api.gitpod.io/gitpod.experimental.v1.WorkspacesService/ListWorkspaces',
	);

	message.request_headers.append('Content-Type', 'application/json');
	message.request_headers.append('Authorization', 'Bearer TODO');

	const encoder = new TextEncoder();
	const body = encoder.encode(JSON.stringify({}));

	message.set_request_body_from_bytes(
		'application/json',
		GLib.Bytes.new(body),
	);

	const result = session.send_and_read(
		message,
		Gio.Cancellable.get_current(),
	);

	const decoder = new TextDecoder();
	const jsonBody = decoder.decode(result.get_data());

	return JSON.parse(jsonBody);
}

export interface WorkspaceFetchResponse {
	result: Workspace[];
}

export interface Workspace {
	workspaceId: string;
	ownerId: string;
	context: Context;
	description: string;
	status: Status;
}

export interface Context {
	contextUrl: string;
	git: Git;
}

export interface Git {
	normalizedContextUrl: string;
	repository: Repository;
}

export interface Repository {
	name: string;
	owner: string;
}

export interface Status {
	instance: Instance;
}

export interface Instance {
	instanceId: string;
	workspaceId: string;
	createdAt: string;
	status: Status2;
}

export interface Status2 {
	statusVersion: string;
	phase: string;
	conditions: Conditions;
	url: string;
	admission: string;
	recentFolders: string[];
	gitStatus: GitStatus;
	ports?: Port[];
}

export interface Conditions {
	timeout?: string;
	firstUserActivity?: string;
}

export interface GitStatus {
	branch: string;
	latestCommit?: string;
	unpushedCommits?: string[];
	totalUnpushedCommits?: number;
	untrackedFiles?: string[];
	totalUntrackedFiles?: number;
	uncommitedFiles?: string[];
	totalUncommitedFiles?: number;
}

export interface Port {
	port: string;
	policy: string;
	url: string;
	protocol: string;
}
