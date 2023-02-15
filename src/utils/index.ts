export function completeImagePath(fileName: string) {
    // return `https://lyd11250-super-spoon-w4p4j9xv9j7h9gr6-8000.preview.app.github.dev/file/${fileName}`
    return `http://${location.hostname}:8000/file/${fileName}`
}