const shopIdItemsFilter = (items) => {
  let result = []
  
  for (let i = 0; i < items.length; i++) {
    result.push(items[i].shopId)
  }


  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (result[i] < result[j]) {
        let swap = result[i]
        result[i] = result[j]
        result[j] = swap
      }
    }
  }

  let fixed = []
  let tmp = []

  for (let i = 0; i < result.length; i++) {
    if (tmp.length == 0) {
      tmp.push(result[i])
    } else if (result[i] !== tmp[0]) {
      fixed.push(tmp)
      tmp = []
      tmp.push(result[i])
    }
  }
  fixed.push(tmp)

  return fixed
}

module.exports = shopIdItemsFilter