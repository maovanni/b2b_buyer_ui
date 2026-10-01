/**
 * SmartPOS B2B Collaboration Module - Vanny's Assignment (Buyer / Purchase Order)
 * Spec: B2B_Module_Developer_Implementation_v2.md
 */

// Initial Mock State reflecting official developer document
const state = {
  activeView: 'dashboard',
  currentBranch: {
    id: 3,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Downtown Central Store',
    business_uuid: 'biz-buyer-corp-001'
  },
  supplierBranches: [
    { id: 8, uuid: 'sup-branch-008', name: 'MegaFood Wholesale Distribution', business_uuid: 'sup-biz-001', mode: 'same_db', connection_id: null },
    { id: 12, uuid: 'sup-branch-012', name: 'Beverage & Goods Central Depot', business_uuid: 'sup-biz-001', mode: 'same_db', connection_id: null },
    { id: null, uuid: 'sup-branch-remote-99', name: 'Prime Global Logistics & Supply (Remote)', business_uuid: 'sup-biz-remote-99', mode: 'remote_db', connection_id: 15, api_url: 'https://supplier.example.com/b2b' }
  ],
  availableProducts: [
    { id: 100, uuid: 'BUYER-ITEM-100', name: 'Fresh Organic Whole Milk 1L', sku: 'MLK-100', barcode: '8850123001', default_price: 10.00, unit: 'Bottle', unit_id: 1 },
    { id: 101, uuid: 'BUYER-ITEM-101', name: 'Premium Arabica Coffee Beans 1kg', sku: 'COF-101', barcode: '8850123002', default_price: 43.00, unit: 'Bag', unit_id: 1 },
    { id: 102, uuid: 'BUYER-ITEM-102', name: 'Cane Sugar Sticks (Box 200s)', sku: 'SGR-102', barcode: '8850123003', default_price: 7.50, unit: 'Box', unit_id: 2 },
    { id: 103, uuid: 'BUYER-ITEM-103', name: 'Artisan Sourdough Loaf 500g', sku: 'BRD-103', barcode: '8850123004', default_price: 4.20, unit: 'Piece', unit_id: 3 },
    { id: 104, uuid: 'BUYER-ITEM-104', name: 'Green Tea Extract Syrups 750ml', sku: 'SYR-104', barcode: '8850123005', default_price: 15.00, unit: 'Bottle', unit_id: 1 }
  ],

  // B2B Transactions (b2b_transaction table)
  transactions: [
    {
      id: 1001,
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      transaction_no: 'B2B-2026-000001',
      buyer_business_uuid: 'biz-buyer-corp-001',
      buyer_branch_uuid: '550e8400-e29b-41d4-a716-446655440000',
      buyer_branch_id: 3,
      buyer_name: 'Downtown Central Store',
      supplier_business_uuid: 'sup-biz-001',
      supplier_branch_uuid: 'sup-branch-008',
      supplier_branch_id: 8,
      supplier_name: 'MegaFood Wholesale Distribution',
      supplier_connection_id: null, // Same DB
      status: 'OPEN',
      created_by_user_id: 45,
      created_at: '2026-09-30 08:30:00'
    },
    {
      id: 1002,
      uuid: '660e8400-e29b-41d4-a716-446655440001',
      transaction_no: 'B2B-2026-000002',
      buyer_business_uuid: 'biz-buyer-corp-001',
      buyer_branch_uuid: '550e8400-e29b-41d4-a716-446655440000',
      buyer_branch_id: 3,
      buyer_name: 'Downtown Central Store',
      supplier_business_uuid: 'sup-biz-remote-99',
      supplier_branch_uuid: 'sup-branch-remote-99',
      supplier_branch_id: null,
      supplier_name: 'Prime Global Logistics & Supply (Remote)',
      supplier_connection_id: 15, // Remote DB
      status: 'OPEN',
      created_by_user_id: 45,
      created_at: '2026-09-29 14:15:00'
    },
    {
      id: 1003,
      uuid: '770e8400-e29b-41d4-a716-446655440002',
      transaction_no: 'B2B-2026-000003',
      buyer_business_uuid: 'biz-buyer-corp-001',
      buyer_branch_uuid: '550e8400-e29b-41d4-a716-446655440000',
      buyer_branch_id: 3,
      buyer_name: 'Downtown Central Store',
      supplier_business_uuid: 'sup-biz-001',
      supplier_branch_uuid: 'sup-branch-012',
      supplier_branch_id: 12,
      supplier_name: 'Beverage & Goods Central Depot',
      supplier_connection_id: null,
      status: 'COMPLETED',
      created_by_user_id: 45,
      created_at: '2026-09-25 10:00:00'
    }
  ],

  // Buyer Purchase Orders (inv_purchase_order table)
  purchaseOrders: [
    {
      id: 5000,
      b2b_transaction_id: 1001,
      branch_id: 3,
      supplier_id: null, // As specified in Rule 3: inv_purchase_order.supplier_id is legacy-only
      po_number: 'PO-2026-00125',
      po_date: '2026-09-30 09:00:00',
      total: 3150.00,
      deposit: 1000.00,
      is_approve: 1, // internal PO approval
      b2b_status: 'NEGOTIATING', // Current active B2B workflow state
      supplier_name: 'MegaFood Wholesale Distribution',
      mode: 'same_db',
      items: [
        { po_id: 5000, item_id: 100, name: 'Fresh Organic Whole Milk 1L', sku: 'MLK-100', qty: 100, price: 10.00, unit: 'Bottle', unit_id: 1, remote_item_uuid: 'SUP-ITEM-750', mapping_status: 'MAPPED' },
        { po_id: 5000, item_id: 101, name: 'Premium Arabica Coffee Beans 1kg', sku: 'COF-101', qty: 50, price: 43.00, unit: 'Bag', unit_id: 1, remote_item_uuid: 'SUP-ITEM-751', mapping_status: 'MAPPED' }
      ]
    },
    {
      id: 5001,
      b2b_transaction_id: 1002,
      branch_id: 3,
      supplier_id: null,
      po_number: 'PO-2026-00126',
      po_date: '2026-09-29 15:30:00',
      total: 1850.00,
      deposit: 0,
      is_approve: 1,
      b2b_status: 'SENT',
      supplier_name: 'Prime Global Logistics & Supply (Remote)',
      mode: 'remote_db',
      items: [
        { po_id: 5001, item_id: 102, name: 'Cane Sugar Sticks (Box 200s)', sku: 'SGR-102', qty: 100, price: 7.50, unit: 'Box', unit_id: 2, remote_item_uuid: 'SUP-REM-301', mapping_status: 'UNMAPPED' },
        { po_id: 5001, item_id: 104, name: 'Green Tea Extract Syrups 750ml', sku: 'SYR-104', qty: 70, price: 15.00, unit: 'Bottle', unit_id: 1, remote_item_uuid: 'SUP-REM-302', mapping_status: 'MAPPED' }
      ]
    },
    {
      id: 5002,
      b2b_transaction_id: 1003,
      branch_id: 3,
      supplier_id: null,
      po_number: 'PO-2026-00120',
      po_date: '2026-09-25 10:15:00',
      total: 840.00,
      deposit: 840.00,
      is_approve: 1,
      b2b_status: 'CLOSED',
      supplier_name: 'Beverage & Goods Central Depot',
      mode: 'same_db',
      items: [
        { po_id: 5002, item_id: 103, name: 'Artisan Sourdough Loaf 500g', sku: 'BRD-103', qty: 200, price: 4.20, unit: 'Piece', unit_id: 3, remote_item_uuid: 'SUP-ITEM-103', mapping_status: 'MAPPED' }
      ]
    },
    {
      id: 5003,
      b2b_transaction_id: null, // Legacy PO or Draft PO not sent yet
      branch_id: 3,
      supplier_id: null,
      po_number: 'PO-2026-00127',
      po_date: '2026-09-30 11:20:00',
      total: 1200.00,
      deposit: 0,
      is_approve: 0,
      b2b_status: 'DRAFT',
      supplier_name: 'MegaFood Wholesale Distribution',
      mode: 'same_db',
      items: [
        { po_id: 5003, item_id: 100, name: 'Fresh Organic Whole Milk 1L', sku: 'MLK-100', qty: 120, price: 10.00, unit: 'Bottle', unit_id: 1, remote_item_uuid: null, mapping_status: 'UNMAPPED' }
      ]
    },
    {
      id: 5004,
      b2b_transaction_id: 1001,
      branch_id: 3,
      supplier_id: null,
      po_number: 'PO-2026-00124',
      po_date: '2026-09-28 09:00:00',
      total: 4200.00,
      deposit: 2000.00,
      is_approve: 1,
      b2b_status: 'CONFIRMED',
      supplier_name: 'MegaFood Wholesale Distribution',
      mode: 'same_db',
      items: [
        { po_id: 5004, item_id: 101, name: 'Premium Arabica Coffee Beans 1kg', sku: 'COF-101', qty: 100, price: 42.00, unit: 'Bag', unit_id: 1, remote_item_uuid: 'SUP-ITEM-751', mapping_status: 'MAPPED' }
      ]
    }
  ],

  // Status History (inv_purchase_order_status_history table - Vanny's Assignment)
  statusHistory: [
    { id: 1, po_id: 5000, old_status: null, new_status: 'DRAFT', actor_type: 'BUYER', actor_user_id: 45, note: 'PO created by Vanny in buyer system', created_at: '2026-09-30 08:35:10' },
    { id: 2, po_id: 5000, old_status: 'DRAFT', new_status: 'SENT', actor_type: 'BUYER', actor_user_id: 45, note: 'Purchase Order officially submitted to MegaFood Distribution', created_at: '2026-09-30 09:00:15' },
    { id: 3, po_id: 5000, old_status: 'SENT', new_status: 'NEGOTIATING', actor_type: 'SUPPLIER', actor_user_id: 88, note: 'Supplier submitted Quotation Rev #1 with adjusted wholesale pricing ($10.50/unit)', created_at: '2026-09-30 09:45:00' },
    { id: 4, po_id: 5000, old_status: 'NEGOTIATING', new_status: 'NEGOTIATING', actor_type: 'BUYER', actor_user_id: 45, note: 'Buyer submitted Counter-Offer Rev #2 asking for volume discount', created_at: '2026-09-30 10:15:00' },

    { id: 5, po_id: 5001, old_status: null, new_status: 'DRAFT', actor_type: 'BUYER', actor_user_id: 45, note: 'PO created for remote warehouse', created_at: '2026-09-29 15:00:00' },
    { id: 6, po_id: 5001, old_status: 'DRAFT', new_status: 'SENT', actor_type: 'SYSTEM', actor_user_id: null, note: 'Outbox event dispatched via B2B API to remote endpoint', created_at: '2026-09-29 15:30:22' },

    { id: 7, po_id: 5002, old_status: 'CONFIRMED', new_status: 'RECEIVED', actor_type: 'BUYER', actor_user_id: 45, note: 'All goods inspected and received at Downtown Central Store', created_at: '2026-09-26 14:00:00' },
    { id: 8, po_id: 5002, old_status: 'RECEIVED', new_status: 'CLOSED', actor_type: 'SYSTEM', actor_user_id: null, note: 'Purchase invoice matched and final payment completed', created_at: '2026-09-27 16:30:00' },

    { id: 9, po_id: 5004, old_status: 'NEGOTIATING', new_status: 'CONFIRMED', actor_type: 'BUYER', actor_user_id: 45, note: 'Buyer accepted Quotation Rev #1. PO locked & confirmed for fulfillment.', created_at: '2026-09-28 11:00:00' }
  ],

  // Quotation Revisions (b2b_quotation & b2b_quotation_revision)
  quotations: {
    5000: {
      quotation_number: 'QT-2026-0008',
      status: 'OPEN',
      revisions: [
        {
          revision_no: 1,
          revision_type: 'SUPPLIER_OFFER',
          created_by_role: 'SUPPLIER',
          status: 'SUPERSEDED',
          note: 'Milk is in high demand, offered at $10.50. Coffee available as requested.',
          created_at: '2026-09-30 09:45:00',
          items: [
            { remote_item_uuid: 'BUYER-ITEM-100', requested_qty: 100, offered_qty: 100, price: 10.50, status: 'AVAILABLE' },
            { remote_item_uuid: 'BUYER-ITEM-101', requested_qty: 50, offered_qty: 50, price: 43.00, status: 'AVAILABLE' }
          ]
        },
        {
          revision_no: 2,
          revision_type: 'BUYER_COUNTER_OFFER',
          created_by_role: 'BUYER',
          status: 'OPEN',
          note: 'Can we agree on $10.20 per bottle if we commit to 100 bottles?',
          created_at: '2026-09-30 10:15:00',
          items: [
            { remote_item_uuid: 'BUYER-ITEM-100', requested_qty: 100, offered_qty: 100, price: 10.20, status: 'AVAILABLE' },
            { remote_item_uuid: 'BUYER-ITEM-101', requested_qty: 50, offered_qty: 50, price: 42.50, status: 'AVAILABLE' }
          ]
        }
      ]
    }
  },

  // Shipments & Receiving data
  shipments: {
    5000: [
      {
        shipment_number: 'SHP-2026-0005',
        shipment_date: '2026-09-30 13:00',
        expected_arrival_date: '2026-10-01 10:00',
        status: 'SHIPPED',
        note: 'Batch #A-99 via Cold Express Truck',
        items: [
          { item_id: 100, name: 'Fresh Organic Whole Milk 1L', shipped_qty: 100, received_qty: 0 },
          { item_id: 101, name: 'Premium Arabica Coffee Beans 1kg', shipped_qty: 50, received_qty: 0 }
        ]
      }
    ]
  },

  notifications: [
    { id: 1, title: 'New Supplier Quotation Received', message: 'MegaFood Distribution submitted offer QT-2026-0008 for PO-2026-00125.', time: '10 mins ago', unread: true },
    { id: 2, title: 'Outbox Event Dispatched', message: 'PO-2026-00126 sent across API connection to Prime Global Supply.', time: '2 hours ago', unread: true },
    { id: 3, title: 'Item Mapped by Supplier', message: 'Supplier confirmed mapping for BUYER-ITEM-100 -> SUP-ITEM-750.', time: 'Yesterday', unread: false }
  ],

  // Form creation staging
  formStep: 1,
  formItems: []
};

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  initPOForm();
  renderView('dashboard');
  setupEventListeners();
});

