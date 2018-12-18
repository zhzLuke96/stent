function* range(start = 0, end = 0, step = 1) {
    if (start > end)[start, end] = [end, start]
    for (let i of Array(end - start).keys())yield i * step + start
}

module.exports = {
    range
}