import { TabsHandlers } from './reducer';

declare global {
	namespace Actions {
		type AddTab = Store.Action<TabsHandlers, '@tabs/ADD_TAB'>;

		type TabAction = AddTab;
	}
}
