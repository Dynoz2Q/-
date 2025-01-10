// التبديل بين الوضع الداكن والساطع
let darkMode = false;

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
}

// فتح الكاميرا لقراءة QR
function openCamera() {
    alert('فتح الكاميرا لقراءة QR');
    // إضافة الكود لفتح الكاميرا هنا
    // عند قراءة QR، يتم الانتقال للصفحة الثانية ويعرض البيانات
    goToPage2({
        sellerName: 'شركة XYZ',
        taxNumber: '123456789',
        date: '2025-01-01',
        totalAmount: '1000.00',
        taxAmount: '150.00'
    });
}

// رفع صورة QR
function openFileDialog() {
    alert('رفع صورة QR');
    // إضافة الكود لتحميل صورة QR هنا
    // عند قراءة QR، يتم الانتقال للصفحة الثانية ويعرض البيانات
    goToPage2({
        sellerName: 'شركة XYZ',
        taxNumber: '123456789',
        date: '2025-01-01',
        totalAmount: '1000.00',
        taxAmount: '150.00'
    });
}

// إدخال كود مشفر base64
function openBase64Input() {
    let code = prompt('أدخل كود base64');
    alert('تم فك تشفير الكود: ' + code); // فك التشفير وعرض البيانات هنا
    // عند فك التشفير، يتم الانتقال للصفحة الثانية ويعرض البيانات
    goToPage2({
        sellerName: 'شركة XYZ',
        taxNumber: '123456789',
        date: '2025-01-01',
        totalAmount: '1000.00',
        taxAmount: '150.00'
    });
}

// الانتقال إلى الصفحة الثانية وعرض البيانات
function goToPage2(data) {
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    populateInvoiceTable(data);
}

// إضافة بيانات الفاتورة للجدول
function populateInvoiceTable(data) {
    const table = document.getElementById('invoice-data');
    table.innerHTML = `
        <tr>
            <td>${data.sellerName}</td>
            <td>${data.taxNumber}</td>
            <td>${data.date}</td>
            <td>${data.totalAmount}</td>
            <td>${data.taxAmount}</td>
        </tr>
    `;
}

// تحرير الجدول
function editTable() {
    alert('تم تفعيل وضع التحرير');
    // إضافة الكود لتحرير البيانات في الجدول هنا
}
