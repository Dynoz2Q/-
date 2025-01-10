// استخدام مكتبة ZXing لقراءة QR-Code
const { BrowserQRCodeReader } = require('@zxing/library');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// إعداد الكاميرا
let scanner = new BrowserQRCodeReader();

document.getElementById('scanBtn').addEventListener('click', function() {
    startCamera();
});

document.getElementById('uploadBtn').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', function(e) {
    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                let result = scanner.decodeFromImage(img);
                displayInvoiceData(result.getText());
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// دالة لفتح الكاميرا
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            setInterval(() => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                scanner.decodeFromCanvas(imageData).then(result => {
                    displayInvoiceData(result.getText());
                }).catch(err => {});
            }, 1000);
        })
        .catch(function(err) {
            console.error("Error accessing camera: " + err);
        });
}

// عرض تفاصيل الفاتورة
function displayInvoiceData(decodedText) {
    const data = JSON.parse(decodedText);
    const table = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    row.insertCell(0).textContent = data.serialNumber;
    row.insertCell(1).textContent = data.businessName;
    row.insertCell(2).textContent = data.taxNumber;
    row.insertCell(3).textContent = data.date;
    row.insertCell(4).textContent = data.beforeTax;
    row.insertCell(5).textContent = data.tax;
    row.insertCell(6).textContent = data.total;
    row.insertCell(7).textContent = data.invoiceNumber;
}

// زر التحرير
document.getElementById('editBtn').addEventListener('click', function() {
    let cells = document.querySelectorAll('#invoiceTable td');
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', true);
    });
});

// زر الحفظ
document.getElementById('saveBtn').addEventListener('click', function() {
    let invoiceData = [];
    let rows = document.querySelectorAll('#invoiceTable tr');
    rows.forEach(row => {
        let rowData = {};
        let cells = row.getElementsByTagName('td');
        if (cells.length) {
            rowData.serialNumber = cells[0].textContent;
            rowData.businessName = cells[1].textContent;
            rowData.taxNumber = cells[2].textContent;
            rowData.date = cells[3].textContent;
            rowData.beforeTax = cells[4].textContent;
            rowData.tax = cells[5].textContent;
            rowData.total = cells[6].textContent;
            rowData.invoiceNumber = cells[7].textContent;
            invoiceData.push(rowData);
        }
    });
    let jsonData = JSON.stringify(invoiceData);
    downloadFile(jsonData, 'invoice.json');
});

// دالة لتحميل البيانات كملف
function downloadFile(data, filename) {
    let blob = new Blob([data], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}