const STORAGE_KEY = "foodBankDonations";

const sampleDonations = [
  {
    id: 1,
    donorName: "Green Valley Grocery",
    category: "Canned Food",
    itemName: "Tomato Soup",
    quantity: 28,
    unit: "cans",
    donationDate: "2026-10-01",
    value: 95,
    status: "Received",
    notes: "Vegetarian approved"
  },
  {
    id: 2,
    donorName: "Sunrise Community Center",
    category: "Fresh Produce",
    itemName: "Apples",
    quantity: 40,
    unit: "kg",
    donationDate: "2026-10-03",
    value: 130,
    status: "Packed",
    notes: "Packed for family support bags"
  },
  {
    id: 3,
    donorName: "Oak Street School",
    category: "Grains",
    itemName: "Rice Bags",
    quantity: 18,
    unit: "bags",
    donationDate: "2026-10-04",
    value: 210,
    status: "Distributed",
    notes: "Distributed this week"
  }
];

const form = document.getElementById("donation-form");
const tableBody = document.getElementById("donation-table-body");

function getDonations() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDonations));
    return sampleDonations;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : sampleDonations;
  } catch (error) {
    return sampleDonations;
  }
}

function saveDonations(donations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function renderDashboard() {
  const donations = getDonations();

  const totalItems = donations.reduce((sum, donation) => sum + Number(donation.quantity || 0), 0);
  const totalValue = donations.reduce((sum, donation) => sum + Number(donation.value || 0), 0);
  const familiesServed = Math.max(1, Math.round(totalItems / 8));
  const inventoryTypes = new Set(donations.map((donation) => donation.category)).size;

  document.getElementById("total-items").textContent = `${totalItems} items`;
  document.getElementById("total-value").textContent = formatCurrency(totalValue);
  document.getElementById("total-families").textContent = String(familiesServed);
  document.getElementById("inventory-types").textContent = String(inventoryTypes);
}

function renderTable() {
  const donations = getDonations();

  if (!donations.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">No donations recorded yet.</td>
      </tr>
    `;
    return;
  }

  const sorted = [...donations].sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));

  tableBody.innerHTML = sorted
    .slice(0, 8)
    .map(
      (entry) => `
        <tr>
          <td>${entry.donorName}</td>
          <td>${entry.itemName}</td>
          <td>${entry.quantity} ${entry.unit}</td>
          <td><span class="status-pill ${entry.status.toLowerCase()}">${entry.status}</span></td>
          <td>${formatCurrency(Number(entry.value || 0))}</td>
        </tr>
      `
    )
    .join("");
}

function handleSubmit(event) {
  event.preventDefault();

  const donation = {
    id: Date.now(),
    donorName: document.getElementById("donorName").value.trim(),
    category: document.getElementById("category").value,
    itemName: document.getElementById("itemName").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    unit: document.getElementById("unit").value.trim(),
    donationDate: document.getElementById("donationDate").value,
    value: Number(document.getElementById("value").value),
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value.trim()
  };

  const donations = getDonations();
  donations.push(donation);
  saveDonations(donations);

  form.reset();
  document.getElementById("quantity").value = 1;
  document.getElementById("value").value = 0;
  document.getElementById("donationDate").valueAsDate = new Date();

  renderDashboard();
  renderTable();
}

form.addEventListener("submit", handleSubmit);

document.getElementById("donationDate").valueAsDate = new Date();
renderDashboard();
renderTable();





















































