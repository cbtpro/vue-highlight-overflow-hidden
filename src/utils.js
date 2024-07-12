

export const highlightFun = (name, searchKey, color = 'red', continuous = false) => {
  if (!name) return ''
  let newName = ''
  for (let k of name) {
    let keyword = ''
    for (let j of searchKey) {
      if (k === j) {
        // 相等时
        keyword = `<span style='color:${color}'>${j}</span>`
      } else if (k.toLowerCase() === j.toLowerCase()) {
        // 为大小写字母时
        keyword = `<span style='color:${color}'>${k}</span>`
      }
    }
    if (keyword) {
      newName += keyword
    } else if (continuous) {
      newName += `<span>${k}</span>` //11-24增加连续span标签包裹
    } else {
      newName += k
    }
  }
  return newName
}

// 转义特殊字符
function transSpecil(str) {
  if (!str) return ''
  return str.replace(/(\(|\)|\[|\]|\*|\.|\+|\?|\/|\\|\$|\^)/gi, function (s) {
    return '\\' + s
  })
}

/**
 * @description 搜索词高亮，根据后端返回匹配词高亮
 * @param {String} source
 * @param {Array} matchList
 *
 */
export const highlightByMatchList = (source, matchList, color = '#E36560', regFn) => {
  if (!Array.isArray(matchList) || matchList.length === 0) return source
  const strTemplate = (str) => {
    return `<span style='color:${color}'>${str}</span>`
  }
  const matchStr = matchList
    .map((str) => {
      return transSpecil(str)
    })
    .join('|')
  const reg = regFn ? regFn(matchStr) : new RegExp(matchStr, 'gi')
  const target = source.replace(reg, (match) => {
    return strTemplate(match)
  })
  return target
}

export function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  
  return function() {
    const context = this;
    const args = arguments;
    
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
export function debounce(func, wait) {
  let timeout;
  
  return function() {
    const context = this;
    const args = arguments;
    
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}
