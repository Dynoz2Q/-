import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

let invoices = [];
let sequence = 1;

function addInvoice(data) {
  const table = document.querySelector("#invoiceTable tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${sequence++}</td>
    <td contenteditable="false">${data.tradeName}</td>
    <td contenteditable="false">${data.taxNumber}</td>
    <td contenteditable="false">${data.date}</td>
    <td contenteditable="false">${data.amountBeforeTax}</td>
    <td contenteditable="false">${data.tax}</td>
    <td contenteditable="false">${data.totalAmount}</td>
    <td contenteditable="false">${data.invoiceNumber}</td>
    <td><button class="editButton">🖊️ تحرير</button></td>
  `;
  table.appendChild(row);
  invoices.push(data);
}

document.getElementById("addBarcode").addEventListener("click", () => {
  document.getElementById("imageInput").click();
});

document.getElementById("imageInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const qrScanner = new QrScanner(file, (result) => {
      const data = decodeInvoice(result.data);
      addInvoice(data);
    }, {
      returnDetailedScanResult: true,
    });
    qrScanner.scan();
  }
});

document.getElementById("scanBarcode").addEventListener("click", async () => {
  const scannerContainer = document.getElementById("scannerContainer");
  const video = document.getElementById("camera");
  scannerContainer.style.display = "block";

  const qrScanner = new QrScanner(video, (result) => {
    const data = decodeInvoice(result.data);
    addInvoice(data);
    qrScanner.stop();
    scannerContainer.style.display = "none";
  });

  qrScanner.start();
});

document.getElementById("saveButton").addEventListener("click", () => {
  const choice = confirm("هل تريد حفظ الملف كـ Excel؟ اضغط إلغاء لحفظه كـ PDF.");
  if (choice) {
    saveAsExcel();
  } else {
    saveAsPDF();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("editButton")) {
    const row = event.target.closest("tr");
    row.querySelectorAll("td[contenteditable]").forEach((cell) => {
      cell.contentEditable = cell.isContentEditable ? "false" : "true";
    });
    event.target.textContent = row.querySelector("td[contenteditable]").isContentEditable ? "✔️ حفظ" : "🖊️ تحرير";
  }
});

function saveAsExcel() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "تسلسل,الاسم التجاري,الرقم الضريبي,التاريخ,قبل الضريبة,الضريبة,الإجمالي,رقم الفاتورة\n";
  invoices.forEach((invoice) => {
    csvContent += `${sequence - 1},${invoice.tradeName},${invoice.taxNumber},${invoice.date},${invoice.amountBeforeTax},${invoice.tax},${invoice.totalAmount},${invoice.invoiceNumber}\n`;
  });

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "invoices.csv";
  link.click();
}

function saveAsPDF() {
  const pdfContent = invoices.map((invoice) => {
    return `
      الاسم التجاري: ${invoice.tradeName}
      الرقم الضريبي: ${invoice.taxNumber}
      التاريخ: ${invoice.date}
      الإجمالي: ${invoice.totalAmount}
    `;
  }).join("\n\n");

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "invoices.pdf";
  link.click();
}

function decodeInvoice(data) {
  const decodedData = atob(data); // فك تشفير Base64
  return JSON.parse(decodedData);
}