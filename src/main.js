import addMobileListView from "./mobileListView"
import injectStyles from "./styles"
import updateTablePage from './updatePagination'

export default function initializeD3DataTable(selector, opts) {
  injectStyles()

  const id = Math.floor(Math.random() * 1000)
  const captionId = `caption-${id}`
  const tableId = `table-${id}`
  const columns = opts.columns || Object.keys(opts.data[0])
  let currentPage = 0
  const pageLength = opts.pageLength || 5
  const pageCount = Math.floor(opts.data.length / pageLength)
  const sortable = opts.sortable !== false

  const container = d3.select(selector)
  const tableContainer = container.append("div").classed("table-container", true)

  const table = tableContainer
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

  var ths = table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .attr("role", "columnheader")
    .attr("scope", "col")
    .text(d => d)

  if (sortable) {
    ths.append("button")
      .attr("aria-label", d => (
        `sort table by ${d}`
      ))
      .attr("aria-sort", "none")
      .attr("data-column", d => d)
  }

  const trs = table
    .append("tbody")
    .selectAll("tr")
    .data(opts.data, d => d[columns[0]])
    .enter()
    .append("tr")

  columns.forEach((column, i) => {
    const td = trs.append("td")
    if (i === 0) td.attr("scope", "row")
    td.text(d => d[column])
  })

  const tableHeaderSortBtns = table.selectAll('th button')
  const previousPageBtn = container.select("button.previous-page")
  const nextPageBtn = container.select(".next-page")

  tableHeaderSortBtns.on('click', () => {
    const target = d3.select(d3.event.target)
    const sortKey = target.attr('data-column')
    const sortOrder = target.attr('aria-sort')
    const nextOrder = sortOrder === 'ascending' ? 'descending' : 'ascending'
    let sortFactor = 1

    if (sortOrder === 'ascending') {
      sortFactor = -1
    }

    table
      .select("thead")
      .selectAll("button")
      .attr("aria-sort", "none")

    target.attr('aria-label', `sort table by ${sortKey} in ${nextOrder} order`)
    target.attr('aria-sort', nextOrder)

    table
      .select("tbody")
      .selectAll("tr")
      .data(opts.data, d => d[columns[0]])
      .sort((a, b) => {
        const keyType = typeof a[sortKey]
        if (keyType == 'string') {
          const aKey = a[sortKey].toLowerCase()
          const bKey = b[sortKey].toLowerCase()
          if (aKey > bKey) return 1 * sortFactor
          else if (aKey < bKey) return -1 * sortFactor
          return 0
        } else if (keyType === 'number') {
          return a[sortKey] - (b[sortKey] * sortFactor)
        } else if (keyType === 'boolean') {
          if (sortOrder === 'ascending') return a[sortKey] < b[sortKey]
          else return a[sortKey] > b[sortKey]
        }
      })

    updateTablePage(container, {
      currentPage: 0,
      pageCount: pageCount,
      pageLength: pageLength
    })
  })

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
