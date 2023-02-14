export function completeImagePath(fileName: string) {
    return `http://${location.hostname}:8000/file/${fileName}`
}