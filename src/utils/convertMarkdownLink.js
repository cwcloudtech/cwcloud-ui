function convertMarkdownLink(message) {
    const markdownRegex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)|\[\d+\]/g;
    if (markdownRegex.test(message)) {
        return message;
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const codeBlockRegex = /(```[\s\S]*?```|`[^`]*`)/g;
    const segments = message.split(codeBlockRegex);
    const convertUrlsToMarkdown = (text) => text.replace(urlRegex, (url) => `[${url}](${url})`);
    const processedSegments = segments.map(segment => {
        if (codeBlockRegex.test(segment)) {
            return segment;
        } else {
            return convertUrlsToMarkdown(segment);
        }
    });
    let result = processedSegments.join('');
    // Remove extra empty lines
    result = result.replace(/(\r?\n\s*\r?\n)+/g, '\n');
    // Remove extra spaces
    result = result.replace(/\s+/g, ' ').trim();
    return result;
}

export default convertMarkdownLink;
