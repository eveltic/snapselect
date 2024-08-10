
# SnapSelect

**SnapSelect** is a lightweight, customizable, and easy-to-use JavaScript plugin designed to enhance the functionality of HTML `<select>` elements. Inspired by popular select plugins like Select2, TomSelect, and Slim Select, SnapSelect offers a modern and sleek interface with advanced features, while remaining highly configurable and performant.

## Examples
### Multiple select
![image](https://github.com/user-attachments/assets/04e243d0-ab37-400e-b1f9-c2aadc0d3863)


### Non multiple select
![image](https://github.com/user-attachments/assets/cc55dcda-606e-4822-8bd8-8a7cceded4b9)


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
<link rel="stylesheet" href="/path/to/snapselect/dist/css/snapselect.min.css">
<script src="/path/to/snapselect/dist/js/snapselect.min.js"></script>
```
## Usage
Initialize SnapSelect on your desired `<select>` elements using any selector:
```html
<h3>Select without optgroups</h3>
<!-- Normal Select -->
<label for="selectNormal">Normal Select:</label>
<select id="selectNormal" name="selectNormal" class="snapSelect">
    <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
    <option value="AU" data-key="vegimite Canberra English">Australia</option>
    <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
    <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
    <option value="FR" data-key="croissant Paris French">France</option>
    <option value="IN" data-key="curry New Delhi Hindi">India</option>
    <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
    <option value="NG" data-key="jollof Abuja English">Nigeria</option>
    <option value="RU" data-key="borscht Moscow Russian">Russia</option>
    <option value="ZA" data-key="braai Pretoria English">South Africa</option>
    <option value="ES" data-key="paella Madrid Spanish">Spain</option>
    <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    <option value="US" data-key="hamburger Washington D.C. English">United States</option>
</select>
<!-- Multiple Select -->
<label for="selectMultiple">Multiple Select:</label>
<select id="selectMultiple" name="selectMultiple" multiple class="snapSelect">
    <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
    <option value="AU" data-key="vegimite Canberra English">Australia</option>
    <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
    <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
    <option value="FR" data-key="croissant Paris French">France</option>
    <option value="IN" data-key="curry New Delhi Hindi">India</option>
    <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
    <option value="NG" data-key="jollof Abuja English">Nigeria</option>
    <option value="RU" data-key="borscht Moscow Russian">Russia</option>
    <option value="ZA" data-key="braai Pretoria English">South Africa</option>
    <option value="ES" data-key="paella Madrid Spanish">Spain</option>
    <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    <option value="US" data-key="hamburger Washington D.C. English">United States</option>
</select>

<h3>Select with optgroups</h3>
<!-- Select with Optgroups -->
<label for="selectOptgroupNormal">Normal Select with Optgroups:</label>
<select id="selectOptgroupNormal" name="selectOptgroupNormal" class="snapSelect">
    <optgroup label="Africa">
        <option value="ZA" data-key="braai Pretoria English">South Africa</option>
        <option value="NG" data-key="jollof Abuja English">Nigeria</option>
        <option value="EG" data-key="koshari Cairo Arabic">Egypt</option>
    </optgroup>
    <optgroup label="Asia">
        <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
        <option value="IN" data-key="curry New Delhi Hindi">India</option>
        <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="FR" data-key="croissant Paris French">France</option>
        <option value="ES" data-key="paella Madrid Spanish">Spain</option>
        <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    </optgroup>
    <optgroup label="North America">
        <option value="US" data-key="hamburger Washington D.C. English">United States</option>
        <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
        <option value="CA" data-key="poutine Ottawa English">Canada</option>
    </optgroup>
    <optgroup label="South America">
        <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
        <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
        <option value="CO" data-key="arepa Bogotá Spanish">Colombia</option>
    </optgroup>
    <optgroup label="Oceania">
        <option value="AU" data-key="vegimite Canberra English">Australia</option>
        <option value="NZ" data-key="hangi Wellington English">New Zealand</option>
        <option value="FJ" data-key="kokoda Suva English">Fiji</option>
    </optgroup>
</select>

<!-- Multiple Select with Optgroups -->
<label for="selectOptgroupMultiple">Multiple Select with Optgroups and data attributes:</label>
<select id="selectOptgroupMultiple" name="selectOptgroupMultiple" multiple class="snapSelect"
    data-live-search="true" 
    data-placeholder="Choose an option" 
    data-max-selections="3"
    data-clear-all-button="true"
    data-select-optgroups="true"
    data-select-all-option="true"
    data-close-on-select="false"
    data-allow-empty="true">
    <optgroup label="Africa">
        <option value="ZA" data-key="braai Pretoria English">South Africa</option>
        <option value="NG" data-key="jollof Abuja English">Nigeria</option>
        <option value="EG" data-key="koshari Cairo Arabic">Egypt</option>
    </optgroup>
    <optgroup label="Asia">
        <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
        <option value="IN" data-key="curry New Delhi Hindi">India</option>
        <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="FR" data-key="croissant Paris French">France</option>
        <option value="ES" data-key="paella Madrid Spanish">Spain</option>
        <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    </optgroup>
    <optgroup label="North America">
        <option value="US" data-key="hamburger Washington D.C. English">United States</option>
        <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
        <option value="CA" data-key="poutine Ottawa English">Canada</option>
    </optgroup>
    <optgroup label="South America">
        <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
        <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
        <option value="CO" data-key="arepa Bogotá Spanish">Colombia</option>
    </optgroup>
    <optgroup label="Oceania">
        <option value="AU" data-key="vegimite Canberra English">Australia</option>
        <option value="NZ" data-key="hangi Wellington English">New Zealand</option>
        <option value="FJ" data-key="kokoda Suva English">Fiji</option>
    </optgroup>
</select>

<script>
    // Initialize SnapSelect on all select elements with the class 'snapSelect'
    document.addEventListener('DOMContentLoaded', () => {
        SnapSelect('.snapSelect', {
            liveSearch: true,
            placeholder: 'Select an option...',
            clearAllButton: true,
            selectOptgroups: true,
            selectAllOption: true,
            closeOnSelect: false,
            maxSelections: 10,
            allowEmpty: true
        });
    });
</script>
```

## Supported Data Attributes
-   `data-live-search="true|false"` (boolean): Enables or disables the search functionality.
-   `data-max-selections="number"` (number): Sets the maximum number of selections allowed.
-   `data-placeholder="text"` (string): Sets the placeholder text when no option is selected.
-   `data-clear-all-button="true|false"` (boolean): Shows or hides the "Clear All" button.
-   `data-select-optgroups="true|false"` (boolean): Allows or disallows selecting all options within an optgroup.
-   `data-select-all-option="true|false"` (boolean): Adds or removes the "Select All" option.
-   `data-close-on-select="true|false"` (boolean): Closes or keeps open the dropdown after selection.
-   `data-allow-empty="true|false"` (boolean): Allows or disallows deselection in single select mode.

## Configuration Options

-   `liveSearch` (boolean): Enable live search functionality. Default: `false`.
-   `maxSelections` (number): Maximum number of selections allowed (for multi-select). Default: `Infinity`.
-   `placeholder` (string): Custom placeholder text. Default: `'Select an option...'`.
-   `clearAllButton` (boolean): Show a "Clear All" button for multi-select. Default: `false`.
-   `selectOptgroups` (boolean): Allow selecting/deselecting all options within an optgroup. Default: `false`.
-   `selectAllOption` (boolean): Add a "Select All" option for multi-select. Default: `false`.
-   `closeOnSelect` (boolean): Close the dropdown after each selection (for multi-select). Default: `true`.
-   `allowEmpty` (boolean): Allow deselecting the current value (for single select). Default: `false`.

## Accessibility (ARIA)
SnapSelect is designed with accessibility in mind and includes ARIA attributes to enhance usability with assistive technologies.
-   The main container is set as role="combobox" with aria-expanded and aria-haspopup attributes.
-   The items container is set as role="listbox".
-   Selected items are dynamically updated with aria-live="polite" for screen reader notifications.

## Compatibility and Polyfills
SnapSelect includes polyfills to support older browsers:

-   `classList` Polyfill: Adds support for classList manipulation on elements.
-   `addEventListener` Polyfill: Adds support for addEventListener on elements.
These polyfills ensure that SnapSelect works across a wide range of browsers, including older versions of Internet Explorer.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or improvements.

## License
SnapSelect is released under the MIT License. See the LICENSE file for more details.
Feel free to use in any condition and modify all as you want.
