document.getElementById('open-camera-btn').addEventListener('click', function() {
  startQRReader();
});

document.getElementById('edit-btn').addEventListener('click', function() {
  enableEditing();
});

document.getElementById('save-btn').addEventListener('click', function() {
  saveInvoice();
});

let html5QrCode = new Html5Qrcode("reader");

function startQRReader() {
  html5QrCode.start(
      { facingMode: "user" }, // camera facing front
      {
          fps: 10,    // frames per second
          qrbox: 250  // size of the QR box
      },
      (decodedText, decodedResult) => {
          // Decode Base64 and show the result
          let decodedData = decodeBase64(decodedText);
          displayInvoiceData(decodedData);
          html5QrCode.stop();
      },
      (errorMessage) => {
          console.log(errorMessage);
      }
  ).catch(err => {
      console.error("Error opening camera: ", err);
  });
}

function decodeBase64(encodedText) {
  let decoded = atob(encodedText);
  try {
      return JSON.parse(decoded);  // Assuming data is in JSON format
  } catch (e) {
      console.error("Error decoding data: ", e);
      return null;
  }
}

function displayInvoiceData(data) {
  if (!data) {
      console.error("No valid data found");
      return;
  }

  document.getElementById('serial-number').textContent = data.serial || 'غير متوفر';
  document.getElementById('business-name').textContent = data.businessName || 'غير متوفر';
  document.getElementById('tax-number').textContent = data.taxNumber || 'غير متوفر';
  document.getElementById('date').textContent = data.date || 'غير متوفر';
  document.getElementById('before-tax').textContent = data.beforeTax || 'غير متوفر';
  document.getElementById('tax').textContent = data.tax || 'غير متوفر';
  document.getElementById('total').textContent = data.total || 'غير متوفر';
  document.getElementById('invoice-number').textContent = data.invoiceNumber || 'غير متوفر';
}

function enableEditing() {
  // Enable editing functionality for the invoice details
  alert("تم تفعيل التحرير!");
}

function saveInvoice() {
  // Simulate saving to PDF or Excel
  let format = prompt("اختر التنسيق للحفظ (PDF/Excel):");
  if (format.toLowerCase() === 'pdf') {
      alert("تم حفظ الفاتورة كـ PDF");
  } else if (format.toLowerCase() === 'excel') {
      alert("تم حفظ الفاتورة كـ Excel");
  } else {
      alert("اختيار غير صحيح");
  }
}