// AEM Block for Customer Tracker
// This will be loaded by AEM Edge Delivery Services

// All function declarations first
function hideSuggestions(container) {
  container.classList.add('hidden');
  container.innerHTML = '';
}

function fetchSuggestions(query, container) {
  return fetch('/api/customers/search/suggestions?q=' + encodeURIComponent(query))
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    })
    .then(function (suggestions) {
      displaySuggestions(suggestions, container, query);
    })
    .catch(function (error) {
      hideSuggestions(container);
    });
}

function displaySuggestions(suggestions, container, query) {
  if (suggestions.length === 0) {
    hideSuggestions(container);
    return;
  }

  var suggestionsHTML = suggestions.map(function (suggestion) {
    var highlightedName = highlightText(suggestion.name, query);
    return '<div class="suggestion-item" data-name="' + suggestion.name + '">' +
      '<div class="suggestion-name">' + highlightedName + '</div>' +
      '<div class="suggestion-details">' +
      (suggestion.imsorg ? 'IMS: ' + suggestion.imsorg : '') +
      (suggestion.aemType ? ' • ' + suggestion.aemType : '') +
      '</div></div>';
  }).join('');

  container.innerHTML = suggestionsHTML;
  container.classList.remove('hidden');

  container.querySelectorAll('.suggestion-item').forEach(function (item) {
    item.addEventListener('click', function () {
      selectSuggestion(item, container.previousElementSibling, container);
    });
  });
}

function highlightText(text, query) {
  var regex = new RegExp('(' + query + ')', 'gi');
  return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
}

function selectSuggestion(suggestionElement, input, container) {
  var customerName = suggestionElement.getAttribute('data-name');
  input.value = customerName;
  hideSuggestions(container);

  if (input.id === 'searchName') {
    searchCustomer();
  }
}

function setupAutocomplete(input, suggestionsContainer) {
  var debounceTimer;

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var query = input.value.trim();

    if (query.length < 1) {
      hideSuggestions(suggestionsContainer);
      return;
    }

    debounceTimer = setTimeout(function () {
      fetchSuggestions(query, suggestionsContainer);
    }, 300);
  });

  input.addEventListener('blur', function () {
    setTimeout(function () {
      hideSuggestions(suggestionsContainer);
    }, 200);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim().length > 0) {
      fetchSuggestions(input.value.trim(), suggestionsContainer);
    }
  });
}

function initializeAutocomplete() {
  var updateSearchInput = document.getElementById('updateSearchName');
  var updateSuggestions = document.getElementById('updateSearchSuggestions');
  if (updateSearchInput && updateSuggestions) {
    setupAutocomplete(updateSearchInput, updateSuggestions);
  }

  var searchInput = document.getElementById('searchName');
  var searchSuggestions = document.getElementById('searchSuggestions');
  if (searchInput && searchSuggestions) {
    setupAutocomplete(searchInput, searchSuggestions);
  }
}

function showMessage(message, type) {
  var messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;

  var content = document.querySelector('.content');
  content.insertBefore(messageDiv, content.firstChild);

  setTimeout(function () {
    messageDiv.remove();
  }, 5000);
}

function handleAddCustomer(e) {
  e.preventDefault();

  var formData = new FormData(e.target);
  var customerData = {
    customerName: formData.get('customerName'),
    imsorg: formData.get('imsorg'),
    aemType: formData.get('aemType'),
    contractSigned: formData.get('contractSigned') === 'on',
    autoOptimizationEnabled: formData.get('autoOptimizationEnabled') === 'on',
    issues: formData.get('issues')
  };

  fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  })
    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (error) {
          throw new Error(error.error || 'Failed to add customer');
        });
      }
      return response.json();
    })
    .then(function () {
      showMessage('Customer added successfully!', 'success');
      e.target.reset();
    })
    .catch(function (error) {
      showMessage('Error adding customer: ' + error.message, 'error');
    });
}

function handleUpdateCustomer(e) {
  e.preventDefault();

  var formData = new FormData(e.target);
  var customerName = formData.get('customerName');
  var updateData = {
    imsorg: formData.get('imsorg'),
    aemType: formData.get('aemType'),
    contractSigned: formData.get('contractSigned') === 'on',
    autoOptimizationEnabled: formData.get('autoOptimizationEnabled') === 'on',
    issues: formData.get('issues'),
    newUpdate: formData.get('newUpdate')
  };

  fetch('/api/customers/' + encodeURIComponent(customerName), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  })
    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (error) {
          throw new Error(error.error || 'Failed to update customer');
        });
      }
      return response.json();
    })
    .then(function () {
      showMessage('Customer updated successfully!', 'success');
      e.target.reset();
      document.getElementById('updateCustomerForm').classList.add('hidden');
    })
    .catch(function (error) {
      showMessage('Error updating customer: ' + error.message, 'error');
    });
}

