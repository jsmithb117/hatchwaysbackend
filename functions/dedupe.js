module.exports = (sorted) => (
  sorted.filter(
    (val, index, self) =>
      self.findIndex((inner) => inner.id === val.id) === index
  )
)