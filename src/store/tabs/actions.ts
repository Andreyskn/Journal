export {};

type AddTab = Action<'@tabs/ADD_TAB', Tab['contentPath']>;
type SetActiveTab = Action<'@tabs/SET_ACTIVE_TAB', Tab['id']>;

declare global {
	type TabAction = AddTab | SetActiveTab;

	interface Dispatch {
		tabsAction(type: AddTab['type'], payload: AddTab['payload']): void;
		tabsAction(
			type: SetActiveTab['type'],
			payload: SetActiveTab['payload']
		): void;
	}
}
