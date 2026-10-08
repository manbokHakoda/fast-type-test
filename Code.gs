// ==========================================================
// FAST TYPE — GOOGLE SHEETS
// ==========================================================

// Google Sheets-д хадгалах үндсэн функц
function doPost(e) {

    try {

        // Одоогийн Spreadsheet
        const sheet =
            SpreadsheetApp
                .getActiveSpreadsheet()
                .getSheetByName("Sheet1");


        // Хэрэв Sheet1 байхгүй бол
        if (!sheet) {

            return ContentService
                .createTextOutput(
                    JSON.stringify({
                        success: false,
                        message: "Sheet1 олдсонгүй."
                    })
                )
                .setMimeType(
                    ContentService.MimeType.JSON
                );
        }


        // HTML-ээс ирсэн мэдээлэл
        const name =
            e.parameter.name || "";

        const className =
            e.parameter.className || "";

        const time =
            e.parameter.time || "";

        const totalChars =
            e.parameter.totalChars || 0;

        const correctChars =
            e.parameter.correctChars || 0;

        const errors =
            e.parameter.errors || 0;

        const accuracy =
            e.parameter.accuracy || 0;

        const cpm =
            e.parameter.cpm || 0;

        const wpm =
            e.parameter.wpm || 0;


        // Огноо, цаг
        const date =
            new Date();


        // Google Sheets-д шинэ мөр нэмэх
        sheet.appendRow([
            date,
            name,
            className,
            time,
            totalChars,
            correctChars,
            errors,
            accuracy + "%",
            cpm,
            wpm
        ]);


        // Амжилттай хариу
        return ContentService
            .createTextOutput(
                JSON.stringify({
                    success: true,
                    message: "Амжилттай хадгалагдлаа."
                })
            )
            .setMimeType(
                ContentService.MimeType.JSON
            );


    } catch (error) {

        return ContentService
            .createTextOutput(
                JSON.stringify({
                    success: false,
                    message: error.toString()
                })
            )
            .setMimeType(
                ContentService.MimeType.JSON
            );
    }
}


// ==========================================================
// GET хүсэлт шалгах
// ==========================================================

function doGet() {

    return ContentService
        .createTextOutput(
            "FAST TYPE Google Sheets API ажиллаж байна."
        );
}