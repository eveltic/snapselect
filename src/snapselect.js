(function() {
    function SnapSelect(element, options = {}) {
        const select = element;
        const isMultiple = select.multiple;

        const config = {
            liveSearch: false,
            maxSelections: Infinity, // Only for multiple select
            placeholder: 'Select...',
            clearAllButton: false,  // Only for multiple select
            selectOptgroups: false, // Only for multiple select
            selectAllOption: false, // Only for multiple select
            closeOnSelect: true,    // Only for multiple select
            allowEmpty: false,      // Allow deselection for non-multiple select
            ...options
        };

        // Create the .snap-select container and move the select element inside it
        const customSelect = document.createElement('div');
        customSelect.classList.add('snap-select');
        select.parentNode.insertBefore(customSelect, select);
        customSelect.appendChild(select);

        const selectedContainer = document.createElement('div');
        selectedContainer.classList.add('snap-select-selected');
        customSelect.appendChild(selectedContainer);

        const tagContainer = document.createElement('div');
        tagContainer.classList.add('snap-select-tags');
        selectedContainer.appendChild(tagContainer);

        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('snap-select-items');
        customSelect.appendChild(itemsContainer);

        let searchInput, clearSearchButton;

        function populateItems() {
            itemsContainer.innerHTML = ''; // Clear previous items

            if (config.liveSearch && searchInput) {
                itemsContainer.appendChild(searchInput.parentElement); // Re-attach search input to the top
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
            itemsContainer.style.display = itemsContainer.style.display === 'block' ? 'none' : 'block';
            populateItems();
        });

        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                itemsContainer.style.display = 'none';
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
})();
