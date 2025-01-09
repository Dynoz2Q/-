import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

let invoices = [];
let sequence = 1;

// فك التشفير مع معالجة الأخطاء
function decodeInvoice(encodedData) {
  try {
    const decodedData = atob(encodedData); // Base64 decoding
    const fields = decodedData.split("|");

    if (fields.length < 6) {
      throw new Error("تنسيق الكود غير صحيح.");
    }

    return {
      tradeName: fields[0] || "غير معروف",
      taxNumber: fields[1] || "غير معروف",
      date: fields[2] || "غير معروف",
      amountBeforeTax: parseFloat(fields[3] || "0").toFixed(2),
      tax: parseFloat(fields[4] || "0").toFixed(2),
      totalAmount: parseFloat(fields[5] || "0").toFixed(2),
    };
  } catch (error) {
    console.error("خطأ أثناء فك التشفير:", error.message);
    alert("فشل في فك التشفير. تأكد من تنسيق الكود.");
    throw error;
  }
}

function addInvoice(data) {
  const table = document.querySelector("#invoiceTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${sequence++}</td>
    <td contenteditable="true">${data.tradeName}</td>
    <td contenteditable="true">${data.taxNumber}</td>
    <td contenteditable="true">${data.date}</td>
    <td contenteditable="true">${data.amountBeforeTax}</td>
    <td contenteditable="true">${data.tax}</td>
    <td contenteditable="true">${data.totalAmount}</td>
    <td contenteditable="true">${data.invoiceNumber || ""}</td>
  `;
  table.appendChild(row);
  invoices.push(data);
}

// زر التصوير
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

// زر الإضافة
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

// زر الحفظ
document.getElementById("saveButton").addEventListener("click", () => {
  alert("زر الحفظ يعمل الآن!");
});

// زر التحرير
document.getElementById("editButton").addEventListener("click", () => {
  alert("يمكنك تحرير الخلايا مباشرةً.");
});