(function() {
  /**
   * SnapSelect - A custom select box plugin with various customization options.
   *
   * @param {HTMLElement} element - The select element to be enhanced.
   * @param {Object} options - An object containing configuration options.
   * 
   * Options:
   * - liveSearch (boolean): Enables search functionality within the dropdown.
   * - maxSelections (number): Limits the number of selections (for multiple select).
   * - placeholder (string): Placeholder text for the select box.
   * - clearAllButton (boolean): Shows a button to clear all selections (for multiple select).
   * - selectOptgroups (boolean): Allows selecting all options within an optgroup.
   * - selectAllOption (boolean): Adds a "Select All" option to the dropdown (for multiple select).
   * - closeOnSelect (boolean): Closes the dropdown after selecting an option.
   * - allowEmpty (boolean): Allows deselection of a selected option (for single select).
   *
   * Data Attributes:
   * - data-live-search="true|false": Enables or disables the search functionality.
   * - data-max-selections="number": Sets the maximum number of selections allowed.
   * - data-placeholder="text": Sets the placeholder text when no option is selected.
   * - data-clear-all-button="true|false": Shows or hides the "Clear All" button.
   * - data-select-optgroups="true|false": Allows or disallows selecting all options within an optgroup.
   * - data-select-all-option="true|false": Adds or removes the "Select All" option.
   * - data-close-on-select="true|false": Closes or keeps open the dropdown after selection.
   * - data-allow-empty="true|false": Allows or disallows deselection in single select mode.
   *
   * Example usage with JavaScript:
   * SnapSelect('#mySelect', {
   *     liveSearch: true,
   *     placeholder: 'Choose an option'
   * });
   * 
   * Example usage with data-attributes:
   * <select id="mySelect" 
   *         data-live-search="true" 
   *         data-placeholder="Choose an option" 
   *         data-max-selections="3">
   *     <option value="1">Option 1</option>
   *     <option value="2">Option 2</option>
   *     <option value="3">Option 3</option>
   *     <option value="4">Option 4</option>
   * </select>
   * 
   * <script>
   *     SnapSelect('#mySelect');
   * </script>
   */
    function SnapSelect(element, options = {}) {
        const select = element;
        const isMultiple = select.multiple;

        // Read options from data attributes
        const dataOptions = {
            liveSearch: select.hasAttribute('data-live-search') ? select.getAttribute('data-live-search') === 'true' : undefined,
            maxSelections: select.hasAttribute('data-max-selections') ? parseInt(select.getAttribute('data-max-selections')) : undefined,
            placeholder: select.hasAttribute('data-placeholder') ? select.getAttribute('data-placeholder') : undefined,
            clearAllButton: select.hasAttribute('data-clear-all-button') ? select.getAttribute('data-clear-all-button') === 'true' : undefined,
            selectOptgroups: select.hasAttribute('data-select-optgroups') ? select.getAttribute('data-select-optgroups') === 'true' : undefined,
            selectAllOption: select.hasAttribute('data-select-all-option') ? select.getAttribute('data-select-all-option') === 'true' : undefined,
            closeOnSelect: select.hasAttribute('data-close-on-select') ? select.getAttribute('data-close-on-select') === 'true' : undefined,
            allowEmpty: select.hasAttribute('data-allow-empty') ? select.getAttribute('data-allow-empty') === 'true' : undefined
        };

        // Combine default options, plugin default options, and user options
        const config = {
            liveSearch: dataOptions.liveSearch !== undefined ? dataOptions.liveSearch : (options.liveSearch !== undefined ? options.liveSearch : false),
            maxSelections: dataOptions.maxSelections !== undefined ? dataOptions.maxSelections : (options.maxSelections !== undefined ? options.maxSelections : Infinity),
            placeholder: dataOptions.placeholder !== undefined ? dataOptions.placeholder : (options.placeholder !== undefined ? options.placeholder : 'Select...'),
            clearAllButton: dataOptions.clearAllButton !== undefined ? dataOptions.clearAllButton : (options.clearAllButton !== undefined ? options.clearAllButton : false),
            selectOptgroups: dataOptions.selectOptgroups !== undefined ? dataOptions.selectOptgroups : (options.selectOptgroups !== undefined ? options.selectOptgroups : false),
            selectAllOption: dataOptions.selectAllOption !== undefined ? dataOptions.selectAllOption : (options.selectAllOption !== undefined ? options.selectAllOption : false),
            closeOnSelect: dataOptions.closeOnSelect !== undefined ? dataOptions.closeOnSelect : (options.closeOnSelect !== undefined ? options.closeOnSelect : true),
            allowEmpty: dataOptions.allowEmpty !== undefined ? dataOptions.allowEmpty : (options.allowEmpty !== undefined ? options.allowEmpty : false)
        };

        // Apply ARIA roles and attributes
        const customSelect = document.createElement('div');
        customSelect.classList.add('snap-select');
        customSelect.setAttribute('role', 'combobox');
        customSelect.setAttribute('aria-expanded', 'false');
        customSelect.setAttribute('aria-haspopup', 'listbox');
        select.parentNode.insertBefore(customSelect, select);
        customSelect.appendChild(select);

        const selectedContainer = document.createElement('div');
        selectedContainer.classList.add('snap-select-selected');
        selectedContainer.setAttribute('aria-live', 'polite');
        customSelect.appendChild(selectedContainer);

        const tagContainer = document.createElement('div');
        tagContainer.classList.add('snap-select-tags');
        selectedContainer.appendChild(tagContainer);

        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('snap-select-items');
        itemsContainer.setAttribute('role', 'listbox');
        customSelect.appendChild(itemsContainer);

        let searchInput, clearSearchButton;

        function populateItems() {
            itemsContainer.innerHTML = ''; // Clear previous items

            if (config.liveSearch && searchInput) {
                itemsContainer.appendChild(searchInput.parentElement); // Re-attach the search bar
            }

            if (isMultiple && config.selectAllOption) {
                const selectAllItem = document.createElement('div');
                selectAllItem.classList.add('snap-select-item', 'snap-select-all');
                selectAllItem.textContent = 'Select All';
                selectAllItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let addedCount = 0;
                    Array.from(select.options).forEach(option => {
                        if (!option.selected && select.selectedOptions.length < config.maxSelections) {
                            option.selected = true;
                            addedCount++;
                        }
                    });
                    if (addedCount > 0) {
                        updateTags();
                        updateVisibility();
                    }
                });
                itemsContainer.appendChild(selectAllItem);
            }

            Array.from(select.children).forEach(child => {
                if (child.tagName === 'OPTGROUP') {
                    const group = document.createElement('div');
                    group.classList.add('snap-select-optgroup');
                    const label = document.createElement('div');
                    label.classList.add('snap-select-optgroup-label');
                    label.textContent = child.label;
                    label.style.fontWeight = 'bold'; // Make the optgroup label bold

                    if (isMultiple && config.selectOptgroups) {
                        label.addEventListener('click', (e) => {
                            e.stopPropagation();
                            let addedCount = 0;
                            Array.from(child.children).forEach(option => {
                                if (select.selectedOptions.length < config.maxSelections && !option.selected) {
                                    option.selected = true;
                                    addedCount++;
                                }
                            });
                            if (addedCount > 0) {
                                updateTags();
                                updateVisibility();
                            }
                        });
                    }

                    group.appendChild(label);

                    Array.from(child.children).forEach(option => {
                        const item = document.createElement('div');
                        item.textContent = option.textContent;
                        item.dataset.value = option.value;
                        item.dataset.key = option.dataset.key || ''; // Capture keywords from data-key
                        item.classList.add('snap-select-item');

                        if (isMultiple && option.selected) {
                            item.style.display = 'none';
                        }

                        item.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (isMultiple) {
                                if (select.selectedOptions.length < config.maxSelections) {
                                    option.selected = true;
                                    updateTags();
                                    updateVisibility();
                                    if (config.closeOnSelect) {
                                        itemsContainer.style.display = 'none';
                                    }
                                }
                            } else {
                                select.value = option.value;
                                updateSingleSelect(option.textContent);
                                itemsContainer.style.display = 'none';
                            }
                        });

                        group.appendChild(item);
                    });

                    itemsContainer.appendChild(group);
                } else if (child.tagName === 'OPTION') {
                    const item = document.createElement('div');
                    item.textContent = child.textContent;
                    item.dataset.value = child.value;
                    item.dataset.key = child.dataset.key || ''; // Capture keywords from data-key
                    item.classList.add('snap-select-item');
                    item.dataset.optgroup = ''; // Mark as not belonging to an optgroup
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (isMultiple) {
                            if (select.selectedOptions.length < config.maxSelections) {
                                child.selected = true;
                                updateTags();
                                updateVisibility();
                                if (config.closeOnSelect) {
                                    itemsContainer.style.display = 'none';
                                }
                            }
                        } else {
                            select.value = child.value;
                            updateSingleSelect(child.textContent);
                            itemsContainer.style.display = 'none';
                        }
                    });

                    itemsContainer.appendChild(item);
                }
            });

            if (config.liveSearch && searchInput) {
                updateVisibility();
            }
        }

        function updateTags() {
            tagContainer.innerHTML = ''; // Clear existing tags

            const selectedOptions = Array.from(select.selectedOptions);
            if (selectedOptions.length === 0) {
                const placeholderElement = document.createElement('span');
                placeholderElement.classList.add('snap-select-placeholder');
                placeholderElement.textContent = config.placeholder;
                tagContainer.appendChild(placeholderElement);
            } else {
                selectedOptions.forEach(option => {
                    const tag = document.createElement('div');
                    tag.classList.add('snap-select-tag');
                    tag.textContent = option.textContent;
                    const removeButton = document.createElement('span');
                    removeButton.classList.add('snap-select-remove');
                    removeButton.textContent = '×';
                    removeButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        option.selected = false;
                        updateTags();
                        updateVisibility();
                    });
                    tag.appendChild(removeButton);
                    tagContainer.appendChild(tag);
                });
            }

            if (isMultiple && config.clearAllButton && selectedOptions.length > 0) {
                const clearAllButton = document.createElement('span');
                clearAllButton.classList.add('snap-select-clear-all');
                clearAllButton.textContent = '×';
                clearAllButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.querySelectorAll('option').forEach(option => option.selected = false);
                    updateTags();
                    updateVisibility();
                });
                tagContainer.appendChild(clearAllButton);
            }
        }

        function updateVisibility() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

            Array.from(itemsContainer.querySelectorAll('.snap-select-optgroup')).forEach(group => {
                let hasVisibleOption = false;

                Array.from(group.querySelectorAll('.snap-select-item')).forEach(item => {
                    const option = select.querySelector(`option[value="${item.dataset.value}"]`);
                    const keywords = item.dataset.key ? item.dataset.key.toLowerCase() : ''; // Capture keywords from data-key

                    if (option && option.selected) {
                        item.style.display = 'none';
                    } else if (item.textContent.toLowerCase().includes(searchTerm) || keywords.includes(searchTerm)) {
                        item.style.display = '';
                        hasVisibleOption = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (group.querySelector('.snap-select-optgroup-label').textContent.toLowerCase().includes(searchTerm) || hasVisibleOption) {
                    group.style.display = '';
                } else {
                    group.style.display = 'none';
                }
            });

            Array.from(itemsContainer.querySelectorAll('.snap-select-item')).forEach(item => {
                const option = select.querySelector(`option[value="${item.dataset.value}"]`);
                const keywords = item.dataset.key ? item.dataset.key.toLowerCase() : ''; // Capture keywords from data-key

                if (!item.dataset.optgroup && (option && option.selected)) {
                    item.style.display = 'none';
                } else if (!item.dataset.optgroup && (item.textContent.toLowerCase().includes(searchTerm) || keywords.includes(searchTerm))) {
                    item.style.display = '';
                } else if (!item.dataset.optgroup) {
                    item.style.display = 'none';
                }
            });
        }

        function updateSingleSelect(text) {
            tagContainer.innerHTML = '';
            const selectedText = document.createElement('div'); // Changed to div for inline-block styling
            selectedText.classList.add('snap-select-single-selected-text');
            selectedText.textContent = text;

            if (config.allowEmpty) {
                const removeButton = document.createElement('span');
                removeButton.classList.add('snap-select-clear-all'); // Using the same class as the "clear all" button
                removeButton.textContent = '×';
                removeButton.style.float = 'right'; // Align the button to the right
                removeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = ''; // Deselect the current value
                    updateSingleSelect(config.placeholder); // Show placeholder
                });
                selectedText.appendChild(removeButton);
                selectedText.style.display = 'inline-block'; // Ensure content is inline
                selectedText.style.width = 'calc(100% - 4px)'; // Ensure text doesn't collide with the "X"
            }

            tagContainer.appendChild(selectedText);
        }

        if (config.liveSearch) {
            const searchWrapper = document.createElement('div');
            searchWrapper.classList.add('snap-select-search-wrapper');
            itemsContainer.appendChild(searchWrapper);

            searchInput = document.createElement('input');
            searchInput.classList.add('snap-select-search');
            searchInput.setAttribute('placeholder', 'Search...');
            searchWrapper.appendChild(searchInput);

            clearSearchButton = document.createElement('span');
            clearSearchButton.classList.add('snap-select-clear-search');
            clearSearchButton.textContent = '×';
            clearSearchButton.style.display = 'none';
            clearSearchButton.addEventListener('click', () => {
                searchInput.value = '';
                clearSearchButton.style.display = 'none';
                updateVisibility();
            });
            searchWrapper.appendChild(clearSearchButton);

            searchInput.addEventListener('input', () => {
                clearSearchButton.style.display = searchInput.value ? 'inline' : 'none';
                updateVisibility();
            });
        }

        selectedContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = itemsContainer.style.display === 'block';
            customSelect.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
            itemsContainer.style.display = isExpanded ? 'none' : 'block';
            populateItems();
        });

        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                itemsContainer.style.display = 'none';
                customSelect.setAttribute('aria-expanded', 'false');
            }
        });

        if (isMultiple) {
            updateTags();
        } else {
            const selectedOption = select.querySelector('option:checked');
            if (selectedOption) {
                updateSingleSelect(selectedOption.textContent);
            } else {
                updateSingleSelect(config.placeholder);
            }
        }
    }

    window.SnapSelect = function(selector, options) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            new SnapSelect(element, options);
        });
    };
    
    // Export SnapSelect for module environments (Node.js, Webpack, etc.)
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = SnapSelect;
    }
})();

