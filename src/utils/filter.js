const filteredListWithoutRemovedElement = (id, list) => {
    const index = list.findIndex(elem => elem.id === id)
    const _list = [...list]
    _list.splice(index, 1)
    return _list
}

export default filteredListWithoutRemovedElement;
