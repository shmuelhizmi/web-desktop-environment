export async function timeoutAfter<T>(ms: number, promise: Promise<T>): Promise<{ timeout: boolean; value: T }> {
    const timeoutSymbol = Symbol("timeout");
    const timeout = new Promise<Symbol>((resolve) => {
        setTimeout(() => {
            resolve(timeoutSymbol);
        }, ms);
    });
    const value = await Promise.race(
        [
            promise,
            timeout
        ]
    );
    if (value === timeoutSymbol) {
        return {
            timeout: true,
            value: undefined as T,
        }
    }
    return {
        timeout: false,
        value: value as T,
    }
}