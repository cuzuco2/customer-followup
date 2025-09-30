// AEM Block for Customer Tracker
// This will be loaded by AEM Edge Delivery Services

// Navigation functionality
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all links and pages
      navLinks.forEach((l) => l.classList.remove('active'));
      pages.forEach((p) => p.classList.remove('active'));

      // Add active class to clicked link and corresponding page
      this.classList.add('active');
      const targetPage = this.getAttribute('data-page');
      document.getElementById(targetPage).classList.add('active');
    });
  });

  // Initialize forms
  initializeForms();
});

// Initialize form event listeners
function initializeForms() {
  // Add customer form
  const customerForm = document.getElementById('customerForm');
  if (customerForm) {
    customerForm.addEventListener('submit', handleAddCustomer);
  }

  // Update customer form
  const updateForm = document.getElementById('updateForm');
  if (updateForm) {
    updateForm.addEventListener('submit', handleUpdateCustomer);
  }

  // Initialize autocomplete
  initializeAutocomplete();
}

// Initialize autocomplete functionality
function initializeAutocomplete() {
  // Update search field autocomplete
  const updateSearchInput = document.getElementById('updateSearchName');
  const updateSuggestions = document.getElementById('updateSearchSuggestions');
  if (updateSearchInput && updateSuggestions) {
    setupAutocomplete(updateSearchInput, updateSuggestions);
  }

  // Search field autocomplete
  const searchInput = document.getElementById('searchName');
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (searchInput && searchSuggestions) {
    setupAutocomplete(searchInput, searchSuggestions);
  }
}

// Setup autocomplete for a specific input field
function setupAutocomplete(input, suggestionsContainer) {
  let debounceTimer;

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    const query = this.value.trim();

    if (query.length < 1) {
      hideSuggestions(suggestionsContainer);
      return;
    }

    debounceTimer = setTimeout(() => {
      fetchSuggestions(query, suggestionsContainer);
    }, 300); // 300ms debounce
  });

  input.addEventListener('blur', function () {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => {
      hideSuggestions(suggestionsContainer);
    }, 200);
  });

  input.addEventListener('focus', function () {
    if (this.value.trim().length > 0) {
      fetchSuggestions(this.value.trim(), suggestionsContainer);
    }
  });
}

// Fetch suggestions from API
async function fetchSuggestions(query, container) {
  try {
    const response = await fetch(`/api/customers/search/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');

    const suggestions = await response.json();
    displaySuggestions(suggestions, container, query);
  } catch (error) {
    // Silently handle errors for autocomplete
    hideSuggestions(container);
  }
}

// Display suggestions in the container
function displaySuggestions(suggestions, container, query) {
  if (suggestions.length === 0) {
    hideSuggestions(container);
    return;
  }

  const suggestionsHTML = suggestions.map((suggestion) => {
    const highlightedName = highlightText(suggestion.name, query);
    return `
            <div class="suggestion-item" data-name="${suggestion.name}">
                <div class="suggestion-name">${highlightedName}</div>
                <div class="suggestion-details">
                    ${suggestion.imsorg ? `IMS: ${suggestion.imsorg}` : ''} 
                    ${suggestion.aemType ? `• ${suggestion.aemType}` : ''}
                </div>
            </div>
        `;
  }).join('');

  container.innerHTML = suggestionsHTML;
  container.classList.remove('hidden');

  // Add click handlers to suggestions
  container.querySelectorAll('.suggestion-item').forEach((item) => {
    item.addEventListener('click', function () {
      selectSuggestion(this, container.previousElementSibling, container);
    });
  });
}

// Highlight matching text in suggestions
function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
}

// Select a suggestion
function selectSuggestion(suggestionElement, input, container) {
  const customerName = suggestionElement.getAttribute('data-name');
  input.value = customerName;
  hideSuggestions(container);

  // Trigger search if we're on the search page
  if (input.id === 'searchName') {
    searchCustomer();
  }
}

// Hide suggestions
function hideSuggestions(container) {
  container.classList.add('hidden');
  container.innerHTML = '';
}

// Add new customer
async function handleAddCustomer(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const customerData = {
    customerName: formData.get('customerName'),
    imsorg: formData.get('imsorg'),
    aemType: formData.get('aemType'),
    contractSigned: formData.get('contractSigned') === 'on',
    autoOptimizationEnabled: formData.get('autoOptimizationEnabled') === 'on',
    issues: formData.get('issues')
  };

  try {
    // Submit to Google Sheets via AEM Edge Delivery
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add customer');
    }

    showMessage('Customer added successfully!', 'success');
    e.target.reset();
  } catch (error) {
    showMessage('Error adding customer: ' + error.message, 'error');
  }
}

// Search customer for update
async function searchCustomerForUpdate() {
  const customerName = document.getElementById('updateSearchName').value.trim();

  if (!customerName) {
    showMessage('Please enter a customer name', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(customerName)}`);

    if (!response.ok) {
      if (response.status === 404) {
        showMessage('Customer not found', 'error');
        return;
      }
      throw new Error('Failed to fetch customer');
    }

    const customer = await response.json();
    populateUpdateForm(customer);
    document.getElementById('updateCustomerForm').classList.remove('hidden');
  } catch (error) {
    showMessage('Error searching customer: ' + error.message, 'error');
  }
}

