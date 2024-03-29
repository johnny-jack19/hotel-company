//********************************************Today************************************************
//Today varibles-----------------------------------------------------------------------------------
const roomIndex = {
  room1: { index: 0, type: "singleQueen" },
  room2: { index: 1, type: "singleQueen" },
  room3: { index: 2, type: "doubleQueen" },
  room4: { index: 3, type: "doubleQueen" },
  room5: { index: 4, type: "singleKing" },
  room6: { index: 5, type: "singleKing" },
};
const todayOccupied = [];
const todayData = {};
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
let currentRoom = null;
const roomCards = document.getElementsByClassName("room-card");
const overlay = document.getElementById("overlay");
let states =
  "Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming";
let myStates = states.split(",");
for (state of myStates) {
  let stateOption = `<option value="${state}">${state}</option>`;
  document.getElementById("state").innerHTML += stateOption;
}

//Today calls--------------------------------------------------------------------------------------
updateToday();

function updateToday() {
  todayOccupied.length = 0;
  getToday(todayData);
  getOccupied(todayOccupied);
  addToRoomCards();
  overlay.classList.add("hidden");
}

Array.from(roomCards).forEach((room) => {
  room.addEventListener("click", expandCard);
});

function addToRoomCards() {
  if (todayOccupied.length == 6 && todayData.room1) {
    Array.from(roomCards).forEach((room) => {
      let isBooked;
      let isOccupied;
      if (todayOccupied[roomIndex[room.id].index] != 0) {
        isOccupied = "Occupied";
      } else {
        isOccupied = "Vacant";
      }
      if (todayData[room.id] != 0) {
        isBooked = "Booked";
      } else {
        isBooked = "Open";
      }
      room.innerHTML = `<h3>Room ${
        roomIndex[room.id].index + 1
      }</h3><p>${isOccupied}</p><p>${isBooked}</p>`;
    });
  } else {
    setTimeout(() => {
      addToRoomCards(), 1000;
    });
  }
}
//Modal > Room-------------------------------------------------------------------------------------
function expandCard() {
  overlay.classList.remove("hidden");
  currentRoom = this.id;
  const occupiedGuest = {};
  const bookedGuest = {};
  return new Promise((resolve, reject) => {
    return resolve(
      getCustomerInfo(occupiedGuest, todayOccupied[roomIndex[this.id].index])
    );
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        return resolve(getCustomerInfo(bookedGuest, todayData[currentRoom]));
      });
    })
    .then(() => {
      modal.innerHTML = `
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <p class="loading">LOADING...</p>
        `;
    })
    .then(() => {
      setTimeout(
        () =>
          (modal.innerHTML = `
        <button class="close" onclick="closeModal()">X</button>
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <div class="row"><div>Guest:</div><div id="guest-name">${
          occupiedGuest.name
        }</div><div id="guest-booking">${
            todayOccupied[roomIndex[currentRoom].index]
          }</div></div>
        <div class="row"><div>Booked:</div><div id="booked-name">${
          bookedGuest.name
        }</div><div id="booked-booking">${todayData[currentRoom]}</div></div>
        <div class="button-row">
        <button id="check-in-button" onclick="modalCheckIn()">Check In</button>
        <button id="check-out-button" onclick="modalCheckOut()">Check Out</button>
        <button id="book-button" onclick="modalBook()">Book</button>
        </div>
        `),
        1000
      );
    })
    .then(() => {
      setTimeout(() => disableButtons(), 1000);
    })
    .then(() => {
      modal.classList.remove("hidden");
    });
}

function disableButtons() {
  if (todayOccupied[roomIndex[currentRoom].index] == 0) {
    document.getElementById("check-out-button").disabled = true;
    document.getElementById("check-out-button").classList.add("hidden");
  }
  if (
    todayData[currentRoom] == 0 ||
    todayOccupied[roomIndex[currentRoom].index] != 0
  ) {
    document.getElementById("check-in-button").disabled = true;
    document.getElementById("check-in-button").classList.add("hidden");
  }
  if (todayData[currentRoom] != 0) {
    document.getElementById("book-button").disabled = true;
    document.getElementById("book-button").classList.add("hidden");
  }
}

