describe("The table is paginated", function() {
  it("has aria-controls set up", function() {
    cy.visit("/example.html")

    cy.get("table.paginated-table").then(function(table) {
      const tableId = table.attr("id")
      cy.get(".paginationed-table-controls").then(function(controls) {
        const ariaControls = controls.attr("aria-controls")

        expect(tableId).to.equal(ariaControls)
      })
    })
  })

  it("is on the first page", function() {
    cy.visit("/example.html")

    cy.get(".paginationed-table-controls .previous-page").then(function(btn) {
      const isDisabled = btn.attr("disabled")

      expect(!!isDisabled).to.equal(true)
    })

    cy.get(".paginationed-table-controls span").then(function (span) {
      const match = span.text().match(/^Page 1/)

      expect(!!match).to.equal(true)
    })
  })

  it("moves to the next page when button is clicked", function() {
    cy.visit("/example.html")

    cy.get(".paginationed-table-controls .next-page")
      .click()
      .then(function() {
        cy.get(".paginationed-table-controls span").then(function(controls) {
          const match = controls.text().match(/^Page 2/)

          expect(!!match).to.equal(true)
        })
      })
  })
})

describe('The table is sortable', function() {
  it('works', function() {
    expect(true).to.equal(false)
  })
})