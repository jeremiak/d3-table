export default function addMobileListView(container, opts) {
  var listContainer = container.append("div").attr("class", "list-container")

  listContainer.append("h2").text(opts.caption)

  opts.data.forEach((d, i) => {
    var row = listContainer.append("div")
    row.append("h3").text(d[opts.columns[0]])
    var list = row.append("dl")

    opts.columns.forEach(c => {
      var div = list.append("div")

      div.append("dt").text(c)
      div.append("dd").text(d[c])
    })
  })
}
