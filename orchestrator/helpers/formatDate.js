function formatDate(dateString) {
    const date = new Date(dateString);
  
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
  
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNumber = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${day}, ${dateNumber} ${month} ${year}`;
  
    return formattedDate;
  }
  
module.exports = formatDate
