export default function injectStyles() {
  var style = document.createElement('style')

  style.innerHTML = `
        * {
          box-sizing: border-box;
        }

        dt {
          display: inline-block;
          font-family: monospace;
          width: 40%;
        }

        dd {
          display: inline-block;
          width: 50%;
        }

        tbody tr:nth-child(odd),
        dl div:nth-child(odd) {
          background-color: #ebebeb;
        }

        .table-container {
          align-items: center;
          display: flex;
          flex-direction: column;
        }

        .table-container caption {
          display: none;
        }

        thead button[aria-sort="none"]:before {
          content: '↕';
        }

        thead button[aria-sort="ascending"]:before {
          content: '↑';
        }

        thead button[aria-sort="descending"]:before {
          content: '↓';
        }

        @media (max-width: 450px) {
          .table-container {
            display: none;
          }

          .list-container {
            display: block;
          }
        }

        @media (min-width: 450px) {
          .list-container {
            display: none;
          }
        }
    `

  document.body.appendChild(style)
}
