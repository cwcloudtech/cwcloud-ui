const updateList = (list, elem) => {
    const _list = [...list]
    const index = list.findIndex(e => e.id === elem.id)
    _list[index] = { ...elem }
    return _list
}

export default updateList;