//Modal > Room > Check-in--------------------------------------------------------------------------
function modalCheckIn() {
  const customerInfo = {};
  const roomBooking = document.getElementById("booked-booking").innerText;
  return new Promise((resolve, reject) => {
    return resolve(getCustomerInfo(customerInfo, roomBooking));
  })
    .then(() => {
      modal.innerHTML = `
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <p class="loading">LOADING...</p>
        `;
    })
    .then(() => {
      setTimeout(
        () =>
          (modal.innerHTML = `
        <button class="close" onclick="closeModal()">X</button>
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <div class="customer-info-row">
            <div>Name: ${customerInfo.name}</div>
            <div>Phone: ${customerInfo.phone}</div>
        </div>
        <div class="customer-info-row">
            <div>Email: ${customerInfo.email}</div>
            <div>Cost: $${customerInfo["totalCost"].toFixed(2)}</div>
        </div>
        <div class="customer-info-row">
            <div>Check-In Date: ${customerInfo["checkIn"]}</div>
            <div>Check-Out Date: ${customerInfo["checkOut"]}</div>
        </div>
        <button onclick="checkIn()" class="customer-info-button">Confirm</button>
        `),
        1000
      );
    });
}
//Modal > Room > Check-in > Confirm
function checkIn() {
  updateOccupied(
    `room${roomIndex[currentRoom].index + 1}`,
    todayData[currentRoom]
  );
  modal.innerHTML = `
    <button class="close" onclick="closeModal()">X</button>
    <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
    <p class="loading">Task Completed</p>
    `;
}

//Modal > Room > Check-out-------------------------------------------------------------------------
function modalCheckOut() {
  const customerInfo = {};
  const roomGuest = document.getElementById("guest-booking").innerText;
  return new Promise((resolve, reject) => {
    return resolve(getCustomerInfo(customerInfo, roomGuest));
  })
    .then(() => {
      modal.innerHTML = `
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <p class="loading">LOADING...</p>
        `;
    })
    .then(() => {
      setTimeout(
        () =>
          (modal.innerHTML = `
        <button class="close" onclick="closeModal()">X</button>
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <div class="customer-info-row">
            <div>Name: ${customerInfo.name}</div>
            <div>Phone: ${customerInfo.phone}</div>
        </div>
        <div class="customer-info-row">
            <div>Email: ${customerInfo.email}</div>
            <div>Cost: $${customerInfo["totalCost"].toFixed(2)}</div>
        </div>
        <div class="customer-info-row">
            <div>Check-In Date: ${customerInfo["checkIn"]}</div>
            <div>Check-Out Date: ${customerInfo["checkOut"]}</div>
        </div>
        <button onclick="checkOut()" class="customer-info-button">Confirm</button>
        `),
        1000
      );
    });
}

//Modal > Room > Check-out > Confirm
function checkOut() {
  updateOccupied(`room${roomIndex[currentRoom].index + 1}`, 0);
  modal.innerHTML = `
    <button class="close" onclick="closeModal()">X</button>
    <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
    <p class="loading">Task Completed</p>
    `;
}

