type QuestionsHandler<
	P extends AnyObject | undefined = undefined
> = App.Handler<P, Plugin.Questions>;

const initState: Plugin.InitStateHandler<Plugin.Questions> = (_, { data }) => {
	return {
		...data,
		example: '',
	};
};

export const handlers = { '@notes/INIT': initState };
