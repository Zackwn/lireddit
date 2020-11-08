function filterTextArr(text: string[]) {
  return text.filter(el => el).filter(el => el.indexOf('\n') === -1).join(' ')
}

export const textToSippet = (text: string) => {
  let finalText: string
  if (text.length <= 60) {
    finalText = text
  } else {
    let textArr = text.split(' ')
    textArr.length = 10
    finalText = `${filterTextArr(textArr)}...`
  }
  return finalText
}