//Modal > Room > Book------------------------------------------------------------------------------
function modalBook() {
  const customerInfo = {};
  modal.innerHTML = `
    <button class="close" onclick="closeModal()">X</button>
    <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
    <form id="modal_book-form">
        <label for="first-name-modal">
            First Name
            <input type="text" id="first-name-modal" name="first-name-modal" pattern="[^0-9]{2,}" required>
        </label>
        <label for="last-name-modal">
            Last Name
            <input type="text" id="last-name-modal" name="last-name-modal" pattern="[^0-9]{2,}" required>
        </label>
        <label for="phone-modal">
            Phone Number
            <input type="tel" id="phone-modal" name="phone-modal" minlength="10" maxlength="11" required>
        </label>
        <label for="email-modal">
            Email
            <input type="email" id="email-modal" name="email-modal" required>
        </label>
        <label for="address-modal">
            Billing Address
            <input type="text" id="address-modal" name="address-modal" required>
        </label>
        <label for="city-modal">
            City
            <input type="text" id="city-modal" name="city-modal" required>
        </label>
        <label for="zip-modal">
            Zip Code
            <input type="text" id="zip-modal" name="zip-modal" required pattern="[0-9]{5}">
        </label>
        <label for="state-modal">
            State
            <select id="state-modal" name="state-modal" required></select>
        </label>
        <label for="card-name-modal">
            Name on Card
            <input type="text" id="card-name-modal" name="card-name-modal" pattern="[^0-9]{2,}" required>
        </label>
        <label for="card-number-modal">
            Card Number
            <input type="text" id="card-number-modal" name="card-number-modal" pattern="[0-9]{15,}" required>
        </label>
        <label for="cvc-modal">
            CVC
            <input type="text" id="cvc-modal" name="cvc-modal" required minlength="3" maxlength="4" pattern="[0-9]+">
        </label>
        <label for="exp-date-modal">
            Expiration Date
            <input type="month" id="exp-date-modal" name="exp-date-modal" required>
        </label>
        <input type="submit">
    </form>
    `;
  for (state of myStates) {
    let stateOption = `<option value="${state}">${state}</option>`;
    document.getElementById("state-modal").innerHTML += stateOption;
  }
  document.getElementById("modal_book-form").addEventListener("submit", (e) => {
    getForm(customerInfo, "modal_book-form");
    modal.innerHTML = `
        <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
        <p class="loading">LOADING...</p>
        `;
    createCustomerAndBooking(customerInfo);
    e.preventDefault();
  });
}

//Modal > Room > Book > Confirm
function createCustomerAndBooking(customerInfo) {
  const billing = {
    firstName: customerInfo["first-name-modal"],
    lastName: customerInfo["last-name-modal"],
    email: customerInfo["email-modal"],
    phone: customerInfo["phone-modal"],
    address: customerInfo["address-modal"],
    city: customerInfo["city-modal"],
    state: customerInfo["state-modal"],
    zip: customerInfo["zip-modal"],
    nameOnCard: customerInfo["card-name-modal"],
    cardNumber: customerInfo["card-number-modal"],
    cvc: customerInfo["cvc-modal"],
    expDate: customerInfo["exp-date-modal"],
  };

  const booking = {
    name: `${customerInfo["first-name-modal"]} ${customerInfo["last-name-modal"]}`,
    checkIn: formatDay(today),
    checkOut: formatDay(tomorrow),
    numberOfDays: 1,
    room: roomIndex[currentRoom].index + 1,
    roomCost: todayData[roomIndex[currentRoom].type].toFixed(2),
    totalCost: (todayData[roomIndex[currentRoom].type] * 1.06 + 50).toFixed(2),
  };

  return new Promise((resolve, reject) => {
    return resolve(makeNewCustomer(booking, billing));
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(makeNewBooking(booking)), 1000);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve(
              addBookingToRooms(
                `room${booking.room}`,
                booking.id,
                booking["checkIn"],
                booking["checkIn"]
              )
            ),
          1000
        );
      });
    })
    .then(() => {
      setTimeout(() => updateOccupied(`room${booking.room}`, booking.id), 1000);
    })
    .then(() => {
      setTimeout(() => {
        modal.innerHTML = `
            <button class="close" onclick="closeModal()">X</button>
            <h3>Room ${roomIndex[currentRoom].index + 1}</h3>
            <p class="loading">Task Completed</p>
        `;
      });
    });
}
//*********************************************************Calendar*******************************************************************
let calendarVacanies = [];
const calendarDates = document.getElementById("calendar_dates");
const calendarHeader = document.getElementById("calendar_header__month-year");
const months = [
  ["July 2022", 31, 5, "2022-07"],
  ["August 2022", 31, 1, "2022-08"],
  ["September 2022", 30, 4, "2022-09"],
  ["October 2022", 31, 6, "2022-10"],
  ["November 2022", 30, 2, "2022-11"],
  ["December 2022", 31, 4, "2022-12"],
  ["January 2023", 31, 0, "2023-01"],
  ["February 2023", 28, 3, "2023-02"],
  ["March 2023", 31, 3, "2023-03"],
  ["April 2023", 30, 6, "2023-04"],
  ["May 2023", 31, 1, "2023-05"],
  ["June 2023", 30, 4, "2023-06"],
  ["July 2023", 31, 6, "2023-07"],
  ["August 2023", 31, 2, "2023-08"],
  ["September 2023", 30, 5, "2023-09"],
  ["October 2023", 31, 0, "2023-10"],
  ["November 2023", 30, 3, "2023-11"],
  ["December 2023", 31, 5, "2023-12"],
  ["January 2024", 31, 1, "2024-01"],
  ["February 2024", 29, 4, "2024-02"],
  ["March 2024", 31, 5, "2024-03"],
  ["April 2024", 30, 1, "2024-04"],
  ["May 2024", 31, 3, "2024-05"],
  ["June 2024", 30, 6, "2024-06"],
  ["July 2024", 31, 1, "2024-07"],
  ["August 2024", 31, 4, "2024-08"],
  ["September 2024", 30, 0, "2024-09"],
  ["October 2024", 31, 2, "2024-10"],
  ["November 2024", 30, 5, "2024-11"],
  ["December 2024", 31, 0, "2024-12"],
];
let monthViewed = (today.getFullYear() - 2022) * 12 + today.getMonth() - 6;
let k = 0;
getCalendarData(calendarVacanies);

