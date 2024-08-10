
# SnapSelect

**SnapSelect** is a lightweight, customizable, and easy-to-use JavaScript plugin designed to enhance the functionality of HTML `<select>` elements. Inspired by popular select plugins like Select2, TomSelect, and Slim Select, SnapSelect offers a modern and sleek interface with advanced features, while remaining highly configurable and performant.

## Features

- **Live Search:** Enable users to quickly filter options as they type.
- **Multi-Select Support:** Allows for multiple selections with intuitive tag management.
- **Optgroup Selection:** Easily select or deselect all options within an optgroup.
- **Clear All Button:** Option to clear all selected options at once (for multi-select).
- **Select All Option:** Add a "Select All" option to quickly select all available options (for multi-select).
- **Customizable Placeholder:** Define custom placeholder text for an empty selection.
- **Custom Search Keywords:** Enhance search functionality with custom keywords for each option.
- **Bootstrap-Inspired Design:** Styled to seamlessly integrate with Bootstrap 5, but easily customizable to match any design system.
- **Accessible:** Built with accessibility in mind, ensuring a better experience for all users.
- **Lightweight:** Minimal footprint, optimized for performance.

## Installation

Include the SnapSelect JavaScript and CSS files in your project:
```html
<link rel="stylesheet" href="path/to/snapselect.css">
<script src="path/to/snapselect.js"></script>
```
## Usage
Initialize SnapSelect on your desired `<select>` elements using any selector:
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
    SnapSelect('.mySelector', {
        liveSearch: true,
        placeholder: 'Select an option...',
        clearAllButton: true,
        selectOptgroups: true,
        selectAllOption: true,
        closeOnSelect: false,
        maxSelections: 3,
        allowEmpty: true
    });
});
</script>
```

## Configuration Options

-   `liveSearch` (boolean): Enable live search functionality. Default: `false`.
-   `maxSelections` (number): Maximum number of selections allowed (for multi-select). Default: `Infinity`.
-   `placeholder` (string): Custom placeholder text. Default: `'Select an option...'`.
-   `clearAllButton` (boolean): Show a "Clear All" button for multi-select. Default: `false`.
-   `selectOptgroups` (boolean): Allow selecting/deselecting all options within an optgroup. Default: `false`.
-   `selectAllOption` (boolean): Add a "Select All" option for multi-select. Default: `false`.
-   `closeOnSelect` (boolean): Close the dropdown after each selection (for multi-select). Default: `true`.
-   `allowEmpty` (boolean): Allow deselecting the current value (for single select). Default: `false`.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or improvements.

## License
SnapSelect is released under the MIT License. See the LICENSE file for more details.
Feel free to use in any condition and modify all as you want.
