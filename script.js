let sequence = 1;

// إعداد الكاميرا لقراءة QR Code
document.getElementById("scanBarcode").addEventListener("click", async () => {
    const video = document.getElementById("camera");
    const scannerContainer = document.getElementById("scannerContainer");

    scannerContainer.style.display = "block";

    const codeReader = new ZXing.BrowserQRCodeReader();
    try {
        const devices = await codeReader.listVideoInputDevices();
        if (devices.length > 0) {
            const firstDeviceId = devices[0].deviceId;

            codeReader.decodeFromVideoDevice(firstDeviceId, video, (result, error) => {
                if (result) {
                    const decodedData = decodeInvoice(result.getText());
                    addInvoiceToTable(decodedData);
                    codeReader.reset();
                    scannerContainer.style.display = "none";
                } else if (error) {
                    console.error("Error reading QR Code:", error);
                }
            });
        } else {
            alert("لم يتم العثور على كاميرا.");
        }
    } catch (err) {
        console.error("خطأ أثناء تشغيل الكاميرا:", err);
        alert("حدث خطأ أثناء محاولة فتح الكاميرا.");
    }
});

// رفع صورة وفك QR Code منها
document.getElementById("addBarcode").addEventListener("click", () => {
    document.getElementById("imageInput").click();
});

document.getElementById("imageInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const codeReader = new ZXing.BrowserQRCodeReader();
        try {
            const result = await codeReader.decodeFromImage(file);
            const decodedData = decodeInvoice(result.getText());
            addInvoiceToTable(decodedData);
        } catch (err) {
            console.error("Error decoding QR Code from image:", err);
            alert("تعذر قراءة الكود من الصورة.");
        }
    }
});

// فك تشفير البيانات من QR Code
function decodeInvoice(data) {
    try {
        const decodedString = atob(data);
        const parsedData = JSON.parse(decodedString);
        return {
            tradeName: parsedData[0] || "غير متوفر",
            taxNumber: parsedData[1] || "غير متوفر",
            date: parsedData[2] || "غير متوفر",
            amountBeforeTax: parsedData[3] || "غير متوفر",
            tax: parsedData[4] || "غير متوفر",
            totalAmount: parsedData[5] || "غير متوفر",
            invoiceNumber: parsedData[6] || "غير متوفر",
        };
    } catch (error) {
        console.error("خطأ في فك التشفير:", error);
        alert("تعذر فك التشفير: تأكد من صحة الكود.");
        return {};
    }
}

// إضافة البيانات إلى الجدول
function addInvoiceToTable(data) {
    const table = document.getElementById("invoiceTable").querySelector("tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${sequence++}</td>
        <td>${data.date}</td>
        <td>${data.amountBeforeTax}</td>
        <td>${data.tax}</td>
        <td>${data.totalAmount}</td>
        <td>${data.invoiceNumber}</td>
        <td>${data.tradeName}</td>
        <td>${data.taxNumber}</td>
        <td><button onclick="editRow(this)">تحرير</button></td>
    `;

    table.appendChild(row);
}

// تحرير البيانات داخل الصف
function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell) => {
        const input = document.createElement("input");
        input.value = cell.innerText;
        cell.innerHTML = "";
        cell.appendChild(input);
    });

    button.innerText = "حفظ";
    button.onclick = () => saveRow(button);
}

// حفظ التعديلات داخل الصف
function saveRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell) => {
        const input = cell.querySelector("input");
        if (input) cell.innerText = input.value;
    });

    button.innerText = "تحرير";
    button.onclick = () => editRow(button);
}