let daysOnCal;

delayMakeCal();
function delayMakeCal() {
  if (calendarVacanies.length > 0) {
    for (let m = 0; m < 30; m++) {
      makeCal(`month-${m}`, months[m][1], months[m][2]);
    }
    calendarHeader.innerText = months[monthViewed][0];
    document.getElementById(`month-${monthViewed}`).classList.remove("hidden");
    daysOnCal = document.getElementsByClassName("day-number");
    Array.from(daysOnCal).forEach((day) => {
      day.addEventListener("click", expandDay);
    });
  } else {
    setTimeout(() => delayMakeCal(), 1000);
  }
}

function expandDay() {
  overlay.classList.remove("hidden");
  currentDay = this.innerHTML;
  if (currentDay.length === 1) {
    currentDay = "0" + currentDay;
  }
  currentDay = months[monthViewed][3] + "-" + currentDay;
  console.log(currentDay);
  let daysGuests = [];
  let guestMap = [];
  return new Promise((resolve, reject) => {
    return resolve(getDayGuests(daysGuests, currentDay));
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        return resolve(getGuestsNames(guestMap, currentDay));
      });
    })
    .then(() => {
      modal.innerHTML = `
      <h3>${currentDay}</h3>
      <p class="loading">LOADING...</p>
      `;
    })
    .then(() => {
      setTimeout(() => {
        for (let i = 0; i < 6; i++) {
          if (daysGuests[i] == 0) {
            daysGuests[i] = "Vacant";
          } else {
            for (let j = 0; j < guestMap.length; j++) {
              if (daysGuests[i] == guestMap[j].id) {
                daysGuests[i] = guestMap[j].name;
              }
            }
          }
        }
      }, 1000);
    })
    .then(() => {
      setTimeout(
        () =>
          (modal.innerHTML = `
      <button class="close" onclick="closeModal()">X</button>
      <h3>${currentDay}</h3>
      <div class="check-row">
        <div>Room 1</div>
        <div>${daysGuests[0]}</div>
      </div>
      <div class="check-row">
        <div>Room 2</div>
        <div>${daysGuests[1]}</div>
      </div>
      <div class="check-row">
        <div>Room 3</div>
        <div>${daysGuests[2]}</div>
      </div>
      <div class="check-row">
        <div>Room 4</div>
        <div>${daysGuests[3]}</div>
      </div>
      <div class="check-row">
        <div>Room 5</div>
        <div>${daysGuests[4]}</div>
      </div>
      <div class="check-row">
        <div>Room 6</div>
        <div>${daysGuests[5]}</div>
      </div>
      `),
        1000
      );
    })
    .then(() => {
      modal.classList.remove("hidden");
    });
}