function searchCustomerForUpdate() {
  var customerName = document.getElementById('updateSearchName').value.trim();

  if (!customerName) {
    showMessage('Please enter a customer name', 'error');
    return;
  }

  fetch('/api/customers/' + encodeURIComponent(customerName))
    .then(function (response) {
      if (!response.ok) {
        if (response.status === 404) {
          showMessage('Customer not found', 'error');
          return;
        }
        throw new Error('Failed to fetch customer');
      }
      return response.json();
    })
    .then(function (customer) {
      populateUpdateForm(customer);
      document.getElementById('updateCustomerForm').classList.remove('hidden');
    })
    .catch(function (error) {
      showMessage('Error searching customer: ' + error.message, 'error');
    });
}

function populateUpdateForm(customer) {
  document.getElementById('updateCustomerName').value = customer.customerName;
  document.getElementById('updateImsorg').value = customer.imsorg || '';
  document.getElementById('updateAemType').value = customer.aemType || '';
  document.getElementById('updateIssues').value = customer.issues || '';
  document.getElementById('updateContractSigned').checked = customer.contractSigned;
  document.getElementById('updateAutoOptimizationEnabled').checked = customer.autoOptimizationEnabled;
}

function searchCustomer() {
  var customerName = document.getElementById('searchName').value.trim();

  if (!customerName) {
    showMessage('Please enter a customer name', 'error');
    return;
  }

  fetch('/api/customers/' + encodeURIComponent(customerName))
    .then(function (response) {
      if (!response.ok) {
        if (response.status === 404) {
          document.getElementById('searchResults').innerHTML =
            '<div class="error">Customer not found</div>';
          return;
        }
        throw new Error('Failed to fetch customer');
      }
      return response.json();
    })
    .then(function (customer) {
      displayCustomerResult(customer);
    })
    .catch(function (error) {
      document.getElementById('searchResults').innerHTML =
        '<div class="error">Error searching customer: ' + error.message + '</div>';
    });
}

function displayCustomerResult(customer) {
  var updates = customer.updates ? customer.updates.split('\n').filter(function (u) {
    return u.trim();
  }) : [];
  var sortedUpdates = updates.sort(function (a, b) {
    var dateA = new Date(a.split(':')[0]);
    var dateB = new Date(b.split(':')[0]);
    return dateB - dateA;
  });

  var customerHTML = '<div class="customer-card">' +
    '<div class="customer-info">' +
    '<div class="info-item">' +
    '<div class="info-label">Customer Name</div>' +
    '<div class="info-value">' + customer.customerName + '</div>' +
    '</div>' +
    '<div class="info-item">' +
    '<div class="info-label">IMS Org</div>' +
    '<div class="info-value">' + (customer.imsorg || 'Not specified') + '</div>' +
    '</div>' +
    '<div class="info-item">' +
    '<div class="info-label">AEM Type</div>' +
    '<div class="info-value">' +
    '<span class="status-badge aem-type">' + customer.aemType + '</span>' +
    '</div>' +
    '</div>' +
    '<div class="info-item">' +
    '<div class="info-label">Contract Signed</div>' +
    '<div class="info-value">' +
    '<span class="status-badge ' + (customer.contractSigned ? 'status-true' : 'status-false') + '">' +
    (customer.contractSigned ? 'Yes' : 'No') +
    '</span>' +
    '</div>' +
    '</div>' +
    '<div class="info-item">' +
    '<div class="info-label">Auto-optimization</div>' +
    '<div class="info-value">' +
    '<span class="status-badge ' + (customer.autoOptimizationEnabled ? 'status-true' : 'status-false') + '">' +
    (customer.autoOptimizationEnabled ? 'Enabled' : 'Disabled') +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>';

  if (customer.issues) {
    customerHTML += '<div class="info-item">' +
      '<div class="info-label">Issues</div>' +
      '<div class="info-value">' + customer.issues + '</div>' +
      '</div>';
  }

  customerHTML += '<div class="updates-section">' +
    '<div class="updates-title">Updates (Newest First)</div>' +
    '<div class="updates-content">' + (sortedUpdates.join('\n') || 'No updates yet') + '</div>' +
    '</div>' +
    '</div>';

  document.getElementById('searchResults').innerHTML = customerHTML;
}

function initializeForms() {
  var customerForm = document.getElementById('customerForm');
  if (customerForm) {
    customerForm.addEventListener('submit', handleAddCustomer);
  }

  var updateForm = document.getElementById('updateForm');
  if (updateForm) {
    updateForm.addEventListener('submit', handleUpdateCustomer);
  }

  initializeAutocomplete();
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.querySelectorAll('.nav-link');
  var pages = document.querySelectorAll('.page');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      navLinks.forEach(function (l) {
        l.classList.remove('active');
      });
      pages.forEach(function (p) {
        p.classList.remove('active');
      });

      link.classList.add('active');
      var targetPage = link.getAttribute('data-page');
      document.getElementById(targetPage).classList.add('active');
    });
  });

  initializeForms();
});