// Polyfill for classList
if (!("classList" in document.createElement("_"))) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.className.split(/\s+/),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                };
            }

            return {
                add: update(function(classes, index, value) {
                    ~index || classes.push(value);
                }),
                remove: update(function(classes, index) {
                    ~index && classes.splice(index, 1);
                }),
                toggle: update(function(classes, index, value) {
                    ~index ? classes.splice(index, 1) : classes.push(value);
                }),
                contains: function(value) {
                    return !!~self.className.split(/\s+/).indexOf(value);
                }
            };
        }
    });
}

// Polyfill for addEventListener
(function() {
    if (!Element.prototype.addEventListener) {
        var eventListeners = [];

        var addEventListener = function(type, listener /*, useCapture (will be ignored) */) {
            var self = this;
            var wrapper = function(e) {
                e.target = e.srcElement;
                e.currentTarget = self;
                if (listener.handleEvent) {
                    listener.handleEvent(e);
                } else {
                    listener.call(self, e);
                }
            };
            if (type == "DOMContentLoaded") {
                var wrapper2 = function(e) {
                    if (document.readyState == "complete") {
                        wrapper(e);
                    }
                };
                document.attachEvent("onreadystatechange", wrapper2);
                eventListeners.push({ object: this, type: type, listener: listener, wrapper: wrapper2 });

                if (document.readyState == "complete") {
                    var e = new Event();
                    e.srcElement = window;
                    wrapper2(e);
                }
            } else {
                this.attachEvent("on" + type, wrapper);
                eventListeners.push({ object: this, type: type, listener: listener, wrapper: wrapper });
            }
        };
        var removeEventListener = function(type, listener /*, useCapture (will be ignored) */) {
            var counter = 0;
            while (counter < eventListeners.length) {
                var eventListener = eventListeners[counter];
                if (eventListener.object == this && eventListener.type == type && eventListener.listener == listener) {
                    if (type == "DOMContentLoaded") {
                        this.detachEvent("onreadystatechange", eventListener.wrapper);
                    } else {
                        this.detachEvent("on" + type, eventListener.wrapper);
                    }
                    eventListeners.splice(counter, 1);
                    break;
                }
                ++counter;
            }
        };
        Element.prototype.addEventListener = addEventListener;
        Element.prototype.removeEventListener = removeEventListener;
        if (HTMLDocument) {
            HTMLDocument.prototype.addEventListener = addEventListener;
            HTMLDocument.prototype.removeEventListener = removeEventListener;
        }
        if (Window) {
            Window.prototype.addEventListener = addEventListener;
            Window.prototype.removeEventListener = removeEventListener;
        }
    }
})();