// View Navigation Handling
function initNavigation() {
  document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      const view = item.getAttribute('data-view');
      renderView(view);
    });
  });

  // Top action buttons
  document.getElementById('btnOpenDbInspector')?.addEventListener('click', () => {
    openModal('modalDbSchema');
  });

  document.getElementById('bellBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('notifDropdown');
    dropdown.classList.toggle('show');
    renderNotifications();
  });

  document.addEventListener('click', () => {
    document.getElementById('notifDropdown')?.classList.remove('show');
  });

  document.getElementById('btnMarkAllRead')?.addEventListener('click', () => {
    state.notifications.forEach(n => n.unread = false);
    renderNotifications();
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.style.display = 'none';
    showToast('All notifications marked as read', 'info');
  });

  document.getElementById('btnSimulateSupplier')?.addEventListener('click', () => {
    simulateSupplierAction();
  });
}

// Router Render Function
function renderView(viewName) {
  state.activeView = viewName;
  const container = document.getElementById('contentArea');

  switch (viewName) {
    case 'dashboard':
      container.innerHTML = getDashboardHtml();
      setupDashboardEvents();
      break;
    case 'outgoing-po':
      container.innerHTML = getOutgoingPoHtml();
      setupOutgoingPoEvents();
      break;
    case 'transactions':
      container.innerHTML = getTransactionsHtml();
      break;
    case 'status-history':
      container.innerHTML = getStatusHistoryHtml();
      break;
    case 'quotation-review':
      container.innerHTML = getQuotationReviewHtml();
      break;
    case 'receiving-invoices':
      container.innerHTML = getReceivingInvoicesHtml();
      break;
    case 'incoming-reference':
      container.innerHTML = getIncomingReferenceHtml();
      break;
    default:
      container.innerHTML = getDashboardHtml();
  }
}

