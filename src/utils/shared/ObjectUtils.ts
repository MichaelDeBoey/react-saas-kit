export function updateItem(items: any[], setItems, id, itemAttributes, idProp = "id") {
  const index = items.findIndex((x) => x[idProp] === id);
  if (index !== -1) {
    setItems([...items.slice(0, index), Object.assign({}, items[index], itemAttributes), ...items.slice(index + 1)]);
  }
}

export function updateItemByIdx(items: any[], setItems, index, itemAttributes) {
  if (index !== -1) {
    setItems([...items.slice(0, index), Object.assign({}, items[index], itemAttributes), ...items.slice(index + 1)]);
  }
}
