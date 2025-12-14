// View Issues Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const statusFilter = document.getElementById('statusFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortBy = document.getElementById('sortBy');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const issuesGrid = document.getElementById('issuesGrid');
    const issuesTable = document.getElementById('issuesTable');
    const issuesTableBody = document.getElementById('issuesTableBody');
    const emptyState = document.getElementById('emptyState');
    const noIssuesState = document.getElementById('noIssuesState');
    
    // Statistics elements
    const totalIssues = document.getElementById('totalIssues');
    const pendingCount = document.getElementById('pendingCount');
    const progressCount = document.getElementById('progressCount');
    const resolvedCount = document.getElementById('resolvedCount');
    
    // Modal elements
    const issueDetailModal = document.getElementById('issueDetailModal');
    const confirmationModal = document.getElementById('confirmationModal');
    
    // Issues data - loaded from backend API
    let allIssues = [];
    let isLoading = false;

    let filteredIssues = [...allIssues];
    let currentView = 'card';

    // Initialize the page
    initializePage();

    async function initializePage() {
        // Add event listeners
        addEventListeners();
        
        // Load initial data from backend
        await loadIssuesFromAPI();
        
        // Set initial view
        setView('card');
        
        // Set up auto-refresh for status updates
        setupAutoRefresh();
        
        console.log('View Issues page initialized successfully!');
    }

    function setupAutoRefresh() {
        // Refresh every 30 seconds to check for admin updates
        setInterval(async () => {
            if (!isLoading) {
                await loadIssuesFromAPI(true); // Silent refresh
            }
        }, 30000);
        
        // Also refresh when page becomes visible (user switches back to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !isLoading) {
                loadIssuesFromAPI(true);
            }
        });
    }

    async function loadIssuesFromAPI(silent = false) {
        try {
            isLoading = true;
            if (!silent) showLoadingState();
            
            // Load demo issues from localStorage
            const demoIssues = JSON.parse(localStorage.getItem('demoIssues') || '[]');
            
            // Check for status changes if this is a refresh
            const previousIssues = [...allIssues];
            
            // Transform demo data to match frontend format
            allIssues = demoIssues.map(issue => ({
                id: issue._id,
                title: issue.title,
                description: issue.content,
                location: issue.location,
                dateReported: new Date(issue.createdAt).toISOString().slice(0, 10),
                status: issue.status,
                citizen: issue.reporterName,
                photo: null,
                assignedTo: issue.assignedTo || 'Not assigned',
                comments: issue.comments || [{
                    date: new Date(issue.createdAt).toISOString().slice(0, 10),
                    status: issue.status,
                    comment: 'Issue reported by citizen'
                }],
                _id: issue._id,
                lastUpdated: new Date(issue.createdAt).getTime()
            }));
            
            // Check for status updates and notify user
            if (silent && previousIssues.length > 0) {
                checkForStatusUpdates(previousIssues, allIssues);
            }
            
            filteredIssues = [...allIssues];
            
        } catch (error) {
            console.error('Failed to load issues:', error);
            if (!silent) {
                showNotification('Failed to load demo issues.', 'error');
            }
            allIssues = [];
            filteredIssues = [];
        } finally {
            isLoading = false;
            if (!silent) hideLoadingState();
            loadIssues();
            updateStatistics();
        }
    }

    function checkForStatusUpdates(oldIssues, newIssues) {
        newIssues.forEach(newIssue => {
            const oldIssue = oldIssues.find(old => old._id === newIssue._id);
            if (oldIssue && oldIssue.status !== newIssue.status) {
                // Status changed - show notification with appropriate type
                const statusText = formatStatus(newIssue.status);
                let notificationType = 'info';
                
                if (newIssue.status === 'resolved') {
                    notificationType = 'success';
                } else if (newIssue.status === 'in-progress') {
                    notificationType = 'warning';
                }
                
                showStatusUpdateNotification(
                    `Issue ${newIssue.id} status updated to: ${statusText}`,
                    notificationType,
                    newIssue
                );
                
                // Add visual highlight to the updated issue
                setTimeout(() => {
                    highlightUpdatedIssue(newIssue.id);
                }, 1000);
            }
        });
    }

    function showStatusUpdateNotification(message, type, issue) {
        // Create enhanced notification for status updates
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} status-update-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <strong>Status Update</strong>
                    <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="notification-message">${message}</div>
                <div class="notification-actions">
                    <button class="btn btn-sm btn-outline" onclick="showIssueDetails('${issue.id}'); this.parentElement.parentElement.parentElement.remove();">
                        View Details
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 8 seconds (longer for status updates)
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 8000);
    }

    function highlightUpdatedIssue(issueId) {
        const issueElements = document.querySelectorAll(`[data-issue-id="${issueId}"]`);
        issueElements.forEach(element => {
            element.classList.add('issue-updated');
            setTimeout(() => {
                element.classList.remove('issue-updated');
            }, 3000);
        });
    }

    function showLoadingState() {
        const loadingHtml = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading issues...</p>
            </div>
        `;
        issuesGrid.innerHTML = loadingHtml;
        issuesTableBody.innerHTML = '<tr><td colspan="9" class="text-center">Loading issues...</td></tr>';
    }

    function hideLoadingState() {
        // Loading state will be replaced by actual content
    }

    function addEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', handleSearch);
        clearSearchBtn.addEventListener('click', clearSearch);
        
        // Filters
        statusFilter.addEventListener('change', applyFilters);
        locationFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applySorting);
        
        // Refresh button
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh All
        `;
        refreshBtn.className = 'btn btn-outline btn-sm';
        refreshBtn.onclick = () => loadIssuesFromAPI();
        document.querySelector('.issues-header').appendChild(refreshBtn);
        
        // View toggle
        cardViewBtn.addEventListener('click', () => setView('card'));
        tableViewBtn.addEventListener('click', () => setView('table'));
        
        // Modal close events
        document.addEventListener('click', handleModalClose);
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query) {
            clearSearchBtn.classList.add('show');
            filteredIssues = allIssues.filter(issue => 
                issue.id.toLowerCase().includes(query) ||
                issue.title.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query) ||
                issue.location.toLowerCase().includes(query) ||
                issue.citizen.toLowerCase().includes(query)
            );
        } else {
            clearSearchBtn.classList.remove('show');
            filteredIssues = [...allIssues];
        }
        
        applyFilters();
    }

    function clearSearch() {
        searchInput.value = '';
        clearSearchBtn.classList.remove('show');
        filteredIssues = [...allIssues];
        applyFilters();
    }

    async function applyFilters() {
        if (isLoading) return;
        
        // For client-side filtering, we'll filter the loaded data
        // In a production app, you might want to send filter parameters to the API
        let filtered = [...allIssues];
        
        // Apply search filter
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            filtered = filtered.filter(issue => 
                issue.id.toLowerCase().includes(query) ||
                issue.title.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query) ||
                issue.location.toLowerCase().includes(query) ||
                issue.citizen.toLowerCase().includes(query)
            );
        }
        
        // Apply status filter
        const status = statusFilter.value;
        if (status) {
            filtered = filtered.filter(issue => issue.status === status);
        }
        
        // Apply location filter
        const location = locationFilter.value;
        if (location) {
            filtered = filtered.filter(issue => 
                issue.location.toLowerCase().includes(location)
            );
        }
        
        // Apply date filter
        const dateFilterValue = dateFilter.value;
        if (dateFilterValue) {
            const now = new Date();
            filtered = filtered.filter(issue => {
                const issueDate = new Date(issue.dateReported);
                switch (dateFilterValue) {
                    case 'today':
                        return issueDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return issueDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return issueDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        
        filteredIssues = filtered;
        applySorting();
    }

    function applySorting() {
        const sortByValue = sortBy.value;
        
        switch (sortByValue) {
            case 'newest':
                filteredIssues.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));
                break;
            case 'oldest':
                filteredIssues.sort((a, b) => new Date(a.dateReported) - new Date(b.dateReported));
                break;
            case 'status':
                const statusOrder = { 'pending': 0, 'in-progress': 1, 'resolved': 2 };
                filteredIssues.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
        }
        
        loadIssues();
        updateStatistics();
    }

    function setView(view) {
        currentView = view;
        
        if (view === 'card') {
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            issuesGrid.classList.remove('hidden');
            issuesTable.classList.add('hidden');
        } else {
            cardViewBtn.classList.remove('active');
            tableViewBtn.classList.add('active');
            issuesGrid.classList.add('hidden');
            issuesTable.classList.remove('hidden');
        }
        
        loadIssues();
    }

    function loadIssues() {
        if (filteredIssues.length === 0) {
            showEmptyState();
            return;
        }
        
        if (currentView === 'card') {
            loadCardView();
        } else {
            loadTableView();
        }
        
        hideEmptyStates();
    }

    function loadCardView() {
        issuesGrid.innerHTML = '';
        
        filteredIssues.forEach(issue => {
            const card = createIssueCard(issue);
            issuesGrid.appendChild(card);
        });
    }

    function loadTableView() {
        issuesTableBody.innerHTML = '';
        
        filteredIssues.forEach(issue => {
            const row = createIssueTableRow(issue);
            issuesTableBody.appendChild(row);
        });
    }

    function createIssueCard(issue) {
        const card = document.createElement('div');
        card.className = 'issue-card';
        card.setAttribute('data-issue-id', issue.id);
        card.onclick = () => showIssueDetails(issue);
        
        card.innerHTML = `
            <div class="issue-header">
                <span class="issue-id">${issue.id}</span>
                <span class="issue-date">${formatDate(issue.dateReported)}</span>
            </div>
            <h3 class="issue-title">${issue.title}</h3>
            <p class="issue-description">${issue.description}</p>
            <div class="issue-meta">
                <div class="issue-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${issue.location}
                </div>
                <div class="issue-status ${issue.status}">
                    ${getStatusIcon(issue.status)}
                    ${formatStatus(issue.status)}
                </div>
            </div>
            <div class="issue-actions">
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showIssueDetails('${issue.id}')">
                    View Details
                </button>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); refreshSingleIssue('${issue._id}')">
                    Refresh
                </button>
            </div>
        `;
        
        return card;
    }

    function createIssueTableRow(issue) {
        const row = document.createElement('tr');
        row.onclick = () => showIssueDetails(issue);
        
        row.innerHTML = `
            <td class="issue-id-cell">${issue.id}</td>
            <td class="issue-title-cell">${issue.title}</td>
            <td class="issue-description-cell">${issue.description}</td>
            <td class="issue-location-cell">${issue.location}</td>
            <td class="issue-date-cell">${formatDate(issue.dateReported)}</td>
            <td class="issue-citizen-cell">${issue.citizen}</td>
            <td class="issue-status-cell">
                <span class="issue-status ${issue.status}">
                    ${getStatusIcon(issue.status)}
                    ${formatStatus(issue.status)}
                </span>
            </td>
            <td class="issue-assigned-cell">${issue.assignedTo}</td>
            <td class="issue-actions-cell">
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showIssueDetails('${issue.id}')">
                    View
                </button>
            </td>
        `;
        
        return row;
    }

    function showIssueDetails(issueId) {
        let issue;
        if (typeof issueId === 'string') {
            issue = allIssues.find(i => i.id === issueId);
        } else {
            issue = issueId;
        }
        
        if (!issue) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="issue-detail">
                <div class="issue-detail-header">
                    <div class="issue-detail-id">${issue.id}</div>
                    <div class="issue-detail-status">
                        <span class="issue-status ${issue.status}">
                            ${getStatusIcon(issue.status)}
                            ${formatStatus(issue.status)}
                        </span>
                    </div>
                </div>
                
                <h2 class="issue-detail-title">${issue.title}</h2>
                <p class="issue-detail-description">${issue.description}</p>
                
                <div class="issue-detail-meta">
                    <div class="meta-item">
                        <strong>Location:</strong> ${issue.location}
                    </div>
                    <div class="meta-item">
                        <strong>Reported by:</strong> ${issue.citizen}
                    </div>
                    <div class="meta-item">
                        <strong>Date Reported:</strong> ${formatDate(issue.dateReported)}
                    </div>
                    <div class="meta-item">
                        <strong>Assigned to:</strong> ${issue.assignedTo}
                    </div>
                </div>
                
                <div class="issue-detail-comments">
                    <h3>Status Timeline</h3>
                    <div class="timeline">
                        ${issue.comments.map(comment => `
                            <div class="timeline-item">
                                <div class="timeline-date">${formatDate(comment.date)}</div>
                                <div class="timeline-status">
                                    <span class="issue-status ${comment.status}">
                                        ${getStatusIcon(comment.status)}
                                        ${formatStatus(comment.status)}
                                    </span>
                                </div>
                                <div class="timeline-comment">${comment.comment}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${issue.status === 'resolved' ? `
                    <div class="issue-detail-actions">
                        <button class="btn btn-primary" onclick="confirmResolution('${issue.id}', true)">
                            Confirm Resolution
                        </button>
                        <button class="btn btn-outline" onclick="confirmResolution('${issue.id}', false)">
                            Report Still Unresolved
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        issueDetailModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function confirmResolution(issueId, isResolved) {
        issueDetailModal.classList.add('hidden');
        
        if (isResolved) {
            showNotification('Thank you for confirming the resolution!', 'success');
        } else {
            showNotification('Issue has been reported as still unresolved. It will be reassigned for further action.', 'info');
        }
    }

    function updateStatistics() {
        const pending = filteredIssues.filter(issue => issue.status === 'pending').length;
        const progress = filteredIssues.filter(issue => issue.status === 'in-progress').length;
        const resolved = filteredIssues.filter(issue => issue.status === 'resolved').length;
        
        totalIssues.textContent = filteredIssues.length;
        pendingCount.textContent = pending;
        progressCount.textContent = progress;
        resolvedCount.textContent = resolved;
    }

    function showEmptyState() {
        if (allIssues.length === 0) {
            noIssuesState.classList.remove('hidden');
            emptyState.classList.add('hidden');
        } else {
            emptyState.classList.remove('hidden');
            noIssuesState.classList.add('hidden');
        }
        
        issuesGrid.classList.add('hidden');
        issuesTable.classList.add('hidden');
    }

    function hideEmptyStates() {
        emptyState.classList.add('hidden');
        noIssuesState.classList.add('hidden');
        
        if (currentView === 'card') {
            issuesGrid.classList.remove('hidden');
        } else {
            issuesTable.classList.remove('hidden');
        }
    }

    function handleModalClose(e) {
        if (e.target === issueDetailModal || e.target === confirmationModal) {
            issueDetailModal.classList.add('hidden');
            confirmationModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            issueDetailModal.classList.add('hidden');
            confirmationModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'resolved': 'Resolved'
        };
        return statusMap[status] || status;
    }

    function getStatusIcon(status) {
        const icons = {
            'pending': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
            'in-progress': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
            'resolved': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>'
        };
        return icons[status] || '';
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 1001;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border-left: 4px solid var(--primary);
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                }
                
                .notification-info {
                    border-left-color: var(--info);
                }
                
                .notification-success {
                    border-left-color: var(--success);
                }
                
                .notification-warning {
                    border-left-color: var(--warning);
                }
                
                .notification-error {
                    border-left-color: var(--error);
                }
                
                .notification-content {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-message {
                    color: var(--foreground);
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--muted-foreground);
                    cursor: pointer;
                    padding: 0;
                    margin-left: 1rem;
                    line-height: 1;
                }
                
                .notification-close:hover {
                    color: var(--foreground);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add slide out animation
    if (!document.querySelector('#slide-out-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'slide-out-styles';
        styleElement.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Refresh single issue
    async function refreshSingleIssue(issueId) {
        try {
            const updatedIssue = await getIssueById(issueId);
            
            // Update the issue in allIssues array
            const index = allIssues.findIndex(issue => issue._id === issueId);
            if (index !== -1) {
                const transformedIssue = {
                    id: updatedIssue._id.slice(-6).toUpperCase(),
                    title: updatedIssue.title,
                    description: updatedIssue.content,
                    location: updatedIssue.location,
                    dateReported: new Date(updatedIssue.createdAt).toISOString().slice(0, 10),
                    status: updatedIssue.status,
                    citizen: updatedIssue.reporterName,
                    photo: null,
                    assignedTo: updatedIssue.assignedTo,
                    comments: updatedIssue.comments || [],
                    _id: updatedIssue._id
                };
                
                // Check if status changed
                if (allIssues[index].status !== transformedIssue.status) {
                    let notificationType = 'success';
                    if (transformedIssue.status === 'in-progress') {
                        notificationType = 'warning';
                    } else if (transformedIssue.status === 'pending') {
                        notificationType = 'info';
                    }
                    
                    showStatusUpdateNotification(
                        `Issue ${transformedIssue.id} status updated to: ${formatStatus(transformedIssue.status)}`,
                        notificationType,
                        transformedIssue
                    );
                }
                
                allIssues[index] = transformedIssue;
                applyFilters(); // Refresh the display
            }
        } catch (error) {
            console.error('Failed to refresh issue:', error);
            showNotification('Failed to refresh issue status', 'error');
        }
    }

    // Make functions globally available
    window.showIssueDetails = showIssueDetails;
    window.confirmResolution = confirmResolution;
    window.refreshSingleIssue = refreshSingleIssue;
});

// Additional styles for issue detail modal
const issueDetailStyles = `
    .issue-detail {
        max-width: 600px;
    }
    
    .issue-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
    }
    
    .issue-detail-id {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--primary);
    }
    
    .issue-detail-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--foreground);
        margin-bottom: 1rem;
    }
    
    .issue-detail-description {
        color: var(--muted);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .issue-detail-meta {
        background-color: var(--background);
        border-radius: var(--border-radius-sm);
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .meta-item {
        margin-bottom: 0.5rem;
        display: flex;
        gap: 0.5rem;
    }
    
    .meta-item:last-child {
        margin-bottom: 0;
    }
    
    .issue-detail-comments {
        margin-bottom: 1.5rem;
    }
    
    .issue-detail-comments h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--foreground);
        margin-bottom: 1rem;
    }
    
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .timeline-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        background-color: var(--background);
        border-radius: var(--border-radius-sm);
        border-left: 3px solid var(--primary);
    }
    
    .timeline-date {
        font-size: 0.875rem;
        color: var(--muted);
        font-weight: 500;
    }
    
    .timeline-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .timeline-comment {
        color: var(--foreground);
        line-height: 1.5;
    }
    
    .issue-detail-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }
`;

// Add the styles to the document
if (!document.querySelector('#issue-detail-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'issue-detail-styles';
    styleElement.textContent = issueDetailStyles;
    document.head.appendChild(styleElement);
}