function makeCal(month, daysInMonth, startDate) {
  const monthSheet = document.createElement("div");
  monthSheet.classList.add("month");
  monthSheet.setAttribute("id", month);
  monthSheet.classList.add("hidden");
  calendarDates.appendChild(monthSheet);
  for (let i = 1; i <= 42; i++) {
    const dateSquare = document.createElement("div");
    dateSquare.classList.add("day");
    if (i < startDate) {
      dateSquare.classList.add("pad-date");
      dateSquare.classList.remove("day");
    } else if (i > startDate && i <= daysInMonth + startDate) {
      dateSquare.innerHTML = `<div class="day-number">${
        i - startDate
      }</div><div class="day-vacant"><div>Vacant: ${
        6 - calendarVacanies[k]
      }</div><hr><div>Booked: ${calendarVacanies[k]}</div></div>`;
      k++;
    } else if (startDate + daysInMonth > 35 || i <= 35) {
      dateSquare.classList.add("pad-date");
      dateSquare.classList.remove("day");
    } else {
      dateSquare.classList.add("post-pad-date");
    }
    monthSheet.appendChild(dateSquare);
  }
}

function changeMonth(input) {
  document.getElementById(`month-${monthViewed}`).classList.add("hidden");
  if (input === "forward" && monthViewed < 29) {
    monthViewed++;
  }
  if (input === "backward" && monthViewed > 0) {
    monthViewed--;
  }
  document.getElementById(`month-${monthViewed}`).classList.remove("hidden");
  calendarHeader.innerText = months[monthViewed][0];
}

//*******************************************Booking***********************************************
let bookingDays = {};
let bookingInfo = {};
let myRooms;
let openRooms;
let bedRooms = {};
let price = {
  singleQueen: 0,
  doubleQueen: 0,
  singleKing: 0,
};
const bookingCheckIn = document.getElementById("check-in");
const bookingCheckOut = document.getElementById("check-out");
bookingCheckIn.min = new Date().toLocaleDateString("en-ca");

bookingCheckIn.addEventListener("change", (e) => {
  let checkInValue = new Date(bookingCheckIn.value);
  bookingCheckOut.disabled = false;
  bookingCheckOut.min = new Date(
    checkInValue.getTime() + 126400000
  ).toLocaleDateString("en-ca");
});
document.getElementById("avail-form").addEventListener("submit", (e) => {
  getAvailability();
  e.preventDefault();
});

function getAvailability() {
  document.getElementById("single-queen-label").classList.remove("hidden");
  document.getElementById("double-queen-label").classList.remove("hidden");
  document.getElementById("single-king-label").classList.remove("hidden");
  document.getElementById("single-queen").disabled = false;
  document.getElementById("double-queen").disabled = false;
  document.getElementById("single-king").disabled = false;
  let formData = new FormData(document.getElementById("avail-form"));
  for ([key, value] of formData) {
    bookingDays[key] = value;
  }
  document.getElementById("days-selected").innerHTML = `
        <div>Check-In: ${bookingDays["check-in"]}</div>
        <div>Check-Out: ${bookingDays["check-out"]}</div>
    `;
  document.getElementById("booking-submit").disabled = false;
  document.getElementById("booking-submit").classList.remove("hidden");
  document.getElementById("avail-form").reset();
  return new Promise((resolve, reject) => {
    return resolve(checkRoomRange());
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(sortRooms()), 1000);
      });
    })
    .then(() => {
      setTimeout(() => {
        disableRooms(), 1000;
      });
    });
}

function disableRooms() {
  if (!bedRooms["singleQueen"]) {
    document.getElementById("single-queen-label").classList.add("hidden");
    document.getElementById("single-queen").disabled = true;
  }
  if (!bedRooms["doubleQueen"]) {
    document.getElementById("double-queen-label").classList.add("hidden");
    document.getElementById("double-queen").disabled = true;
  }
  if (!bedRooms["singleKing"]) {
    document.getElementById("single-king-label").classList.add("hidden");
    document.getElementById("single-king").disabled = true;
  }
}

function checkRoomRange() {
  myRooms = [];
  openRooms = {
    room1: true,
    room2: true,
    room3: true,
    room4: true,
    room5: true,
    room6: true,
  };
  checkRooms(
    myRooms,
    bookingDays["check-in"],
    formatDay(new Date(bookingDays["check-out"]))
  );
}

