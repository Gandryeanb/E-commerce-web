const itemSorter = (itemsArr) =>{
  
  for (let i = 0; i < itemsArr.length; i++) {
    for (let j = 0; j < itemsArr.length; j++) {
      if (itemsArr[i].id < itemsArr[j].id) {
        let swapper = itemsArr[i]
        itemsArr[i] = itemsArr[j]
        itemsArr[j] = swapper
      }
    }
  }

  let result = []
  let newArr = []

  for (let i = 0; i < itemsArr.length; i++) {
    if (newArr.length == 0) {
      newArr.push(itemsArr[i])
    } else if (newArr[0].id !== itemsArr[i].id) {
      result.push(newArr)
      newArr = []
      newArr.push(itemsArr[i])
    } else {
      newArr.push(itemsArr[i])
    }
  }

  result.push(newArr)
  return result
}

module.exports = itemSorter