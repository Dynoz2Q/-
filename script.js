import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

let invoices = [];
let sequence = 1;

// دالة لإضافة الفاتورة
function addInvoice(data) {
  const table = document.querySelector("#invoiceTable tbody");
  const row = document.createElement("tr");

  // إضافة البيانات إلى الجدول بناءً على ما إذا كانت موجودة
  row.innerHTML = `
    <td>${sequence++}</td>
    <td>${data.date}</td>
    <td>${data.amountBeforeTax}</td>
    <td>${data.tax}</td>
    <td>${data.totalAmount}</td>
    <td>${data.invoiceNumber}</td>
    <td>${data.commercialName ? data.commercialName : ""}</td>
    <td>${data.taxNumber ? data.taxNumber : ""}</td>
    <td><button class="editRowButton">🖊</button></td>
  `;
  table.appendChild(row);
  invoices.push(data);
}

// أحداث الزر "إضافة باركود"
document.getElementById("addBarcode").addEventListener("click", () => {
  document.getElementById("imageInput").click();
});

// حدث تغيير الصورة لاستخراج الباركود
document.getElementById("imageInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const qrScanner = new QrScanner(file, (result) => {
      const data = decodeInvoice(result.data);
      addInvoice(data);
    });
    qrScanner.scan();
  }
});

// حدث للزر "مسح الباركود"
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

// حدث للزر "حفظ"
document.getElementById("saveButton").addEventListener("click", () => {
  const choice = confirm("هل تريد حفظ الملف كـ Excel؟ اضغط إلغاء لحفظه كـ PDF.");
  if (choice) {
    saveAsExcel();
  } else {
    saveAsPDF();
  }
});

// دالة لحفظ الفواتير كـ Excel
function saveAsExcel() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "تسلسل,التاريخ,قبل الضريبة,الضريبة,الإجمالي,رقم الفاتورة,الاسم التجاري,الرقم الضريبي\n";
  invoices.forEach((invoice) => {
    csvContent += $
    {sequence - 1}$
    {invoice.date}$
    {invoice.amountBeforeTax}$
    {invoice.tax}$
    {invoice.totalAmount}$
    {invoice.invoiceNumber}$
    {invoice.commercialName ? invoice.commercialName : ""}$
    {invoice.taxNumber ? invoice.taxNumber : ""}n;
  });

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "invoices.csv";
  link.click();
}

// دالة لحفظ الفواتير كـ PDF
function saveAsPDF() {
  const pdfContent = invoices.map((invoice) => {
    return `
      التاريخ: ${invoice.date}
      قبل الضريبة: ${invoice.amountBeforeTax}
      الضريبة: ${invoice.tax}
      الإجمالي: ${invoice.totalAmount}
      رقم الفاتورة: ${invoice.invoiceNumber}
      الاسم التجاري: ${invoice.commercialName || "غير متوفر"}
      الرقم الضريبي: ${invoice.taxNumber || "غير متوفر"}
    `;
  }).join("\n\n");

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "invoices.pdf";
  link.click();
}

// دالة فك تشفير البيانات من QR Code
function decodeInvoice(data) {
  try {
    const decodedData = atob(data); // فك تشفير البيانات من Base64
    const parsedData = JSON.parse(decodedData); // تحويل النص إلى كائن JSON

    // التحقق من وجود البيانات الخاصة بالاسم التجاري والرقم الضريبي
    const invoiceData = {
      date: parsedData.date || "غير متوفر",
      amountBeforeTax: parsedData.amountBeforeTax || "غير متوفر",
      tax: parsedData.tax || "غير متوفر",
      totalAmount: parsedData.totalAmount || "غير متوفر",
      invoiceNumber: parsedData.invoiceNumber || "غير متوفر",
    };

    // إذا كانت البيانات الخاصة بالاسم التجاري أو الرقم الضريبي موجودة في الكود، أضفها
    if (parsedData.commercialName) {
      invoiceData.commercialName = parsedData.commercialName;
    }
    
    if (parsedData.taxNumber) {
      invoiceData.taxNumber = parsedData.taxNumber;
    }

    return invoiceData;
  } catch (error) {
    console.error("فشل في فك التشفير:", error);
    return {};
  }
}