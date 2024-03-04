export const getUniqueNamespaces = (list) => {
  const uniqueNamespaces = new Set();
  list.forEach((item) => {
    uniqueNamespaces.add(item.namespace);
  });

  return Array.from(uniqueNamespaces);
}
