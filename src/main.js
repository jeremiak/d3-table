import addMobileListView from "./mobileListView"
import injectStyles from "./styles"
import updateTablePage from './updatePagination'

export default function initializeD3DataTable(selector, opts) {
  injectStyles()

  var id = Math.floor(Math.random() * 1000)
  var captionId = `caption-${id}`
  var tableId = `table-${id}`
  var columns = opts.columns || Object.keys(opts.data[0])
  var currentPage = 0
  var pageLength = opts.pageLength || 5
  var pageCount = Math.floor(opts.data.length / pageLength)

  var container = d3.select(selector)
  var tableContainer = container.append("div").classed("table-container", true)

  var table = tableContainer
    .append("table")
    .attr("aria-live", "polite")
    .attr("id", tableId)
    .attr("role", "region")
    .classed("table", true)
    .style("width", "100%")

  container
    .attr("role", "group")
    .attr("aria-labelledby", captionId)
    .style("overflow-x", "auto")

  table
    .append("caption")
    .attr("id", captionId)
    .text(opts.caption)

  if (pageCount > 0) {
    tableContainer
      .append("div")
      .attr("aria-controls", tableId)
      .attr("class", "table-pagination")
      .html(
        () => `
          <button class="previous-page" aria-label="Previous page of data" disabled>&lt;&lt;</button>
          <span></span>
          <button class="next-page" aria-label="Previous page of data">&gt;&gt;</button>
        `
      )
  }

  table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .attr("role", "columnheader")
    .attr("scope", "col")
    .text(d => d)

  var trs = table
    .append("tbody")
    .selectAll("tr")
    .data(opts.data)
    .enter()
    .append("tr")

  columns.forEach(column => {
    trs.append("td").text(d => d[column])
  })

  var previousPageBtn = container.select("button.previous-page")
  var nextPageBtn = container.select(".next-page")

  previousPageBtn.on("click", () => {
    if (currentPage === 0) return

    nextPageBtn.node().removeAttribute("disabled")
    currentPage = currentPage - 1
    updateTablePage(container, {
      currentPage: currentPage,
      pageCount: pageCount,
      pageLength: pageLength
    })
    if (currentPage === 0) {
      previousPageBtn.attr("disabled", true)
      nextPageBtn.node().focus()
    }
  })

  nextPageBtn.on("click", () => {
    if (currentPage === pageCount - 1) return

    previousPageBtn.node().removeAttribute("disabled")
    currentPage = currentPage + 1
    updateTablePage(container, {
      currentPage: currentPage,
      pageCount: pageCount,
      pageLength: pageLength
    })
    if (currentPage === pageCount - 1) {
      nextPageBtn.attr("disabled", true)
      previousPageBtn.node().focus()
    }
  })

  if (!opts.disableMobileList) {
    addMobileListView(container, {
      caption: opts.caption,
      columns: columns,
      data: opts.data
    })
  }
  updateTablePage(container, {
    currentPage: currentPage,
    pageCount: pageCount,
    pageLength: pageLength
  })
}
