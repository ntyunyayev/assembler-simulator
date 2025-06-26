// Size in bytes
export const DEVICES = createDevices([
    { size: 512, name: "base" },
    { size: 2, name: "screen-mode" },
    { size: (32 * 32)*2, name: "screen" },
    { size: 2, name: "input" }
] as const);



/**
 * Creates an enhanced device configuration array with computed memory offsets.
 * 
 * This function takes an array of device objects and returns a hybrid array/object
 * that allows both indexed access (DEVICES[0]) and named access (DEVICES.deviceName).
 * Each device is enhanced with start() and end() methods that compute memory offsets
 * based on the cumulative sizes of all previous devices in the array.
 *
 **/
function createDevices<T extends readonly { size: number, name: string }[]>(devices: T) {
    // Create the mapped object with computed start/end methods
    const mapped = Object.fromEntries(
        devices.map((device, index) => {
            // Calculate cumulative size of all previous devices
            const startOffset = devices.slice(0, index).reduce((sum, d) => sum + d.size, 0);
            const enhancedDevice = {
                ...device,
                start: () => startOffset,
                end: () => startOffset + device.size
            };

            return [device.name, enhancedDevice];
        })
    ) as {
            [K in T[number]['name']]: Extract<T[number], { name: K }> & {
                start: () => number;
                end: () => number;
            }
        };

    // Create enhanced array with the methods added to each element
    const enhancedArray = devices.map((device, index) => {
        const startOffset = devices.slice(0, index).reduce((sum, d) => sum + d.size, 0);

        return {
            ...device,
            start: () => startOffset,
            end: () => startOffset + device.size
        };
    });

    return Object.assign(enhancedArray, mapped);
}
