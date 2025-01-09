import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

// قائمة الفواتير
let invoices = [];
let sequence = 1;

// إضافة بيانات الفاتورة
function addInvoice(data) {
  const table = document.querySelector("#invoiceTable tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${sequence++}</td>
    <td>${data.tradeName}</td>
    <td>${data.taxNumber}</td>
    <td>${data.date}</td>
    <td>${data.amountBeforeTax}</td>
    <td>${data.tax}</td>
    <td>${data.totalAmount}</td>
    <td>${data.invoiceNumber}</td>
    <td><button class="edit">تحرير</button></td>
  `;

  table.appendChild(row);
  invoices.push(data);

  // ربط زر التحرير بالحدث
  const editButton = row.querySelector(".edit");
  editButton.addEventListener("click", () => editInvoice(editButton));
}

// زر "إضافة باركود" لرفع صورة
document.getElementById("addBarcode").addEventListener("click", () => {
  document.getElementById("imageInput").click();
});

// قراءة الباركود من صورة
document.getElementById("imageInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function() {
      // قراءة محتوى Base64 من الصورة
      const base64Image = reader.result.split(',')[1]; // تجاهل البداية "data:image/png;base64,"
      const qrScanner = new QrScanner(base64Image, (result) => {
        // افتراضياً تم استخراج بيانات
        const sampleData = {
          tradeName: "مؤسسة المثال",
          taxNumber: "1234567890",
          date: "2025-01-08",
          amountBeforeTax: "100",
          tax: "15",
          totalAmount: "115",
          invoiceNumber: result.data || "INV-001"
        };
        addInvoice(sampleData);
      }, { returnDetailedScanResult: true }); // إضافة الخيار لتجنب التحذير
      qrScanner.scan();
    }
    reader.readAsDataURL(file); // قراءة الملف بصيغة Base64
  }
});

// زر "تصوير باركود"
document.getElementById("scanBarcode").addEventListener("click", async () => {
  const video = document.createElement("video");
  const qrScanner = new QrScanner(video, (result) => {
    const sampleData = {
      tradeName: "مؤسسة المثال",
      taxNumber: "1234567890",
      date: "2025-01-08",
      amountBeforeTax: "100",
      tax: "15",
      totalAmount: "115",
      invoiceNumber: result.data || "INV-001"
    };
    addInvoice(sampleData);
    qrScanner.stop();
  }, { returnDetailedScanResult: true }); // إضافة الخيار لتجنب التحذير
  qrScanner.start();
});

// تحميل Excel
document.getElementById("downloadExcel").addEventListener("click", () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "تسلسل الفاتورة,الاسم التجاري,الرقم الضريبي,التاريخ,الفاتورة قبل الضريبة,الضريبة,الإجمالي بعد الضريبة,رقم الفاتورة\n";
  invoices.forEach((invoice) => {
    csvContent += `${sequence - 1},${invoice.tradeName},${invoice.taxNumber},${invoice.date},${invoice.amountBeforeTax},${invoice.tax},${invoice.totalAmount},${invoice.invoiceNumber}\n`;
  });

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "invoices.csv";
  link.click();
});

// تحميل PDF
document.getElementById("downloadPDF").addEventListener("click", () => {
  const pdfContent = invoices.map((invoice) => {
    return `
      الفاتورة رقم: ${sequence - 1}
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
});

// تحرير البيانات
function editInvoice(button) {
  const row = button.parentElement.parentElement;
  const cells = row.querySelectorAll("td");

  for (let i = 1; i < cells.length - 1; i++) {
    const oldValue = cells[i].textContent;
    const input = document.createElement("input");
    input.value = oldValue;
    cells[i].innerHTML = "";
    cells[i].appendChild(input);
  }

  button.textContent = "حفظ";
  button.onclick = () => saveInvoice(button);
}

// حفظ البيانات بعد التعديل
function saveInvoice(button) {
  const row = button.parentElement.parentElement;
  const cells = row.querySelectorAll("td");

  for (let i = 1; i < cells.length - 1; i++) {
    const input = cells[i].querySelector("input");
    cells[i].textContent = input.value;
  }

  button.textContent = "تحرير";
  button.onclick = () => editInvoice(button);
}