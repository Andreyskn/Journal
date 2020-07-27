import { TabsHandlers } from './reducer';

declare global {
	type AddTab = Action<TabsHandlers, '@tabs/ADD_TAB'>;

	type TabAction = AddTab;
}
