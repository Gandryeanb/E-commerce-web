const idItemsFilter = (items) => {
  let result = []

  items.forEach(item => {
    result.push({
      id: item.id,
      name: item.name,
      price: item.price,
      shopId: item.shopId
    })
  })
  return result
}

module.exports = idItemsFilter