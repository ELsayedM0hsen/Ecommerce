export const convertDataChart = (data, type) => {
  try {
    const object = {}
    Array.isArray(data) && data.forEach((opt) => {
      if (opt.orderStatus !== "Cancelled") {
        if (!object[opt[type]]) {
          object[opt[type]] = 1
        } else {
          object[opt[type]] += 1
        }
      }
    })
    const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
      return {
        name: item,
        value: object[item]
      }
    })

    return results
  } catch (e) {
    return []
  }
}