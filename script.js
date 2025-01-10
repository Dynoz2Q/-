// دالة فك التشفير باستخدام Base64
function decodeQRCode(base64String) {
  try {
      // فك التشفير من Base64
      const decoded = atob(base64String);
      const result = {};
      let index = 0;

      while (index < decoded.length) {
          const tag = decoded.charCodeAt(index);
          const length = decoded.charCodeAt(index + 1);
          const value = decoded.substr(index + 2, length);
          index += 2 + length;

          switch (tag) {
              case 1:
                  result["الاسم التجاري"] = value;
                  break;
              case 2:
                  result["الرقم الضريبي"] = value;
                  break;
              case 3:
                  result["تاريخ الفاتورة"] = value;
                  break;
              case 4:
                  result["الإجمالي"] = value;
                  break;
              case 5:
                  result["الضريبة"] = value;
                  break;
              default:
                  console.warn("Tag غير معروف:", tag);
          }
      }

      return result;
  } catch (error) {
      console.error("خطأ في فك التشفير:", error);
      return null;
  }
}

// دالة لعرض البيانات في الجدول
function displayInvoiceData(data) {
  const tbody = document.querySelector("#invoiceData tbody");
  tbody.innerHTML = ""; // مسح البيانات القديمة
  const row = document.createElement("tr");

  Object.values(data).forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value || "غير متوفر";
      row.appendChild(cell);
  });

  tbody.appendChild(row);
}

// التقاط QR-Code من الكاميرا
document.getElementById('captureQR').addEventListener('click', () => {
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
      { facingMode: "environment" }, 
      { fps: 10, qrbox: 250 },
      qrCodeMessage => {
          // فك التشفير وعرض البيانات
          const decodedData = decodeQRCode(qrCodeMessage);
          if (decodedData) {
              displayInvoiceData(decodedData);
          }
          html5QrCode.stop(); // إيقاف الكاميرا بعد القراءة
      },
      errorMessage => {
          console.log(errorMessage);
      }
  );
});

// تحميل صورة وتحليل QR-Code منها
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
              const qr = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
              qr.decodeFromImage(img)
                  .then(decodedMessage => {
                      const decodedData = decodeQRCode(decodedMessage);
                      if (decodedData) {
                          displayInvoiceData(decodedData);
                      }
                  })
                  .catch(error => {
                      console.error("خطأ في تحليل الصورة:", error);
                  });
          };
          img.src = e.target.result;
      };
      reader.readAsDataURL(file);
  }
});

// زر حفظ
document.getElementById('saveButton').addEventListener('click', () => {
  alert("تم حفظ البيانات.");
});