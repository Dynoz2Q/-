import QrScanner from "https://unpkg.com/qr-scanner/qr-scanner.min.js";

let invoices = [];
let sequence = 1;

function addInvoice(data) {
    const table = document.querySelector("#invoiceTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${sequence++}</td>
        <td>${data.date}</td>
        <td>${data.amountBeforeTax}</td>
        <td>${data.tax}</td>
        <td>${data.totalAmount}</td>
        <td>${data.invoiceNumber}</td>
        <td>${data.commercialName ? data.commercialName : "غير متوفر"}</td>
        <td>${data.taxNumber ? data.taxNumber : "غير متوفر"}</td>
        <td><button class="editRowButton">🖊️</button></td>
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
            processQRCode(result.data);
        });
        qrScanner.scan();
    }
});

document.getElementById("scanBarcode").addEventListener("click", async () => {
    const scannerContainer = document.getElementById("scannerContainer");
    const video = document.getElementById("camera");
    scannerContainer.style.display = "block";

    const qrScanner = new QrScanner(video, (result) => {
        processQRCode(result.data);
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

function saveAsExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "تسلسل,التاريخ,قبل الضريبة,الضريبة,الإجمالي,رقم الفاتورة,الاسم التجاري,الرقم الضريبي\n";
    invoices.forEach((invoice) => {
        csvContent += `${sequence - 1},${invoice.date},${invoice.amountBeforeTax},${invoice.tax},${invoice.totalAmount},${invoice.invoiceNumber},${invoice.commercialName || "غير متوفر"},${invoice.taxNumber || "غير متوفر"}\n`;
    });

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "invoices.csv";
    link.click();
}

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

function processQRCode(data) {
    try {
        // إذا كانت مشفرة بـ Base64
        const decodedData = atob(data);
        const parsedData = JSON.parse(decodedData);

        // إضافة الفاتورة إلى الجدول
        const invoice = {
            date: parsedData[1],
            amountBeforeTax: parsedData[4],
            tax: parsedData[5],
            totalAmount: parsedData[6],
            invoiceNumber: parsedData[2],
            commercialName: parsedData[0],
            taxNumber: parsedData[3]
        };

        addInvoice(invoice);
    } catch (error) {
        console.error("فشل في فك التشفير: ", error);
        alert("خطأ في قراءة الكود، يرجى التحقق من الكود المدخل.");
    }
}