// Populate update form with customer data
function populateUpdateForm(customer) {
  document.getElementById('updateCustomerName').value = customer.customerName;
  document.getElementById('updateImsorg').value = customer.imsorg || '';
  document.getElementById('updateAemType').value = customer.aemType || '';
  document.getElementById('updateIssues').value = customer.issues || '';
  document.getElementById('updateContractSigned').checked = customer.contractSigned;
  document.getElementById('updateAutoOptimizationEnabled').checked = customer.autoOptimizationEnabled;
}

// Update customer
async function handleUpdateCustomer(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const customerName = formData.get('customerName');
  const updateData = {
    imsorg: formData.get('imsorg'),
    aemType: formData.get('aemType'),
    contractSigned: formData.get('contractSigned') === 'on',
    autoOptimizationEnabled: formData.get('autoOptimizationEnabled') === 'on',
    issues: formData.get('issues'),
    newUpdate: formData.get('newUpdate')
  };

  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(customerName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update customer');
    }

    showMessage('Customer updated successfully!', 'success');
    e.target.reset();
    document.getElementById('updateCustomerForm').classList.add('hidden');
  } catch (error) {
    showMessage('Error updating customer: ' + error.message, 'error');
  }
}

// Search customer
async function searchCustomer() {
  const customerName = document.getElementById('searchName').value.trim();

  if (!customerName) {
    showMessage('Please enter a customer name', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(customerName)}`);

    if (!response.ok) {
      if (response.status === 404) {
        document.getElementById('searchResults').innerHTML =
          '<div class="error">Customer not found</div>';
        return;
      }
      throw new Error('Failed to fetch customer');
    }

    const customer = await response.json();
    displayCustomerResult(customer);
  } catch (error) {
    document.getElementById('searchResults').innerHTML =
      '<div class="error">Error searching customer: ' + error.message + '</div>';
  }
}

// Display customer search result
function displayCustomerResult(customer) {
  const updates = customer.updates ? customer.updates.split('\n').filter((u) => u.trim()) : [];
  const sortedUpdates = updates.sort((a, b) => {
    const dateA = new Date(a.split(':')[0]);
    const dateB = new Date(b.split(':')[0]);
    return dateB - dateA; // Descending order (newest first)
  });

  const customerHTML = `
        <div class="customer-card">
            <div class="customer-info">
                <div class="info-item">
                    <div class="info-label">Customer Name</div>
                    <div class="info-value">${customer.customerName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">IMS Org</div>
                    <div class="info-value">${customer.imsorg || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">AEM Type</div>
                    <div class="info-value">
                        <span class="status-badge aem-type">${customer.aemType}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Contract Signed</div>
                    <div class="info-value">
                        <span class="status-badge ${customer.contractSigned ? 'status-true' : 'status-false'}">
                            ${customer.contractSigned ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Auto-optimization</div>
                    <div class="info-value">
                        <span class="status-badge ${customer.autoOptimizationEnabled ? 'status-true' : 'status-false'}">
                            ${customer.autoOptimizationEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </div>

            ${customer.issues ? `
                <div class="info-item">
                    <div class="info-label">Issues</div>
                    <div class="info-value">${customer.issues}</div>
                </div>
            ` : ''}

            <div class="updates-section">
                <div class="updates-title">Updates (Newest First)</div>
                <div class="updates-content">${sortedUpdates.join('\n') || 'No updates yet'}</div>
            </div>
        </div>
    `;

  document.getElementById('searchResults').innerHTML = customerHTML;
}

// Show message
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;

  const content = document.querySelector('.content');
  content.insertBefore(messageDiv, content.firstChild);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}