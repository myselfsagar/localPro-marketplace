document.addEventListener("DOMContentLoaded", () => {
  // --- Hamburger Menu Logic ---
  const navbarToggle = document.querySelector("#navbarToggle");
  const navbarLinks = document.querySelector("#navbarLinks");
  if (navbarToggle) {
    navbarToggle.addEventListener("click", () => {
      navbarLinks.classList.toggle("active");
    });
  }

  // --- Socket.IO Notification Logic ---
  if (window.isAuthenticated) {
    // Only run this code if the user is logged in
    const socket = io();
    let notificationCount = 0;

    // --- Notification Dropdown Elements ---
    const notificationBadge = document.querySelector("#notificationBadge");
    const notificationToggle = document.querySelector("#notificationToggle");
    const notificationDropdown = document.querySelector(
      "#notificationDropdown"
    );
    const notificationList = document.querySelector("#notificationList");
    const noNotificationsMsg = document.querySelector(".no-notifications");

    socket.on("connect", () => {
      console.log("Authenticated user connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Listen for the 'new_booking' event from the server
    socket.on("new_booking", (data) => {
      console.log("New booking notification received:", data);

      // 1. Show Toast Notification
      Toastify({
        text: `🔔 New Booking! For ${data.serviceName} from ${data.customerName}`,
        duration: 5000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {},
      }).showToast();

      // 2. Update Badge Count
      if (notificationBadge) {
        notificationCount++;
        notificationBadge.textContent = notificationCount;
        notificationBadge.style.display = "inline-block";
      }

      // 3. Add to Notification Dropdown
      if (notificationList) {
        if (noNotificationsMsg) {
          noNotificationsMsg.style.display = "none";
        }
        const newNotificationHTML = `
                    <div class="notification-list-item">
                        <a href="/dashboard">
                            <strong>${data.serviceName}</strong><br>
                            New request from ${data.customerName}.
                        </a>
                    </div>
                `;
        notificationList.insertAdjacentHTML("afterbegin", newNotificationHTML);
      }

      // 4. Dynamic Dashboard Update
      if (window.location.pathname === "/dashboard") {
        const bookingList = document.querySelector(".booking-list");
        const noBookingsMsgDashboard = document.querySelector("#noBookingsMsg");

        if (bookingList) {
          if (
            noBookingsMsgDashboard &&
            noBookingsMsgDashboard.style.display !== "none"
          ) {
            noBookingsMsgDashboard.style.display = "none";
          }

          const formattedDate = new Date(data.bookingDate).toLocaleString();
          const newBookingCardHTML = `
                        <div class="booking-card">
                            <h4>${data.serviceName}</h4>
                            <p>with <strong>${data.customerName}</strong></p>
                            <p>Price: <strong>$${data.price}</strong></p>
                            <p>Date: ${formattedDate}</p>
                            <p>Status: <span class="status-${data.status}">${data.status}</span></p>
                            <div class="booking-actions">
                                <form action="/provider/bookings/${data.bookingId}/status" method="POST" style="display: inline;">
                                    <input type="hidden" name="status" value="confirmed">
                                    <button type="submit" class="btn-confirm">Confirm</button>
                                </form>
                                <form action="/provider/bookings/${data.bookingId}/status" method="POST" style="display: inline;">
                                    <input type="hidden" name="status" value="cancelled">
                                    <button type="submit" class="btn-cancel">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
          bookingList.insertAdjacentHTML("afterbegin", newBookingCardHTML);
        }
      }
    });

    // --- Click handler for the notification bell ---
    if (notificationToggle && notificationDropdown) {
      notificationToggle.addEventListener("click", (event) => {
        event.preventDefault();
        notificationDropdown.classList.toggle("show");
        notificationCount = 0;
        if (notificationBadge) {
          notificationBadge.textContent = "0";
          notificationBadge.style.display = "none";
        }
      });
    }
  } // --- End of if(window.isAuthenticated) block ---

  // --- Collapsible Section Logic ---
  const bookingsToggle = document.querySelector("#bookingsToggle");
  const bookingsContent = document.querySelector("#bookingsContent");

  if (bookingsToggle && bookingsContent) {
    bookingsToggle.addEventListener("click", () => {
      bookingsToggle.classList.toggle("active");
      bookingsContent.classList.toggle("active");
    });
  }
});
