const mockData = [
  { name: "Fake Name", age: 20, city: "Paris" },
  { name: "Cool person", age: 30, city: "Bakersfield" },
  { name: "Another fake person", age: 40, city: "Grand Rapids" },
  { name: "Testing test", age: 50, city: "Chattanooga" },
  { name: "Fifth and final", age: 10, city: "New York" }
]

describe("The table is paginated", function() {
  it("has aria-controls set up", function() {
    cy.visit("/test.html")

    cy.window().then(function(w) {
      w.render({
        columns: ['name', 'age', 'city'],
        data: mockData,
        pageLength: 2
      })
      cy.get("table.paginated-table").then(function(table) {
        const tableId = table.attr("id")

        cy.get(".paginationed-table-controls").then(function(controls) {
          const ariaControls = controls.attr("aria-controls")

          expect(tableId).to.equal(ariaControls)
        })
      })
    })
  })

  it("is on the first page", function() {
    cy.visit("/test.html")

    cy.window().then(function (w) {
      w.render({
        columns: ['name', 'age', 'city'],
        data: mockData,
        pageLength: 2
      })

      cy.get(".paginationed-table-controls .previous-page").then(function(btn) {
        const isDisabled = btn.attr("disabled")

        expect(!!isDisabled).to.equal(true)
      })

      cy.get(".paginationed-table-controls span").then(function(span) {
        const match = span.text().match(/^Page 1/)

        expect(!!match).to.equal(true)
      })
    })
  })

  it("moves to the next page when button is clicked", function() {
    cy.visit("/test.html")

    cy.window().then(function (w) {
      w.render({
        columns: ['name', 'age', 'city'],
        data: mockData,
        pageLength: 2
      })

      cy.get(".paginationed-table-controls .next-page")
        .click()
        .then(function() {
          cy.get(".paginationed-table-controls span").then(function(controls) {
            const match = controls.text().match(/^Page 2/)
            debugger
            expect(!!match).to.equal(true)
          })
        })
    })
  })
})

describe("The table is sortable", function() {
  it("works", function() {
    expect(true).to.equal(false)
  })
})
