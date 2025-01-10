import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

let invoices = [];

document.getElementById("scanBarcode").addEventListener("click", () => {
  const scannerContainer = document.getElementById("scannerContainer");
  const video = document.getElementById("camera");

  scannerContainer.style.display = "flex";  // اظهار الكاميرا والمربع
  const qrScanner = new QrScanner(video, (result) => {
    const data = decodeInvoice(result.data);
    addInvoice(data);
    qrScanner.stop();
    scannerContainer.style.display = "none";  // إخفاء الكاميرا بعد القراءة
  });

  qrScanner.start();
});

document.getElementById("addBarcode").addEventListener("click", () => {
  document.getElementById("imageInput").click();
});

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

function addInvoice(data) {
  const table = document.querySelector("#invoiceTable tbody");
  const row = document.createElement("tr");

  // إضافة البيانات إلى الجدول بناءً على ما إذا كانت موجودة
  row.innerHTML = `
    <td>${data.sellerName}</td>
    <td>${data.taxNumber}</td>
    <td>${data.invoiceDate}</td>
    <td>${data.totalAmount}</td>
    <td>${data.taxAmount}</td>
  `;
  table.appendChild(row);
  invoices.push(data);
}

function decodeInvoice(data) {
  try {
    const decodedData = atob(data); // فك تشفير البيانات من Base64
    const parsedData = JSON.parse(decodedData); // تحويل النص إلى كائن JSON

    // الحصول على البيانات المطلوبة من الكود المشفر
    const invoiceData = {
      sellerName: parsedData.sellerName || "غير متوفر",
      taxNumber: parsedData.taxNumber || "غير متوفر",
      invoiceDate: parsedData.invoiceDate || "غير متوفر",
      totalAmount: parsedData.totalAmount || "غير متوفر",
      taxAmount: parsedData.taxAmount || "غير متوفر",
    };

    return invoiceData;
  } catch (error) {
    console.error("فشل في فك التشفير:", error);
    return {};
  }
}