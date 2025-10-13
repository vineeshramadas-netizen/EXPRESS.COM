document.addEventListener('DOMContentLoaded', () => {
  const checkIn = document.querySelector('input[name="checkIn"]');
  const checkOut = document.querySelector('input[name="checkOut"]');
  const guests = document.querySelector('input[name="guests"]');

  const today = new Date().toISOString().split('T')[0];
  if (checkIn) checkIn.min = today;
  if (checkOut) checkOut.min = today;

  if (checkIn && checkOut) {
    checkIn.addEventListener('change', () => {
      checkOut.min = checkIn.value || today;
      if (checkOut.value && checkOut.value <= checkIn.value) {
        const dt = new Date(checkIn.value);
        dt.setDate(dt.getDate() + 1);
        checkOut.value = dt.toISOString().split('T')[0];
      }
    });
  }

  if (guests) {
    guests.addEventListener('input', () => {
      const n = Number(guests.value);
      if (!Number.isFinite(n) || n < 1) guests.value = '1';
    });
  }
});