function sortRooms() {
  price = { singleQueen: 0, doubleQueen: 0, singleKing: 0 };
  for (days of myRooms) {
    for (let i = 1; i < 7; i++) {
      if (days[`room${i}`] != 0) {
        openRooms[`room${i}`] = false;
      }
    }
    price["singleQueen"] += days["singleQueen"];
    price["doubleQueen"] += days["doubleQueen"];
    price["singleKing"] += days["singleKing"];
  }
  bedRooms["singleQueen"] = openRooms["room1"] || openRooms["room2"];
  bedRooms["doubleQueen"] = openRooms["room3"] || openRooms["room4"];
  bedRooms["singleKing"] = openRooms["room5"] || openRooms["room6"];
}

function addToBooking() {
  if (bookingInfo["bed"] === "singleQueen") {
    bookingInfo["roomCost"] = price["singleQueen"];
    if (openRooms["room1"]) {
      bookingInfo.room = 1;
    } else {
      bookingInfo.room = 2;
    }
  } else if (bookingInfo["bed"] === "doubleQueen") {
    bookingInfo["roomCost"] = price["doubleQueen"];
    if (openRooms["room3"]) {
      bookingInfo.room = 3;
    } else {
      bookingInfo.room = 4;
    }
  } else {
    bookingInfo["roomCost"] = price["singleKing"];
    if (openRooms["room5"]) {
      bookingInfo.room = 5;
    } else {
      bookingInfo.room = 6;
    }
  }
}

function confirmBooking() {
  getForm(bookingInfo, "booking-form");
  addToBooking();
  modal.innerHTML = `
    <button class="close" onclick="closeModal()">X</button>
    <h3>Booking</h3>
    <div class="booking-info-modal">
        <div>First Name: ${bookingInfo["first-name"]}</div>
        <div>Last Name: ${bookingInfo["last-name"]}</div>
        <div>Phone Number: ${bookingInfo["phone"]}</div>
        <div>Email: ${bookingInfo["email"]}</div>
        <div>Address: ${bookingInfo["address"]}</div>
        <div>City: ${bookingInfo["city"]}</div>
        <div>Zip Code: ${bookingInfo["zip"]}</div>
        <div>State: ${bookingInfo["state"]}</div>
        <div>Name on Card: ${bookingInfo["card-name"]}</div>
        <div>Card Number: ${bookingInfo["card-number"]}</div>
        <div>CVC: ${bookingInfo["cvc"]}</div>
        <div>Expiration Date: ${bookingInfo["exp-date"]}</div>
    </div>
    <div class="check-row">
        <div>Check-In: ${bookingDays["check-in"]}</div>
        <div>Check-Out: ${bookingDays["check-out"]}</div>
    </div>
    <div class="check-row">
        <div>Room Type: ${bookingInfo["bed"]}</div>
        <div>Room: ${bookingInfo.room}</div>
    </div>
    <div class="check-row">
        <div>Room Cost: $${bookingInfo["roomCost"].toFixed(2)}</div>
        <div>Taxes: $${(bookingInfo["roomCost"] * 0.06).toFixed(2)}</div>
        <div>Cleaning Fee: $50.00</div>
        <div>Total Cost: $${(bookingInfo["roomCost"] * 1.06 + 50).toFixed(
          2
        )}</div>
    </div>
    <div class="button-row">
        <button onclick="createNewBooking()">Confirm</button>
        <button onclick="closeModal()">Cancel</button>
    <div>
    `;
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function createNewBooking() {
  const billing = {
    firstName: bookingInfo["first-name"],
    lastName: bookingInfo["last-name"],
    email: bookingInfo["email"],
    phone: bookingInfo["phone"],
    address: bookingInfo["address"],
    city: bookingInfo["city"],
    state: bookingInfo["state"],
    zip: bookingInfo["zip"],
    nameOnCard: bookingInfo["card-name"],
    cardNumber: bookingInfo["card-number"],
    cvc: bookingInfo["cvc"],
    expDate: bookingInfo["exp-date"],
  };

  const booking = {
    name: `${bookingInfo["first-name"]} ${bookingInfo["last-name"]}`,
    checkIn: bookingDays["check-in"],
    checkOut: bookingDays["check-out"],
    numberOfDays:
      (new Date(bookingDays["check-out"]) - new Date(bookingDays["check-in"])) /
      1000 /
      60 /
      60 /
      24,
    room: bookingInfo.room,
    roomCost: bookingInfo["roomCost"],
    totalCost: (bookingInfo["roomCost"] * 1.06 + 50).toFixed(2),
  };

  return new Promise((resolve, reject) => {
    return resolve(makeNewCustomer(booking, billing));
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(makeNewBooking(booking)), 1000);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve(
              addBookingToRooms(
                `room${booking.room}`,
                booking.id,
                booking["checkIn"],
                formatDay(new Date(booking["checkOut"]))
              )
            ),
          1000
        );
      });
    })
    .then(() => {
      setTimeout(() => {
        modal.innerHTML = `
            <button class="close" onclick="closeModal()">X</button>
            <h3>Booking</h3>
            <p class="loading">Task Completed</p>
        `;
      });
    });
}

