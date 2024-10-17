import React, { useEffect } from 'react';

export default function useDebounce(value: any, delay: number) {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
