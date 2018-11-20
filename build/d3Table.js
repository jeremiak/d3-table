(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.d3Table = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function addMobileListView(container, opts) {
    var listContainer = container.append("div").attr("class", "paginated-table-list-container");
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
    style.innerHTML = "\n        .paginated-table-container * {\n          box-sizing: border-box;\n        }\n\n        .paginated-table-list-container dt {\n          display: inline-block;\n          font-family: monospace;\n          width: 40%;\n        }\n\n        .paginated-table-list-container dd {\n          display: inline-block;\n          width: 50%;\n        }\n\n        .paginated-table-body tr:nth-child(odd),\n        dl div:nth-child(odd) {\n          background-color: #ebebeb;\n        }\n\n        .paginated-table-container {\n          align-items: center;\n          display: flex;\n          flex-direction: column;\n        }\n\n        .paginated-table-container caption {\n          display: none;\n        }\n\n        .paginated-table [aria-sort=\"none\"] button:before {\n          content: '\u2195';\n        }\n\n        .paginated-table [aria-sort=\"ascending\"] button:before {\n          content: '\u2191';\n        }\n\n        .paginated-table [aria-sort=\"descending\"] button:before {\n          content: '\u2193';\n        }\n\n        @media (max-width: 450px) {\n          .paginated-table-container {\n            display: none;\n          }\n\n          .paginated-table-list-container {\n            display: block;\n          }\n        }\n\n        @media (min-width: 450px) {\n          .paginated-table-list-container {\n            display: none;\n          }\n        }\n    ";
    document.body.appendChild(style);
  }

  function updateTablePage(container, opts) {
    var currentStartIndex = opts.currentPage * opts.pageLength;
    var currentStopIndex = currentStartIndex + opts.pageLength;
    container.selectAll("tbody tr").style("display", function (d, i) {
      if (i >= currentStartIndex && i < currentStopIndex) return "table-row";
      return "none";
    });
    container.select(".paginationed-table-controls span").text("Page ".concat(opts.currentPage + 1, " of ").concat(opts.pageCount));
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
    var sortable = opts.sortable !== false;
    var container = d3.select(selector);
    var tableContainer = container.append("div").classed("paginated-table-container", true);
    var table = tableContainer.append("table").attr("aria-live", "polite").attr("id", tableId).attr("role", "region").classed("paginated-table", true).style("width", "100%");
    container.attr("role", "group").attr("aria-labelledby", captionId).style("overflow-x", "auto");
    table.append("caption").attr("id", captionId).text(opts.caption);

    if (pageCount > 0) {
      tableContainer.append("div").attr("aria-controls", tableId).attr("class", "paginationed-table-controls").html(function () {
        return "\n          <button class=\"previous-page\" aria-label=\"Previous page of data\" disabled>&lt;&lt;</button>\n          <span></span>\n          <button class=\"next-page\" aria-label=\"Previous page of data\">&gt;&gt;</button>\n        ";
      });
    }

    var ths = table.append("thead").append("tr").selectAll("th").data(columns).enter().append("th").attr("role", "columnheader").attr("scope", "col").text(function (d) {
      return d;
    });

    if (sortable) {
      ths.attr("aria-sort", "none");
      ths.append("button").attr("aria-label", function (d) {
        return "sort table by ".concat(d);
      }).attr("data-column", function (d) {
        return d;
      });
    }

    var trs = table.append("tbody").selectAll("tr").data(opts.data, function (d) {
      return d[columns[0]];
    }).enter().append("tr");
    columns.forEach(function (column, i) {
      var td = trs.append("td");
      if (i === 0) td.attr("scope", "row");
      td.text(function (d) {
        return d[column];
      });
    });
    var tableHeaderSortBtns = table.selectAll('th button');
    var previousPageBtn = container.select("button.previous-page");
    var nextPageBtn = container.select(".next-page");
    tableHeaderSortBtns.on('click', function () {
      var target = d3.select(d3.event.target);
      var parent = d3.select(target.node().parentNode);
      var sortKey = target.attr('data-column');
      var sortOrder = parent.attr('aria-sort');
      var nextOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
      var sortFactor = 1;

      if (sortOrder === 'ascending') {
        sortFactor = -1;
      }

      table.selectAll("th").attr("aria-sort", "none");
      target.attr('aria-label', "sort table by ".concat(sortKey, " in ").concat(nextOrder, " order"));
      parent.attr('aria-sort', nextOrder);
      table.select("tbody").selectAll("tr").data(opts.data, function (d) {
        return d[columns[0]];
      }).sort(function (a, b) {
        var keyType = _typeof(a[sortKey]);

        if (keyType == 'string') {
          var aKey = a[sortKey].toLowerCase();
          var bKey = b[sortKey].toLowerCase();
          if (aKey > bKey) return 1 * sortFactor;else if (aKey < bKey) return -1 * sortFactor;
          return 0;
        } else if (keyType === 'number') {
          return a[sortKey] - b[sortKey] * sortFactor;
        } else if (keyType === 'boolean') {
          if (sortOrder === 'ascending') return a[sortKey] < b[sortKey];else return a[sortKey] > b[sortKey];
        }
      });
      updateTablePage(container, {
        currentPage: 0,
        pageCount: pageCount,
        pageLength: pageLength
      });
    });
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
