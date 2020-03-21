export {};

type AddTab = Action<'@tabs/ADD_TAB'>;

declare global {
	type TabAction = AddTab;

	interface Dispatch {
		tabsAction(type: AddTab['type']): AddTab;
	}
}
