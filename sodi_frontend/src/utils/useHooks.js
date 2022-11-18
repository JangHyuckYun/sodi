import {useEffect, useRef, useState} from "react";


export function useDebounceValue(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useThrottleValue<T>(value: T, delay: number = 500) {
    const [throttleValue, setThrottleValue] = useState(value);
    const throttling = useRef(false);
    useEffect(() => {
        if (throttling.current === false) {
            setThrottleValue(value);
            throttling.current = true;
            setTimeout(() => {
                if (throttling?.current) throttling.current = false;
            }, delay);
        }
    }, [value, delay]);
    return throttleValue;
}
