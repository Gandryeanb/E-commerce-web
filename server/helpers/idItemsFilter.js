const idItemsFilter = (items) => {
  let result = []

  items.forEach(item => {
    result.push(item.id)
  })
  return result
}

module.exports = idItemsFilter