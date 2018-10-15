const shopIdFilter = (shopIdArr) => {
  let result = []
  let tmp = []
  
  for (let i = 0; i < shopIdArr; i++) {
    if (tmp.length == 0) {
      tmp.push(shopIdArr[i])
    } else if (tmp[0] !== shopIdArr[i]) {
      result.push(tmp)
      tmp = []
      tmp.push(shopIdArr[i])
    } else {
      tmp.push(shopIdArr[i])
    }
  }
  result.push(tmp)
  // console.log(result)
  return result
}

module.exports = shopIdFilter