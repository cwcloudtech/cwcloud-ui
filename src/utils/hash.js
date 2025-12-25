export const shortname = (name, hash) => {
    if (!name) {
        return '';
    }

    if (!hash) {
        const lastDashIndex = name.lastIndexOf('-');
        if (lastDashIndex !== -1) {
            return name.slice(0, lastDashIndex);
        }
        return name;
    }

    const hashWithDash = `-${hash}`;
    if (name.endsWith(hashWithDash)) {
        return name.slice(0, -hashWithDash.length);
    }

    return name;
}
