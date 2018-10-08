const priceCalculator = (items) => {
  let sumPrice = 0

  items.forEach(itemsStack => {
    sumPrice += itemsStack[0].price * itemsStack.length
  })

  return sumPrice
}

module.exports = priceCalculator