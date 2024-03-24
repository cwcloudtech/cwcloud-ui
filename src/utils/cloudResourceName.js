const cloudResourceName = (resource) => {
    return resource.hash ? `${resource.name}-${resource.hash}` : resource.name
}

export default cloudResourceName;
