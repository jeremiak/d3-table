(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.d3Table = factory());
}(this, (function () { 'use strict';

  function addMobileListView(container, opts) {
    var listContainer = container.append("div").attr("class", "list-container");
    listContainer.append("h2").text(opts.caption);
    opts.data.forEach(function (d, i) {
      var row = listContainer.append("div");
      row.append("h3").text(d[opts.columns[0]]);
      var list = row.append("dl");
      opts.columns.forEach(function (c) {
        var div = list.append("div");
        div.append("dt").text(c);
        div.append("dd").text(d[c]);
      });
    });
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.innerHTML = "\n      * {\n          box-sizing: border-box;\n        }\n\n        dt {\n          display: inline-block;\n          font-family: monospace;\n          width: 40%;\n        }\n\n        dd {\n          display: inline-block;\n          width: 50%;\n        }\n\n        tbody tr:nth-child(odd),\n        dl div:nth-child(odd) {\n          background-color: #ebebeb;\n        }\n\n        .table-container {\n          align-items: center;\n          display: flex;\n          flex-direction: column;\n        }\n\n        .table-container caption {\n          display: none;\n        }\n\n        @media (max-width: 450px) {\n          .table-container {\n            display: none;\n          }\n\n          .list-container {\n            display: block;\n          }\n        }\n\n        @media (min-width: 450px) {\n          .list-container {\n            display: none;\n          }\n        }\n    ";
    document.body.appendChild(style);
  }

  function updateTablePage(container, opts) {
    var currentStartIndex = opts.currentPage * opts.pageLength;
    var currentStopIndex = currentStartIndex + opts.pageLength;
    container.selectAll("tbody tr").style("display", function (d, i) {
      if (i >= currentStartIndex && i < currentStopIndex) return "table-row";
      return "none";
    });
    container.select(".table-pagination span").text("Page ".concat(opts.currentPage + 1, " of ").concat(opts.pageCount));
  }

  function initializeD3DataTable(selector, opts) {
    injectStyles();
    var id = Math.floor(Math.random() * 1000);
    var captionId = "caption-".concat(id);
    var tableId = "table-".concat(id);
    var columns = opts.columns || Object.keys(opts.data[0]);
    var currentPage = 0;
    var pageLength = opts.pageLength || 5;
    var pageCount = Math.floor(opts.data.length / pageLength);
    var container = d3.select(selector);
    var tableContainer = container.append("div").classed("table-container", true);
    var table = tableContainer.append("table").attr("aria-live", "polite").attr("id", tableId).attr("role", "region").classed("table", true).style("width", "100%");
    container.attr("role", "group").attr("aria-labelledby", captionId).style("overflow-x", "auto");
    table.append("caption").attr("id", captionId).text(opts.caption);

    if (pageCount > 0) {
      tableContainer.append("div").attr("aria-controls", tableId).attr("class", "table-pagination").html(function () {
        return "\n          <button class=\"previous-page\" aria-label=\"Previous page of data\" disabled>&lt;&lt;</button>\n          <span></span>\n          <button class=\"next-page\" aria-label=\"Previous page of data\">&gt;&gt;</button>\n        ";
      });
    }

    table.append("thead").append("tr").selectAll("th").data(columns).enter().append("th").attr("role", "columnheader").attr("scope", "col").text(function (d) {
      return d;
    });
    var trs = table.append("tbody").selectAll("tr").data(opts.data).enter().append("tr");
    columns.forEach(function (column) {
      trs.append("td").text(function (d) {
        return d[column];
      });
    });
    var previousPageBtn = container.select("button.previous-page");
    var nextPageBtn = container.select(".next-page");
    previousPageBtn.on("click", function () {
      if (currentPage === 0) return;
      nextPageBtn.node().removeAttribute("disabled");
      currentPage = currentPage - 1;
      updateTablePage(container, {
        currentPage: currentPage,
        pageCount: pageCount,
        pageLength: pageLength
      });

      if (currentPage === 0) {
        previousPageBtn.attr("disabled", true);
        nextPageBtn.node().focus();
      }
    });
    nextPageBtn.on("click", function () {
      if (currentPage === pageCount - 1) return;
      previousPageBtn.node().removeAttribute("disabled");
      currentPage = currentPage + 1;
      updateTablePage(container, {
        currentPage: currentPage,
        pageCount: pageCount,
        pageLength: pageLength
      });

      if (currentPage === pageCount - 1) {
        nextPageBtn.attr("disabled", true);
        previousPageBtn.node().focus();
      }
    });

    if (!opts.disableMobileList) {
      addMobileListView(container, {
        caption: opts.caption,
        columns: columns,
        data: opts.data
      });
    }

    updateTablePage(container, {
      currentPage: currentPage,
      pageCount: pageCount,
      pageLength: pageLength
    });
  }

  return initializeD3DataTable;

})));
