export type GetTerms = TypeholeRootWrapper[];
interface TypeholeRootWrapper {
	id: string;
	name: Name;
	start_date: string;
	end_date: string;
	order_key: number;
	finish_date: string;
	is_active: boolean;
}
interface Name {
	pl: string;
	en: string;
}
