export default function injectStyles() {
  var style = document.createElement('style')

  style.innerHTML = `
        .paginated-table-container * {
          box-sizing: border-box;
        }

        .paginated-table-list-container dt {
          display: inline-block;
          font-family: monospace;
          width: 40%;
        }

        .paginated-table-list-container dd {
          display: inline-block;
          width: 50%;
        }

        .paginated-table-body tr:nth-child(odd),
        dl div:nth-child(odd) {
          background-color: #ebebeb;
        }

        .paginated-table-container {
          align-items: center;
          display: flex;
          flex-direction: column;
        }

        .paginated-table-container caption {
          display: none;
        }

        .paginated-table [aria-sort="none"] button:before {
          content: '↕';
        }

        .paginated-table [aria-sort="ascending"] button:before {
          content: '↑';
        }

        .paginated-table [aria-sort="descending"] button:before {
          content: '↓';
        }

        @media (max-width: 450px) {
          .paginated-table-container {
            display: none;
          }

          .paginated-table-list-container {
            display: block;
          }
        }

        @media (min-width: 450px) {
          .paginated-table-list-container {
            display: none;
          }
        }
    `

  document.body.appendChild(style)
}
