import { TabsHandlers } from './reducer';

declare global {
	type AddTab = Action<TabsHandlers, '@tabs/ADD_TAB'>;
	type SetActiveTab = Action<TabsHandlers, '@tabs/SET_ACTIVE_TAB'>;

	type TabAction = AddTab | SetActiveTab;
}
