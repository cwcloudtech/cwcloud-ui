function convertMarkdownLink(message) {
    const markdownRegex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)|\[\d+\]/g;
    if (markdownRegex.test(message)) {
        return message;
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const convertUrlsToMarkdown = (text) => text.replace(urlRegex, (url) => `[${url}](${url})`);
    const processedText = convertUrlsToMarkdown(message);
    return processedText;
}
export default convertMarkdownLink
