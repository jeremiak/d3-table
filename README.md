# Easy D3 tables

Idea sketch of a D3 helper library to make accessible, paginated tables easy. Lots of insights taken from [this piece by Heydon Pickering](https://inclusive-components.design/data-tables/). Depends on having `d3` on the page, though just for selections and data joins so should be compatible with v4 and v5.

Check out `example.html` to see it in action. Make sure to try dragging the window so that its really small to see the narrow viewport representation of the data using `<dl>`s.

## API

The `d3Table` function is attached to the `window` object, and it takes two arguments: `selector` and `options`.

`selector` should be a DOM selector string, will be the parent element of the table

`options` is an object with the following keys:
* `caption` (required) - Title of the table
* `data` (required) - Array of objects to be shown in the table
* `columns` (optional) - Array of strings, defaults to `Object.keys` of the first item in `data`
* `disableMobileList` (optional) - Boolean to prevent rendering data with a `<dl>` on small viewports. Use only if you have a really big table and are concerned with bloating the DOM
* `pageLength` (optional) - Number of table rows to show, defaults to 5