// 1. Dashboard View
function getDashboardHtml() {
  const totalPos = state.purchaseOrders.length;
  const negotiatingCount = state.purchaseOrders.filter(p => p.b2b_status === 'NEGOTIATING').length;
  const confirmedCount = state.purchaseOrders.filter(p => p.b2b_status === 'CONFIRMED' || p.b2b_status === 'PARTIALLY_RECEIVED').length;
  const totalValue = state.purchaseOrders.reduce((acc, curr) => acc + curr.total, 0);

  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>Vanny's Buyer Command Center</h1>
        <div class="view-subtitle">Manage B2B Purchase Orders, Quotation Agreements, and Transaction Lifecycles</div>
      </div>
      <div class="header-buttons">
        <button class="btn-secondary" id="btnRefreshDash">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Sync Status
        </button>
        <button class="btn-primary" id="btnOpenNewPO">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create B2B Purchase Order
        </button>
      </div>
    </div>

    <!-- Stat Metrics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Active Outgoing POs</span>
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/></svg>
          </div>
        </div>
        <div class="stat-value">${totalPos}</div>
        <div class="stat-sub"><span>${state.transactions.length} Linked Transactions</span> &bull; 100% Validated</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">In Negotiation</span>
          <div class="stat-icon" style="color: #fbbf24;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </div>
        </div>
        <div class="stat-value" style="color: #fbbf24;">${negotiatingCount}</div>
        <div class="stat-sub"><span>Action Required:</span> Review Supplier Offers</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Confirmed & In-Transit</span>
          <div class="stat-icon" style="color: #34d399;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><rect width="18" height="12" x="3" y="9" rx="1"/><circle cx="17" cy="18" r="2"/></svg>
          </div>
        </div>
        <div class="stat-value" style="color: #34d399;">${confirmedCount}</div>
        <div class="stat-sub">Ready for Receiving & Stock-in</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">Total PO Value (B2B)</span>
          <div class="stat-icon" style="color: #38bdf8;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="stat-value" style="color: #38bdf8;">$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        <div class="stat-sub">Deposit paid: $${state.purchaseOrders.reduce((a, b) => a + (b.deposit || 0), 0).toFixed(2)}</div>
      </div>
    </div>

    <!-- Quick Workflow Pipeline Stepper -->
    <div class="pipeline-bar">
      <button class="pipeline-filter-chip active" data-filter="ALL">
        All POs <span class="chip-count">${totalPos}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="DRAFT">
        1. Draft <span class="chip-count">${state.purchaseOrders.filter(p => p.b2b_status === 'DRAFT').length}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="SENT">
        2. Sent to Supplier <span class="chip-count">${state.purchaseOrders.filter(p => p.b2b_status === 'SENT').length}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="NEGOTIATING">
        3. Negotiating Quotations <span class="chip-count">${negotiatingCount}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="CONFIRMED">
        4. Confirmed <span class="chip-count">${state.purchaseOrders.filter(p => p.b2b_status === 'CONFIRMED').length}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="PARTIALLY_RECEIVED">
        5. In-Transit / Receiving <span class="chip-count">${state.purchaseOrders.filter(p => p.b2b_status === 'PARTIALLY_RECEIVED').length}</span>
      </button>
      <button class="pipeline-filter-chip" data-filter="CLOSED">
        6. Closed / Completed <span class="chip-count">${state.purchaseOrders.filter(p => p.b2b_status === 'CLOSED').length}</span>
      </button>
    </div>

    <!-- Active Orders Table Card -->
    <div class="table-card">
      <div class="filter-toolbar" style="padding: 18px 20px 0 20px;">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="dashPoSearch" placeholder="Search PO #, Supplier branch, or Transaction UUID...">
        </div>
        <div class="filter-actions">
          <select class="form-control" style="width: 170px;" id="modeFilter">
            <option value="ALL">All Deployments</option>
            <option value="same_db">Same DB (Branch)</option>
            <option value="remote_db">Remote DB (API)</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Linked B2B Transaction</th>
              <th>Supplier Branch</th>
              <th>Deployment</th>
              <th>Items</th>
              <th>PO Total</th>
              <th>Status</th>
              <th>Internal Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="dashPoTableBody">
            ${renderPoRows(state.purchaseOrders)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderPoRows(orders) {
  if (orders.length === 0) {
    return `<tr><td colspan="9" style="text-align: center; padding: 36px; color: var(--text-dim);">No purchase orders found matching this criteria.</td></tr>`;
  }

  return orders.map(po => {
    const tx = state.transactions.find(t => t.id === po.b2b_transaction_id);
    const txDisplay = tx ? `<span class="tx-badge" title="UUID: ${tx.uuid}">${tx.transaction_no}</span>` : `<span class="tag">Legacy / Local</span>`;
    const modeTag = po.mode === 'same_db' 
      ? `<span class="tag">Same DB</span>` 
      : `<span class="tag" style="border-color: #06b6d4; color: #38bdf8;">Remote B2B (API)</span>`;
    const approveBadge = po.is_approve === 1 
      ? `<span class="tag success">&check; Approved</span>` 
      : `<span class="tag" style="color: #fbbf24;">Draft (0)</span>`;

    return `
      <tr class="clickable" onclick="openPoDetail(${po.id})">
        <td>
          <strong style="color: #38bdf8; font-size: 14px;">${po.po_number}</strong>
          <div style="font-size: 11px; color: var(--text-dim);">${po.po_date}</div>
        </td>
        <td>${txDisplay}</td>
        <td>
          <strong>${po.supplier_name}</strong>
          <div style="font-size: 11px; color: var(--text-dim);">Buyer: Downtown Store (ID 3)</div>
        </td>
        <td>${modeTag}</td>
        <td><strong>${po.items.length}</strong> items</td>
        <td><strong style="font-size: 14px;">$${po.total.toFixed(2)}</strong></td>
        <td><span class="status-badge ${po.b2b_status.toLowerCase()}">${po.b2b_status}</span></td>
        <td>${approveBadge}</td>
        <td onclick="event.stopPropagation()">
          <button class="btn-secondary btn-sm" onclick="openPoDetail(${po.id})">
            View / Workflow &rarr;
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function setupDashboardEvents() {
  document.getElementById('btnOpenNewPO')?.addEventListener('click', () => {
    openModal('modalCreatePO');
    resetCreatePoForm();
  });

  document.getElementById('btnRefreshDash')?.addEventListener('click', () => {
    showToast('Syncing B2B status with events engine...', 'info');
    renderView('dashboard');
  });

  // Pipeline chip filtering
  document.querySelectorAll('.pipeline-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.pipeline-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      filterDashboardTable(filter, document.getElementById('dashPoSearch')?.value || '', document.getElementById('modeFilter')?.value || 'ALL');
    });
  });

  // Search input
  document.getElementById('dashPoSearch')?.addEventListener('input', (e) => {
    const activeChip = document.querySelector('.pipeline-filter-chip.active');
    const filter = activeChip ? activeChip.getAttribute('data-filter') : 'ALL';
    filterDashboardTable(filter, e.target.value, document.getElementById('modeFilter')?.value || 'ALL');
  });

  // Mode filter
  document.getElementById('modeFilter')?.addEventListener('change', (e) => {
    const activeChip = document.querySelector('.pipeline-filter-chip.active');
    const filter = activeChip ? activeChip.getAttribute('data-filter') : 'ALL';
    filterDashboardTable(filter, document.getElementById('dashPoSearch')?.value || '', e.target.value);
  });
}

function filterDashboardTable(statusFilter, searchText, modeFilter) {
  let list = [...state.purchaseOrders];

  if (statusFilter !== 'ALL') {
    list = list.filter(po => po.b2b_status === statusFilter);
  }

  if (modeFilter !== 'ALL') {
    list = list.filter(po => po.mode === modeFilter);
  }

  if (searchText.trim()) {
    const q = searchText.toLowerCase();
    list = list.filter(po => 
      po.po_number.toLowerCase().includes(q) ||
      po.supplier_name.toLowerCase().includes(q) ||
      (po.b2b_status && po.b2b_status.toLowerCase().includes(q))
    );
  }

  const tbody = document.getElementById('dashPoTableBody');
  if (tbody) {
    tbody.innerHTML = renderPoRows(list);
  }
}

// 2. Outgoing PO Management View
function getOutgoingPoHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>Outgoing B2B Purchase Orders</h1>
        <div class="view-subtitle">Buyer Outgoing Flow &bull; Linking <code>inv_purchase_order</code> to <code>b2b_transaction</code></div>
      </div>
      <div class="header-buttons">
        <button class="btn-primary" onclick="openModal('modalCreatePO'); resetCreatePoForm();">
          + Create Outgoing PO
        </button>
      </div>
    </div>

    <div class="alert-info-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <div>
        <strong>Developer Implementation Rule 5 & 6:</strong>
        When creating a B2B Purchase Order, <code>inv_purchase_order.b2b_transaction_id</code> is populated with the root B2B transaction ID.
        <code>inv_purchase_order.supplier_id</code> remains NULL or legacy-only. Status transitions strictly follow:
        <code>DRAFT &rarr; SENT &rarr; NEGOTIATING &rarr; CONFIRMED &rarr; PARTIALLY_RECEIVED &rarr; RECEIVED &rarr; CLOSED &rarr; CANCELLED</code>.
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>PO #</th>
              <th>Transaction #</th>
              <th>Created Date</th>
              <th>Supplier Partner</th>
              <th>Items Detail</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderPoRows(state.purchaseOrders)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setupOutgoingPoEvents() {
  // Handled
}

// 3. Transactions View
function getTransactionsHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>B2B Transactions (<code>b2b_transaction</code>)</h1>
        <div class="view-subtitle">Root business entity connecting Buyer Branch and Supplier Branch</div>
      </div>
      <div class="header-buttons">
        <button class="btn-secondary" onclick="openModal('modalDbSchema')">View Schema Spec</button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID (Local)</th>
              <th>UUID (Cross-DB)</th>
              <th>Transaction No</th>
              <th>Buyer Branch (Local)</th>
              <th>Supplier Branch (Partner)</th>
              <th>Connection Type</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${state.transactions.map(tx => `
              <tr>
                <td><code>${tx.id}</code></td>
                <td><code style="font-size: 11px;">${tx.uuid}</code></td>
                <td><strong style="color: #818cf8;">${tx.transaction_no}</strong></td>
                <td>${tx.buyer_name} <br><small class="field-hint">UUID: ${tx.buyer_branch_uuid.substring(0, 12)}...</small></td>
                <td>${tx.supplier_name} <br><small class="field-hint">UUID: ${tx.supplier_branch_uuid.substring(0, 12)}...</small></td>
                <td>${tx.supplier_connection_id ? `<span class="tag" style="color: #38bdf8; border-color: #0284c7;">Remote API (Conn #${tx.supplier_connection_id})</span>` : `<span class="tag">Same Database</span>`}</td>
                <td><span class="status-badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
                <td style="font-size: 12px; color: var(--text-dim);">${tx.created_at}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Status History View
function getStatusHistoryHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>PO Status Transition History (<code>inv_purchase_order_status_history</code>)</h1>
        <div class="view-subtitle">Permanent audit log answering "Who changed what and why?"</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>PO #</th>
              <th>Old Status</th>
              <th>&rarr;</th>
              <th>New Status</th>
              <th>Actor Type</th>
              <th>User ID</th>
              <th>Commercial Note</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${state.statusHistory.map(h => {
              const po = state.purchaseOrders.find(p => p.id === h.po_id);
              const poNum = po ? po.po_number : `PO #${h.po_id}`;
              const actorClass = h.actor_type.toLowerCase();

              return `
                <tr>
                  <td><code>${h.id}</code></td>
                  <td><strong>${poNum}</strong></td>
                  <td>${h.old_status ? `<span class="status-badge ${h.old_status.toLowerCase()}">${h.old_status}</span>` : `<span style="color: var(--text-dim);">&mdash;</span>`}</td>
                  <td style="color: var(--text-dim);">&rarr;</td>
                  <td><span class="status-badge ${h.new_status.toLowerCase()}">${h.new_status}</span></td>
                  <td><span class="timeline-actor-pill ${actorClass}">${h.actor_type}</span></td>
                  <td><code>${h.actor_user_id !== null ? h.actor_user_id : 'SYSTEM'}</code></td>
                  <td style="max-width: 300px;">${h.note || '<span style="color: var(--text-dim);">&mdash;</span>'}</td>
                  <td style="font-size: 12px; color: var(--text-dim);">${h.created_at}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Quotation Review View
function getQuotationReviewHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>Supplier Quotations & Negotiation Workspace</h1>
        <div class="view-subtitle">Review supplier counter-offers, accept terms, or submit buyer revisions</div>
      </div>
    </div>

    <div class="alert-info-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <div>
        <strong>Rule 8: Quotation Revisions are Immutable.</strong>
        Neither buyer nor supplier ever overwrites an existing revision. Each counter-offer increments <code>revision_no</code>.
        Once an agreed quotation is accepted, PO status moves directly to <strong>CONFIRMED</strong>.
      </div>
    </div>

    <div class="table-card" style="padding: 24px;">
      <h3 style="margin-bottom: 16px;">Active Negotiation: PO-2026-00125 &bull; Quotation QT-2026-0008</h3>
      <div class="quotation-container">
        <div class="quotation-history-sidebar">
          <h4>Revisions History</h4>
          <div class="revision-cards-list">
            <div class="revision-card">
              <div class="rev-header"><span class="rev-no">Rev 1 (Supplier Offer)</span> <span class="tag">SUPERSEDED</span></div>
              <div class="rev-role">By: MegaFood Supply &bull; 09:45 AM</div>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Offered Milk at $10.50 (+5%)</p>
            </div>
            <div class="revision-card active">
              <div class="rev-header"><span class="rev-no">Rev 2 (Buyer Counter)</span> <span class="tag success">CURRENT OPEN</span></div>
              <div class="rev-role">By: Vanny (Buyer) &bull; 10:15 AM</div>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Requested volume compromise: $10.20</p>
            </div>
          </div>
        </div>

        <div class="quotation-main-content">
          <div style="background: var(--bg-surface); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <strong>Active Revision Comparison (Rev #2 vs Original PO)</strong>
                <div style="font-size: 12px; color: var(--text-muted);">Buyer Counter-Offer to MegaFood Distribution</div>
              </div>
              <div class="header-buttons">
                <button class="btn-primary" onclick="simulateSupplierAcceptance()">Simulate Supplier Accepts Rev #2</button>
              </div>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Original Requested Qty</th>
                  <th>Offered Qty</th>
                  <th>Original Price</th>
                  <th>Negotiated Price</th>
                  <th>Total</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fresh Organic Whole Milk 1L</td>
                  <td>100 Bottles</td>
                  <td><strong>100 Bottles</strong></td>
                  <td>$10.00</td>
                  <td><strong style="color: #fbbf24;">$10.20</strong></td>
                  <td>$1,020.00</td>
                  <td><span class="tag success">AVAILABLE</span></td>
                </tr>
                <tr>
                  <td>Premium Arabica Coffee Beans 1kg</td>
                  <td>50 Bags</td>
                  <td><strong>50 Bags</strong></td>
                  <td>$43.00</td>
                  <td><strong style="color: #34d399;">$42.50</strong></td>
                  <td>$2,125.00</td>
                  <td><span class="tag success">AVAILABLE</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 6. Receiving & Invoices View
function getReceivingInvoicesHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>Fulfillment, Goods Receiving & Invoices</h1>
        <div class="view-subtitle">Track incoming shipments, stock-in receiving, and purchase invoice creation</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Shipment #</th>
              <th>PO Reference</th>
              <th>Ship Date</th>
              <th>Expected Arrival</th>
              <th>Status</th>
              <th>Goods Shipped vs Received</th>
              <th>Purchase Invoice Ref</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color: #818cf8;">SHP-2026-0005</strong></td>
              <td>PO-2026-00125</td>
              <td>2026-09-30 13:00</td>
              <td>2026-10-01 10:00</td>
              <td><span class="status-badge sent">SHIPPED (IN-TRANSIT)</span></td>
              <td>100 Milk, 50 Coffee dispatched</td>
              <td><code>inv_poinvoice</code> (Pending receiving)</td>
              <td><button class="btn-primary btn-sm" onclick="simulateReceivingGoods(5000)">Record Goods Arrival</button></td>
            </tr>
            <tr>
              <td><strong style="color: #818cf8;">SHP-2026-0001</strong></td>
              <td>PO-2026-00120</td>
              <td>2026-09-25 14:00</td>
              <td>2026-09-26 11:00</td>
              <td><span class="status-badge received">RECEIVED (COMPLETE)</span></td>
              <td>200 Bread received (0 damaged)</td>
              <td><span class="tag success">PINV-2026-0089</span></td>
              <td><span class="tag success">&check; Reconciled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. Incoming Reference View
function getIncomingReferenceHtml() {
  return `
    <div class="view-header">
      <div class="view-title-group">
        <h1>Incoming Order Integration Reference</h1>
        <div class="view-subtitle">End-to-end verification of how Supplier Branch receives and maps Vanny's PO</div>
      </div>
    </div>

    <div class="alert-info-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <div>
        <strong>End-to-End B2B Integration:</strong>
        When Vanny submits an outgoing PO, the supplier side creates a <code>b2b_incoming_order</code>.
        The supplier maps the buyer's item identities to their local inventory via <code>b2b_item_mapping</code>.
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Incoming Order ID</th>
              <th>Buyer PO Number</th>
              <th>Buyer Branch UUID</th>
              <th>Remote PO UUID</th>
              <th>Items Mapping Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>8001</code></td>
              <td><strong>PO-2026-00125</strong></td>
              <td><code>550e8400-e29b-41d4-a716-446655440000</code></td>
              <td><code>PO-UUID-5000</code></td>
              <td><span class="tag success">2 of 2 MAPPED</span> (Item 100 &rarr; 750, Item 101 &rarr; 751)</td>
              <td><span class="status-badge received">RECEIVED</span></td>
            </tr>
            <tr>
              <td><code>8002</code></td>
              <td><strong>PO-2026-00126</strong></td>
              <td><code>550e8400-e29b-41d4-a716-446655440000</code></td>
              <td><code>PO-UUID-5001</code></td>
              <td><span class="tag" style="color: #fbbf24;">1 UNMAPPED</span> (Cane Sugar Sticks pending mapping)</td>
              <td><span class="status-badge received">RECEIVED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PO DETAIL WORKFLOW MODAL
// -------------------------------------------------------------
function openPoDetail(poId) {
  const po = state.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  const tx = state.transactions.find(t => t.id === po.b2b_transaction_id);

  // Set modal header data
  document.getElementById('detailPoNumber').innerText = po.po_number;
  document.getElementById('detailStatusBadge').innerText = po.b2b_status;
  document.getElementById('detailStatusBadge').className = `status-badge ${po.b2b_status.toLowerCase()}`;
  document.getElementById('detailTxBadge').innerText = tx ? `Tx: ${tx.transaction_no}` : 'Local PO';
  document.getElementById('detailPartnerSubtitle').innerHTML = `Buyer: <strong>Downtown Central (ID: 3)</strong> &bull; Supplier: <strong>${po.supplier_name}</strong>`;

  // Update Stepper
  updateWorkflowStepper(po.b2b_status);

  // Tab 1: Meta Cards & Items
  document.getElementById('detPoDate').innerText = po.po_date;
  document.getElementById('detSupplierName').innerText = po.supplier_name;
  document.getElementById('detPoTotal').innerText = `$${po.total.toFixed(2)}`;
  document.getElementById('detIsApprove').innerHTML = po.is_approve === 1 
    ? `<span class="tag success">&check; Approved (1)</span>` 
    : `<span class="tag" style="color: #fbbf24;">Draft (0)</span>`;

  // Render Items Table
  const tbody = document.getElementById('detailItemsTableBody');
  tbody.innerHTML = po.items.map(item => `
    <tr>
      <td><code>${item.item_id}</code></td>
      <td><strong>${item.name}</strong></td>
      <td><code>${item.sku}</code></td>
      <td><strong>${item.qty}</strong></td>
      <td>${item.unit}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><strong>$${(item.qty * item.price).toFixed(2)}</strong></td>
      <td>${item.mapping_status === 'MAPPED' ? `<span class="tag success">&check; Mapped (${item.remote_item_uuid})</span>` : `<span class="tag" style="color: #fbbf24;">Pending Mapping</span>`}</td>
    </tr>
  `).join('');

  // Render Action Ribbon
  renderPoActionRibbon(po);

  // Tab 2: Quotations & Revisions
  renderQuotationTab(po);

  // Tab 3: Status History
  renderHistoryTab(po);

  // Tab 4: Fulfillment
  renderFulfillmentTab(po);

  // Tab 5: DB Record View
  renderDbRecordTab(po, tx);

  // Setup detail tabs listener
  setupDetailTabs();

  // Reset to first tab
  switchDetailTab('tab-po-items');

  openModal('modalPoDetail');
}

function updateWorkflowStepper(currentStatus) {
  const statusOrder = ['DRAFT', 'SENT', 'NEGOTIATING', 'CONFIRMED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const nodes = document.querySelectorAll('#detailStepperBar .step-node');
  const lines = document.querySelectorAll('#detailStepperBar .step-line');

  nodes.forEach((node, idx) => {
    node.className = 'step-node';
    const nodeStatus = node.getAttribute('data-status');
    const nodeIndex = statusOrder.indexOf(nodeStatus);

    if (nodeIndex < currentIndex) {
      node.classList.add('completed');
    } else if (nodeIndex === currentIndex) {
      node.classList.add('current');
    }
  });

  lines.forEach((line, idx) => {
    line.className = 'step-line';
    if (idx < currentIndex) {
      line.classList.add('active');
    }
  });
}

function renderPoActionRibbon(po) {
  const ribbon = document.getElementById('poActionRibbon');
  let buttons = '';

  switch (po.b2b_status) {
    case 'DRAFT':
      buttons = `
        <button class="btn-secondary" onclick="triggerStatusChange(${po.id}, 'CANCELLED', 'BUYER', 'Buyer cancelled draft PO')">Cancel PO</button>
        <button class="btn-primary" onclick="sendPoToSupplier(${po.id})">Send PO to Supplier (SENT) &rarr;</button>
      `;
      break;
    case 'SENT':
      buttons = `
        <span style="font-size: 13px; color: var(--text-muted); align-self: center; margin-right: 12px;">Waiting for Supplier branch to review order and submit quotation...</span>
        <button class="btn-secondary" onclick="simulateSupplierQuotation(${po.id})">Simulate: Supplier Sends Quotation</button>
      `;
      break;
    case 'NEGOTIATING':
      buttons = `
        <button class="btn-secondary" onclick="switchDetailTab('tab-quotations')">Review Quotation Revisions</button>
        <button class="btn-primary" onclick="acceptQuotationAndConfirm(${po.id})">Accept Quotation & Confirm PO (CONFIRMED) &rarr;</button>
      `;
      break;
    case 'CONFIRMED':
      buttons = `
        <span style="font-size: 13px; color: #34d399; align-self: center; margin-right: 12px;">PO Confirmed & Locked. Ready for Supplier dispatch.</span>
        <button class="btn-primary" onclick="simulateSupplierDispatch(${po.id})">Simulate: Supplier Dispatches Shipment &rarr;</button>
      `;
      break;
    case 'PARTIALLY_RECEIVED':
      buttons = `
        <button class="btn-primary" onclick="simulateReceivingGoods(${po.id})">Record Goods Arrival (RECEIVED) &rarr;</button>
      `;
      break;
    case 'RECEIVED':
      buttons = `
        <span style="font-size: 13px; color: #34d399; align-self: center; margin-right: 12px;">Goods received in warehouse. Matching purchase invoice.</span>
        <button class="btn-primary" onclick="triggerStatusChange(${po.id}, 'CLOSED', 'SYSTEM', 'Purchase invoice reconciled, transaction completed')">Close Transaction &rarr;</button>
      `;
      break;
    case 'CLOSED':
      buttons = `<span class="tag success" style="font-size: 13px; padding: 6px 14px;">Transaction Successfully Closed</span>`;
      break;
    default:
      buttons = `<button class="btn-secondary" onclick="openTransitionModal(${po.id})">Manual Transition</button>`;
  }

  ribbon.innerHTML = buttons;
}

function renderQuotationTab(po) {
  const quote = state.quotations[po.id];
  const listEl = document.getElementById('revisionList');
  const mainEl = document.getElementById('revisionActiveContent');

  if (!quote || !quote.revisions || quote.revisions.length === 0) {
    listEl.innerHTML = `<div style="color: var(--text-dim); padding: 12px;">No quotation received yet for this PO.</div>`;
    mainEl.innerHTML = `
      <div style="text-align: center; padding: 48px; color: var(--text-dim);">
        <p>This Purchase Order is in <strong>${po.b2b_status}</strong> state.</p>
        <p style="font-size: 12px; margin-top: 8px;">Once the supplier receives the order, their revisions will appear here automatically.</p>
        <button class="btn-secondary btn-sm" style="margin-top: 14px;" onclick="simulateSupplierQuotation(${po.id})">Generate Simulated Supplier Offer</button>
      </div>
    `;
    return;
  }

  document.getElementById('quotationBadgeCount').innerText = `Rev ${quote.revisions.length}`;

  listEl.innerHTML = quote.revisions.map((rev, idx) => `
    <div class="revision-card ${idx === quote.revisions.length - 1 ? 'active' : ''}">
      <div class="rev-header">
        <span class="rev-no">Rev #${rev.revision_no} (${rev.revision_type})</span>
        <span class="tag ${rev.status === 'ACCEPTED' ? 'success' : ''}">${rev.status}</span>
      </div>
      <div class="rev-role">Role: ${rev.created_by_role} &bull; ${rev.created_at}</div>
      <div style="font-size: 12px; margin-top: 6px; color: var(--text-muted);">${rev.note || 'No notes attached.'}</div>
    </div>
  `).join('');

  // Active latest revision
  const latestRev = quote.revisions[quote.revisions.length - 1];
  mainEl.innerHTML = `
    <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <h3>Latest Offer: Revision #${latestRev.revision_no} (${latestRev.revision_type})</h3>
          <div style="font-size: 12px; color: var(--text-muted);">Status: <strong>${latestRev.status}</strong> &bull; From: <strong>${latestRev.created_by_role}</strong></div>
        </div>
        ${po.b2b_status === 'NEGOTIATING' ? `
          <div class="submit-button-group">
            <button class="btn-secondary" onclick="promptCounterOffer(${po.id})">Submit Buyer Counter-Offer</button>
            <button class="btn-primary" onclick="acceptQuotationAndConfirm(${po.id})">Accept Offer & Confirm PO</button>
          </div>
        ` : ''}
      </div>

      <p style="background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 16px;">
        <strong>Commercial Note:</strong> ${latestRev.note || 'Standard wholesale terms apply.'}
      </p>

      <table class="data-table">
        <thead>
          <tr>
            <th>Product UUID / Item</th>
            <th>Requested Qty</th>
            <th>Offered Qty</th>
            <th>Offered Price</th>
            <th>Total ($)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${latestRev.items.map(item => `
            <tr>
              <td><code>${item.remote_item_uuid}</code></td>
              <td>${item.requested_qty}</td>
              <td><strong>${item.offered_qty}</strong></td>
              <td><strong>$${item.price.toFixed(2)}</strong></td>
              <td><strong>$${(item.offered_qty * item.price).toFixed(2)}</strong></td>
              <td><span class="tag success">${item.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderHistoryTab(po) {
  const history = state.statusHistory.filter(h => h.po_id === po.id);
  document.getElementById('historyBadgeCount').innerText = history.length;

  const container = document.getElementById('poStatusTimeline');
  if (history.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); padding: 18px;">No status transitions recorded yet.</div>`;
    return;
  }

  container.innerHTML = history.map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-marker">&bull;</div>
      <div class="timeline-card">
        <div class="timeline-title-row">
          <div>
            <span class="timeline-actor-pill ${item.actor_type.toLowerCase()}">${item.actor_type}</span>
            ${item.actor_user_id ? `<span style="font-size: 11.5px; color: var(--text-muted); margin-left: 6px;">User #${item.actor_user_id}</span>` : ''}
          </div>
          <span class="timeline-time">${item.created_at}</span>
        </div>
        <div class="timeline-text">${item.note || 'Status updated'}</div>
        <div class="timeline-state-change">
          Transition: <code>${item.old_status || 'START'}</code> &rarr; <code>${item.new_status}</code>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('btnManualStatusTransition').onclick = () => {
    openTransitionModal(po.id);
  };
}

function renderFulfillmentTab(po) {
  const container = document.getElementById('fulfillmentContainer');
  const shipments = state.shipments[po.id] || [];

  if (shipments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; color: var(--text-dim);">
        <p>No shipments created for this order yet.</p>
        <p style="font-size: 12px; margin-top: 6px;">Shipments are generated after the PO reaches <strong>CONFIRMED</strong> status.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = shipments.map(s => `
    <div style="background: var(--bg-surface); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <h4>Shipment: <span style="color: #38bdf8;">${s.shipment_number}</span></h4>
          <span style="font-size: 12px; color: var(--text-muted);">Dispatched: ${s.shipment_date} &bull; Expected: ${s.expected_arrival_date}</span>
        </div>
        <div>
          <span class="status-badge ${s.status.toLowerCase()}">${s.status}</span>
        </div>
      </div>
      <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 12px;">${s.note}</p>
      <table class="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Shipped Qty</th>
            <th>Received Qty</th>
            <th>Difference / Shortage</th>
          </tr>
        </thead>
        <tbody>
          ${s.items.map(i => `
            <tr>
              <td><strong>${i.name}</strong></td>
              <td>${i.shipped_qty}</td>
              <td><strong>${i.received_qty}</strong></td>
              <td>${i.shipped_qty - i.received_qty > 0 ? `<span class="tag" style="color: #f87171;">${i.shipped_qty - i.received_qty} Missing/Shortage</span>` : `<span class="tag success">&check; Reconciled</span>`}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');
}

function renderDbRecordTab(po, tx) {
  const liveTxIdElements = document.querySelectorAll('.live-tx-id');
  liveTxIdElements.forEach(el => el.innerText = tx ? tx.id : 'NULL');

  const livePoIdElements = document.querySelectorAll('.live-po-id');
  livePoIdElements.forEach(el => el.innerText = po.id);

  document.getElementById('sqlViewTransaction').innerText = JSON.stringify(tx || {}, null, 2);
  document.getElementById('sqlViewPO').innerText = JSON.stringify({
    id: po.id,
    b2b_transaction_id: po.b2b_transaction_id,
    branch_id: po.branch_id,
    supplier_id: po.supplier_id,
    po_number: po.po_number,
    po_date: po.po_date,
    total: po.total,
    deposit: po.deposit,
    is_approve: po.is_approve
  }, null, 2);

  document.getElementById('sqlViewPoItems').innerText = JSON.stringify(po.items.map(i => ({
    po_id: po.id,
    item_id: i.item_id,
    qty: i.qty,
    price: i.price,
    currency_id: 1,
    unit_id: i.unit_id
  })), null, 2);

  const poHistory = state.statusHistory.filter(h => h.po_id === po.id);
  document.getElementById('sqlViewPoHistory').innerText = JSON.stringify(poHistory, null, 2);
}

function setupDetailTabs() {
  document.querySelectorAll('.detail-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchDetailTab(tabId);
    });
  });
}

function switchDetailTab(tabId) {
  document.querySelectorAll('.detail-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.modal-body .tab-pane').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.detail-tabs .tab-btn[data-tab="${tabId}"]`);
  const activePane = document.getElementById(tabId);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');
}

// -------------------------------------------------------------
// WORKFLOW ACTIONS & SIMULATIONS
// -------------------------------------------------------------

function sendPoToSupplier(poId) {
  triggerStatusChange(poId, 'SENT', 'BUYER', 'Buyer officially sent purchase order to supplier');
  showToast(`Purchase order sent to supplier successfully!`, 'success');
  // Add notification
  state.notifications.unshift({
    id: Date.now(),
    title: 'PO Sent to Supplier',
    message: `PO #${poId} dispatched to partner. Waiting for supplier quotation.`,
    time: 'Just now',
    unread: true
  });
}

function acceptQuotationAndConfirm(poId) {
  const quote = state.quotations[poId];
  if (quote && quote.revisions.length > 0) {
    quote.revisions[quote.revisions.length - 1].status = 'ACCEPTED';
    quote.status = 'ACCEPTED';
  }

  triggerStatusChange(poId, 'CONFIRMED', 'BUYER', 'Buyer accepted quotation terms. PO confirmed and locked for fulfillment.');
  showToast(`Quotation accepted! PO is now CONFIRMED.`, 'success');
}

function promptCounterOffer(poId) {
  const targetPrice = prompt('Enter your counter-offer target price for Milk ($):', '10.10');
  if (!targetPrice) return;

  const quote = state.quotations[poId];
  if (!quote) return;

  const newRevNo = quote.revisions.length + 1;
  quote.revisions.forEach(r => r.status = 'SUPERSEDED');

  quote.revisions.push({
    revision_no: newRevNo,
    revision_type: 'BUYER_COUNTER_OFFER',
    created_by_role: 'BUYER',
    status: 'OPEN',
    note: `Buyer counter-offer adjusting price to $${parseFloat(targetPrice).toFixed(2)}`,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: [
      { remote_item_uuid: 'BUYER-ITEM-100', requested_qty: 100, offered_qty: 100, price: parseFloat(targetPrice), status: 'AVAILABLE' },
      { remote_item_uuid: 'BUYER-ITEM-101', requested_qty: 50, offered_qty: 50, price: 42.50, status: 'AVAILABLE' }
    ]
  });

  triggerStatusChange(poId, 'NEGOTIATING', 'BUYER', `Buyer sent counter-offer revision #${newRevNo}`);
  showToast(`Counter-offer revision #${newRevNo} submitted to supplier!`, 'success');
  openPoDetail(poId);
  switchDetailTab('tab-quotations');
}

function simulateSupplierQuotation(poId) {
  const quote = state.quotations[poId] = state.quotations[poId] || {
    quotation_number: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'OPEN',
    revisions: []
  };

  quote.revisions.push({
    revision_no: quote.revisions.length + 1,
    revision_type: 'SUPPLIER_OFFER',
    created_by_role: 'SUPPLIER',
    status: 'OPEN',
    note: 'Supplier offer: slight increase on milk due to limited stock, coffee available.',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: [
      { remote_item_uuid: 'BUYER-ITEM-100', requested_qty: 100, offered_qty: 100, price: 10.50, status: 'AVAILABLE' },
      { remote_item_uuid: 'BUYER-ITEM-101', requested_qty: 50, offered_qty: 50, price: 43.00, status: 'AVAILABLE' }
    ]
  });

  triggerStatusChange(poId, 'NEGOTIATING', 'SUPPLIER', 'Supplier submitted initial commercial quotation');
  showToast('Simulated: Supplier sent quotation revision!', 'info');
  openPoDetail(poId);
  switchDetailTab('tab-quotations');
}

function simulateSupplierDispatch(poId) {
  state.shipments[poId] = [
    {
      shipment_number: `SHP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shipment_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      expected_arrival_date: 'Tomorrow 10:00 AM',
      status: 'SHIPPED',
      note: 'Dispatched via Express Courier. Tracking: B2B-EXP-8899',
      items: [
        { item_id: 100, name: 'Fresh Organic Whole Milk 1L', shipped_qty: 100, received_qty: 0 },
        { item_id: 101, name: 'Premium Arabica Coffee Beans 1kg', shipped_qty: 50, received_qty: 0 }
      ]
    }
  ];

  triggerStatusChange(poId, 'PARTIALLY_RECEIVED', 'SUPPLIER', 'Supplier dispatched shipment SHP-2026-0005');
  showToast('Simulated: Supplier shipped goods!', 'info');
  openPoDetail(poId);
  switchDetailTab('tab-fulfillment');
}

function simulateReceivingGoods(poId) {
  const shipments = state.shipments[poId];
  if (shipments && shipments.length > 0) {
    shipments[0].status = 'RECEIVED';
    shipments[0].items.forEach(i => i.received_qty = i.shipped_qty);
  }

  triggerStatusChange(poId, 'RECEIVED', 'BUYER', 'Goods received in warehouse. Verified quantities.');
  showToast('Goods received successfully recorded!', 'success');
  openPoDetail(poId);
  switchDetailTab('tab-fulfillment');
}

function simulateSupplierAcceptance() {
  const poId = 5000;
  acceptQuotationAndConfirm(poId);
  renderView('quotation-review');
}

function triggerStatusChange(poId, newStatus, actorType, note) {
  const po = state.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  const oldStatus = po.b2b_status;
  po.b2b_status = newStatus;

  // Insert into inv_purchase_order_status_history
  const newHistoryRecord = {
    id: state.statusHistory.length + 1,
    po_id: poId,
    old_status: oldStatus,
    new_status: newStatus,
    actor_type: actorType,
    actor_user_id: actorType === 'BUYER' ? 45 : null,
    note: note,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  state.statusHistory.push(newHistoryRecord);

  // If detail modal is open, refresh it
  if (document.getElementById('modalPoDetail').classList.contains('open')) {
    openPoDetail(poId);
  }

  // Refresh counts
  updateMenuCounts();
}

function updateMenuCounts() {
  const countOutgoing = document.getElementById('countOutgoing');
  if (countOutgoing) countOutgoing.innerText = state.purchaseOrders.length;
}

// -------------------------------------------------------------
// PO CREATION WIZARD (Step 1 -> Step 2 -> Step 3)
// -------------------------------------------------------------
function initPOForm() {
  populateSupplierBranches();

  // Mode change
  document.getElementById('poSupplierMode')?.addEventListener('change', (e) => {
    populateSupplierBranches();
  });

  // Step 1 -> Step 2
  document.getElementById('btnGoStep2')?.addEventListener('click', () => {
    setFormStep(2);
    renderCreatePoItems();
  });

  // Step 2 -> Step 1
  document.getElementById('btnBackStep1')?.addEventListener('click', () => {
    setFormStep(1);
  });

  // Step 2 -> Step 3
  document.getElementById('btnGoStep3')?.addEventListener('click', () => {
    if (state.formItems.length === 0) {
      alert('Please add at least one line item to your Purchase Order.');
      return;
    }
    setFormStep(3);
    renderStep3Review();
  });

  // Step 3 -> Step 2
  document.getElementById('btnBackStep2')?.addEventListener('click', () => {
    setFormStep(2);
  });

  // Quick item add
  document.getElementById('btnAddQuickItem')?.addEventListener('click', () => {
    addRandomProductToForm();
  });

  // Auto Gen PO Number
  document.getElementById('btnGenPoNum')?.addEventListener('click', () => {
    document.getElementById('poNumber').value = `PO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  });

  // Save as Draft
  document.getElementById('btnSaveAsDraft')?.addEventListener('click', () => {
    saveNewPurchaseOrder('DRAFT');
  });

  // Save & Send
  document.getElementById('btnSaveAndSend')?.addEventListener('click', () => {
    saveNewPurchaseOrder('SENT');
  });
}

function resetCreatePoForm() {
  state.formStep = 1;
  state.formItems = [
    { ...state.availableProducts[0], qty: 100, price: state.availableProducts[0].default_price },
    { ...state.availableProducts[1], qty: 50, price: state.availableProducts[1].default_price }
  ];

  document.getElementById('poNumber').value = `PO-2026-001${Math.floor(30 + Math.random() * 70)}`;
  document.getElementById('poDate').value = new Date().toISOString().substring(0, 16);
  setFormStep(1);
}

function setFormStep(step) {
  state.formStep = step;

  // Step tabs
  document.querySelectorAll('.form-steps .form-step').forEach(s => {
    const sNum = parseInt(s.getAttribute('data-step'));
    s.classList.toggle('active', sNum === step);
  });

  // Step panes
  document.querySelectorAll('.step-content').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`step${step}`).classList.add('active');
}

function populateSupplierBranches() {
  const mode = document.getElementById('poSupplierMode')?.value || 'same_db';
  const select = document.getElementById('poSupplierBranch');
  if (!select) return;

  const filtered = state.supplierBranches.filter(b => b.mode === mode);
  select.innerHTML = filtered.map(b => `
    <option value="${b.uuid}" data-mode="${b.mode}" data-id="${b.id || ''}" data-name="${b.name}">
      ${b.name} (${b.mode === 'same_db' ? 'Local DB Branch' : 'Remote API Partner'})
    </option>
  `).join('');
}

function addRandomProductToForm() {
  const available = state.availableProducts.find(p => !state.formItems.some(i => i.id === p.id));
  if (!available) {
    showToast('All available catalog products have been added!', 'info');
    return;
  }
  state.formItems.push({
    ...available,
    qty: 50,
    price: available.default_price
  });
  renderCreatePoItems();
}

function renderCreatePoItems() {
  const tbody = document.getElementById('createPoItemsBody');
  let total = 0;

  tbody.innerHTML = state.formItems.map((item, idx) => {
    const subtotal = item.qty * item.price;
    total += subtotal;

    return `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <strong>${item.name}</strong>
          <div style="font-size: 11px; color: var(--text-dim);">SKU: ${item.sku} &bull; Barcode: ${item.barcode}</div>
        </td>
        <td><code>${item.id}</code></td>
        <td>
          <input type="number" class="form-control" style="width: 90px;" min="1" value="${item.qty}" onchange="updateFormItem(${idx}, 'qty', this.value)">
        </td>
        <td>${item.unit}</td>
        <td>
          <input type="number" step="0.01" class="form-control" style="width: 100px;" min="0.01" value="${item.price}" onchange="updateFormItem(${idx}, 'price', this.value)">
        </td>
        <td><strong>$${subtotal.toFixed(2)}</strong></td>
        <td>
          <button type="button" class="btn-secondary btn-sm" style="color: #f87171;" onclick="removeFormItem(${idx})">&times;</button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('modalLineCount').innerText = state.formItems.length;
  document.getElementById('modalTotalPreview').innerText = `$${total.toFixed(2)}`;
}

window.updateFormItem = function(index, field, value) {
  if (state.formItems[index]) {
    state.formItems[index][field] = parseFloat(value) || 0;
    renderCreatePoItems();
  }
};

window.removeFormItem = function(index) {
  state.formItems.splice(index, 1);
  renderCreatePoItems();
};

function renderStep3Review() {
  const supplierSelect = document.getElementById('poSupplierBranch');
  const selectedOption = supplierSelect.options[supplierSelect.selectedIndex];
  const supplierName = selectedOption.getAttribute('data-name');
  const mode = selectedOption.getAttribute('data-mode');
  const poNum = document.getElementById('poNumber').value;

  const total = state.formItems.reduce((a, b) => a + (b.qty * b.price), 0);

  document.getElementById('revSupplierName').innerText = supplierName;
  document.getElementById('revModeTag').innerText = mode === 'same_db' ? 'Same Database' : 'Remote API Partner';
  document.getElementById('revPoNumber').innerText = poNum;
  document.getElementById('revItemCount').innerText = `${state.formItems.length} lines`;
  document.getElementById('revTotalAmount').innerText = `$${total.toFixed(2)}`;

  // Architecture preview JSON
  const previewData = {
    "b2b_transaction": {
      "uuid": "auto-generated-uuid-v4",
      "transaction_no": "B2B-2026-AUTO",
      "buyer_branch_id": state.currentBranch.id,
      "buyer_branch_uuid": state.currentBranch.uuid,
      "supplier_branch_uuid": selectedOption.value,
      "supplier_connection_id": mode === 'remote_db' ? 15 : null,
      "status": "OPEN"
    },
    "inv_purchase_order": {
      "po_number": poNum,
      "branch_id": state.currentBranch.id,
      "b2b_transaction_id": "auto-linked-id",
      "supplier_id": null,
      "total": total,
      "is_approve": parseInt(document.getElementById('poIsApprove').value)
    },
    "inv_purchase_order_item (Composite PK: po_id, item_id)": state.formItems.map(i => ({
      "item_id": i.id,
      "qty": i.qty,
      "price": i.price,
      "unit_id": i.unit_id
    }))
  };

  document.getElementById('dbJsonPreview').innerText = JSON.stringify(previewData, null, 2);
}

function saveNewPurchaseOrder(initialStatus) {
  const supplierSelect = document.getElementById('poSupplierBranch');
  const selectedOption = supplierSelect.options[supplierSelect.selectedIndex];
  const supplierUuid = selectedOption.value;
  const supplierName = selectedOption.getAttribute('data-name');
  const mode = selectedOption.getAttribute('data-mode');
  const poNum = document.getElementById('poNumber').value;
  const poDate = document.getElementById('poDate').value;
  const isApprove = parseInt(document.getElementById('poIsApprove').value);

  const total = state.formItems.reduce((a, b) => a + (b.qty * b.price), 0);

  // 1. Create B2B Transaction
  const newTxId = 1000 + state.transactions.length + 1;
  const newTx = {
    id: newTxId,
    uuid: `b2b-tx-uuid-${newTxId}`,
    transaction_no: `B2B-2026-${String(newTxId).padStart(6, '0')}`,
    buyer_business_uuid: state.currentBranch.business_uuid,
    buyer_branch_uuid: state.currentBranch.uuid,
    buyer_branch_id: state.currentBranch.id,
    buyer_name: state.currentBranch.name,
    supplier_business_uuid: 'sup-biz-001',
    supplier_branch_uuid: supplierUuid,
    supplier_branch_id: mode === 'same_db' ? 8 : null,
    supplier_name: supplierName,
    supplier_connection_id: mode === 'remote_db' ? 15 : null,
    status: 'OPEN',
    created_by_user_id: 45,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  state.transactions.push(newTx);

  // 2. Create Purchase Order
  const newPoId = 5000 + state.purchaseOrders.length + 1;
  const newPo = {
    id: newPoId,
    b2b_transaction_id: newTxId,
    branch_id: state.currentBranch.id,
    supplier_id: null,
    po_number: poNum,
    po_date: poDate.replace('T', ' ') + ':00',
    total: total,
    deposit: 0,
    is_approve: isApprove,
    b2b_status: initialStatus,
    supplier_name: supplierName,
    mode: mode,
    items: state.formItems.map(i => ({
      po_id: newPoId,
      item_id: i.id,
      name: i.name,
      sku: i.sku,
      qty: i.qty,
      price: i.price,
      unit: i.unit,
      unit_id: i.unit_id,
      remote_item_uuid: null,
      mapping_status: 'UNMAPPED'
    }))
  };
  state.purchaseOrders.unshift(newPo);

  // 3. Create initial status history entry
  state.statusHistory.push({
    id: state.statusHistory.length + 1,
    po_id: newPoId,
    old_status: null,
    new_status: initialStatus,
    actor_type: 'BUYER',
    actor_user_id: 45,
    note: initialStatus === 'SENT' ? 'PO created & sent to supplier branch immediately' : 'Draft PO saved in system',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });

  closeModal('modalCreatePO');
  showToast(`B2B Purchase Order ${poNum} successfully created!`, 'success');
  renderView(state.activeView);
  updateMenuCounts();
}

// -------------------------------------------------------------
// STATUS TRANSITION MODAL (MANUAL AUDIT SIMULATOR)
// -------------------------------------------------------------
function openTransitionModal(poId) {
  const po = state.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  document.getElementById('transOldStatus').value = po.b2b_status;
  document.getElementById('transNewStatus').value = 'CONFIRMED';
  document.getElementById('transNote').value = '';

  const form = document.getElementById('transitionForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const newStatus = document.getElementById('transNewStatus').value;
    const actorType = document.getElementById('transActorType').value;
    const note = document.getElementById('transNote').value;

    triggerStatusChange(poId, newStatus, actorType, note);
    closeModal('modalTransition');
    showToast(`Status transitioned to ${newStatus}`, 'success');
  };

  openModal('modalTransition');
}

// -------------------------------------------------------------
// GENERAL MODALS & TOAST UTILITIES
// -------------------------------------------------------------
function initModals() {
  document.getElementById('btnCloseCreatePO')?.addEventListener('click', () => closeModal('modalCreatePO'));
  document.getElementById('btnClosePoDetail')?.addEventListener('click', () => closeModal('modalPoDetail'));
  document.getElementById('btnCloseTransition')?.addEventListener('click', () => closeModal('modalTransition'));
  document.getElementById('btnCancelTransition')?.addEventListener('click', () => closeModal('modalTransition'));
  document.getElementById('btnCloseDbSchema')?.addEventListener('click', () => closeModal('modalDbSchema'));

  // Close on outside overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function renderNotifications() {
  const listEl = document.getElementById('notifList');
  if (!listEl) return;

  listEl.innerHTML = state.notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-item-title">${n.title}</div>
      <div class="notif-item-desc">${n.message}</div>
      <div style="font-size: 10.5px; color: var(--text-dim); margin-top: 4px;">${n.time}</div>
    </div>
  `).join('');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function simulateSupplierAction() {
  const actions = [
    () => {
      showToast('Supplier partner dispatched new Quotation Revision for review!', 'info');
      simulateSupplierQuotation(5000);
    },
    () => {
      showToast('Supplier confirmed item mapping for BUYER-ITEM-102!', 'success');
      state.notifications.unshift({
        id: Date.now(),
        title: 'Item Mapping Completed',
        message: 'Supplier branch mapped BUYER-ITEM-102 -> SUP-REM-301.',
        time: 'Just now',
        unread: true
      });
      renderNotifications();
    },
    () => {
      showToast('Supplier generated Shipment SHP-2026-0005', 'info');
      simulateSupplierDispatch(5000);
    }
  ];

  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  randomAction();
}

function setupEventListeners() {
  window.openPoDetail = openPoDetail;
  window.sendPoToSupplier = sendPoToSupplier;
  window.acceptQuotationAndConfirm = acceptQuotationAndConfirm;
  window.simulateReceivingGoods = simulateReceivingGoods;
  window.openTransitionModal = openTransitionModal;
  window.switchDetailTab = switchDetailTab;
  window.simulateSupplierQuotation = simulateSupplierQuotation;
  window.simulateSupplierDispatch = simulateSupplierDispatch;
  window.simulateSupplierAcceptance = simulateSupplierAcceptance;
}
