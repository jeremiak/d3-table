export default function updateTablePage(container, opts) {
  var currentStartIndex = opts.currentPage * opts.pageLength
  var currentStopIndex = currentStartIndex + opts.pageLength

  container.selectAll("tbody tr").style("display", (d, i) => {
    if (i >= currentStartIndex && i < currentStopIndex) return "table-row"
    return "none"
  })
  container
    .select(".table-pagination span")
    .text(`Page ${opts.currentPage + 1} of ${opts.pageCount}`)
}
