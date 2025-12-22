/**
 * Uploads a file.
 * @returns file content as a string
 */
export function uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.asm, .txt';
    input.click();

    return new Promise<string>((resolve, reject) => {
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    const content = await file.text();
                    resolve(content);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error("No file selected"));
            }
        };
    });
}

/**
 * Downloads the current content of the code editor as a file named "code.asm".
 * @param content the current content of the code editor
 */
export function downloadFile(content: string) {
    const blob = new Blob([content], { type: 'text/x-asm' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "code.asm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}