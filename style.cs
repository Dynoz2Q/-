/* التصميم الأساسي */
body {
    font-family: 'Rubik', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #000000;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* الصفحة الواحدة */
.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

/* الأزرار */
button {
    font-size: 18px;
    padding: 12px 24px;
    margin: 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
    background-color: #4CAF50;
    color: white;
}

button:hover {
    transform: scale(1.1);
    background-color: #45a049;
}

button:active {
    transform: scale(0.95);
}

/* الجدول */
#invoice-table {
    width: 80%;
    margin-top: 20px;
    border-collapse: collapse;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

#invoice-table th, #invoice-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
}

/* التبديل بين الوضع الداكن والساطع */
body.dark-mode {
    background-color: #333333;
    color: #ffffff;
}

#theme-toggle {
    margin-top: 20px;
}
