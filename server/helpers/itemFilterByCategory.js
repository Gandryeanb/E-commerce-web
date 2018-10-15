const itemFilterByCategory = (query, itemsArr) => {

  let filteredItems = []


  itemsArr.forEach(item => {
    if (String(item.categoryId._id) === query) {
      filteredItems.push(item)
    }
  })

  return filteredItems
}

module.exports = itemFilterByCategory