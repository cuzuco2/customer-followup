---
title: EDS Customer Follow-up Tracker
description: Track customer information, updates, and contract status
template: default
---

# EDS Customer Follow-up Tracker

Track customer information, updates, and contract status with Google Sheets integration.

## Customer Tracker

<div class="customer-tracker">
  <div class="container">
    <div class="header">
      <h1>EDS Customer Follow-up Tracker</h1>
      <p>Track customer information, updates, and contract status</p>
    </div>

    <nav class="navigation">
      <ul class="nav-list">
        <li class="nav-item">
          <a href="#add-customer" class="nav-link active" data-page="add-customer">Add Customer</a>
        </li>
        <li class="nav-item">
          <a href="#update-customer" class="nav-link" data-page="update-customer">Update Customer</a>
        </li>
        <li class="nav-item">
          <a href="#search-customer" class="nav-link" data-page="search-customer">Search Customer</a>
        </li>
      </ul>
    </nav>

    <div class="content">
      <!-- Add Customer Page -->
      <div id="add-customer" class="page active">
        <h2>Add New Customer</h2>
        <form id="customerForm" class="form-grid">
          <div class="form-group">
            <label for="customerName">Customer Name *</label>
            <input type="text" id="customerName" name="customerName" required>
          </div>
          <div class="form-group">
            <label for="imsorg">IMS Org</label>
            <input type="text" id="imsorg" name="imsorg">
          </div>
          <div class="form-group">
            <label for="aemType">AEM Type *</label>
            <select id="aemType" name="aemType" required>
              <option value="">Select AEM Type</option>
              <option value="EDS">EDS</option>
              <option value="AMS">AMS</option>
              <option value="AEMACS">AEMACS</option>
            </select>
          </div>
          <div class="form-group">
            <label for="issues">Issues</label>
            <textarea id="issues" name="issues" rows="3"></textarea>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="contractSigned" name="contractSigned">
              <label for="contractSigned">Contract Signed</label>
            </div>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="autoOptimizationEnabled" name="autoOptimizationEnabled">
              <label for="autoOptimizationEnabled">Auto-optimization Enabled</label>
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn">Add Customer</button>
          </div>
        </form>
      </div>

      <!-- Update Customer Page -->
      <div id="update-customer" class="page">
        <h2>Update Customer Status</h2>
        <div class="search-form">
          <h3>Find Customer to Update</h3>
          <div class="search-input">
            <div class="form-group autocomplete-container">
              <label for="updateSearchName">Customer Name</label>
              <input type="text" id="updateSearchName" placeholder="Enter customer name to search" autocomplete="off">
              <div id="updateSearchSuggestions" class="autocomplete-suggestions hidden"></div>
            </div>
            <button type="button" class="btn" onclick="searchCustomerForUpdate()">Search</button>
          </div>
        </div>
        <div id="updateCustomerForm" class="hidden">
          <h3>Update Customer Information</h3>
          <form id="updateForm" class="form-grid">
            <input type="hidden" id="updateCustomerName" name="customerName">
            <div class="form-group">
              <label for="updateImsorg">IMS Org</label>
              <input type="text" id="updateImsorg" name="imsorg">
            </div>
            <div class="form-group">
              <label for="updateAemType">AEM Type</label>
              <select id="updateAemType" name="aemType">
                <option value="">Select AEM Type</option>
                <option value="EDS">EDS</option>
                <option value="AMS">AMS</option>
                <option value="AEMACS">AEMACS</option>
              </select>
            </div>
            <div class="form-group">
              <label for="updateIssues">Issues</label>
              <textarea id="updateIssues" name="issues" rows="3"></textarea>
            </div>
            <div class="form-group">
              <div class="checkbox-group">
                <input type="checkbox" id="updateContractSigned" name="contractSigned">
                <label for="updateContractSigned">Contract Signed</label>
              </div>
            </div>
            <div class="form-group">
              <div class="checkbox-group">
                <input type="checkbox" id="updateAutoOptimizationEnabled" name="autoOptimizationEnabled">
                <label for="updateAutoOptimizationEnabled">Auto-optimization Enabled</label>
              </div>
            </div>
            <div class="form-group">
              <label for="newUpdate">Add New Update</label>
              <textarea id="newUpdate" name="newUpdate" rows="3" placeholder="Enter your update here..."></textarea>
            </div>
            <div class="form-group">
              <button type="submit" class="btn">Update Customer</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Search Customer Page -->
      <div id="search-customer" class="page">
        <h2>Search Customer</h2>
        <div class="search-form">
          <div class="search-input">
            <div class="form-group autocomplete-container">
              <label for="searchName">Customer Name</label>
              <input type="text" id="searchName" placeholder="Enter customer name to search" autocomplete="off">
              <div id="searchSuggestions" class="autocomplete-suggestions hidden"></div>
            </div>
            <button type="button" class="btn" onclick="searchCustomer()">Search</button>
          </div>
        </div>
        <div id="searchResults"></div>
      </div>
    </div>
  </div>
</div>