//********************************************Look Up**********************************************
document.getElementById("look-up-form").addEventListener("submit", (e) => {
  customerLookUp();
  e.preventDefault();
});
let lookUpStore = {};
function customerLookUp() {
  const bookingField = document.getElementById("booking-field");
  const bookingValue = document.getElementById("booking-value");
  return new Promise((resolve, reject) => {
    return resolve(
      getLookUp(lookUpStore, bookingField.value, bookingValue.value)
    );
  }).then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(testLookUp(lookUpStore)), 1000);
    });
  });
}

function testLookUp(lookUpStore) {
  if (lookUpStore.entries != 1) {
    modal.innerHTML = `
            <button class="close" onclick="closeModal()">X</button>
            <h3>Look Up Failed</h3>
            <p class="loading">Try another field</p>
            </div>
        `;
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  } else {
    document.getElementById("look-up-data").innerHTML = `
            <p>First Name: ${lookUpStore["firstName"]}</p>
            <p>Last Name: ${lookUpStore["lastName"]}</p>
            <p>Check-In: ${lookUpStore["checkIn"]}</p>
            <p>Check-Out: ${lookUpStore["checkOut"]}</p>
            <p>Room: ${lookUpStore["room"]}</p>
            <p>Total Cost: $${lookUpStore["totalCost"].toFixed(2)}</p>
            <p>Phone: ${lookUpStore["phone"]}</p>
            <p>Email: ${lookUpStore["email"]}</p>
            <p>Address: ${lookUpStore["address"]}</p>
            <p>City: ${lookUpStore["city"]}</p>
            <p>Zip Code: ${lookUpStore["zip"]}</p>
            <p>State: ${lookUpStore["state"]}</p>
            <p>Name on Card: ${lookUpStore["nameOnCard"]}</p>
            <p>Card Number: ${lookUpStore["cardNumber"]}</p>
            <p>CVC: ${lookUpStore["cvc"]}</p>
            <p>Expiration Date: ${lookUpStore["expDate"]}</p>
            <button id="delete" onclick="deleteEntry()" class="delete">Delete Entry</button>
        `;
  }
}

function deleteEntry() {
  modal.innerHTML = `
        <button class="close" onclick="closeModal()">X</button>
        <h3 class="warning">WARNING!</h3>
        <p class="loading">This action cannot be undone!</p>
        <button class="delete" onclick="confirmDeletion()">Delete Entry</button>
        </div>
    `;
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function confirmDeletion() {
  return new Promise((resolve, reject) => {
    return resolve(
      deleteBookingFromRooms(`room${lookUpStore["room"]}`, lookUpStore["id"])
    );
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(delBooking(lookUpStore["id"])), 1000);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(delBilling(lookUpStore["customerId"])), 1000);
      });
    })
    .then(() => {
      setTimeout(() => {
        modal.innerHTML = `
            <button class="close" onclick="closeModal()">X</button>
            <h3>Booking Deleted</h3>
            <p class="loading">Task Completed</p>
        `;
      });
      document.getElementById("look-up-data").innerHTML = `
            <p>First Name:</p>
            <p>Last Name:</p>
            <p>Check-In:</p>
            <p>Check-Out:</p>
            <p>Room:</p>
            <p>Total Cost:</p>
            <p>Phone:</p>
            <p>Email:</p>
            <p>Address:</p>
            <p>City:</p>
            <p>Zip Code:</p>
            <p>State:</p>
            <p>Name on Card:</p>
            <p>Card Number:</p>
            <p>CVC:</p>
            <p>Expiration Date:</p>
        `;
    });
}
