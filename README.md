# hotel-company

This is the company page of a 3 part project.  The project is a hotel with a customer website to book rooms, a company page to handle the 
physical hotel's needs, and an api/database as the backend.

The three parts are hosted on Github and Heroku. The links can be found here:
1. Customer website - Github [Customer Code][1], Heroku [Customer Website][2]
2. Company website - Github [Company Code][3], Heroku [Company Website][4]
3. Database - Github [Database Code][5]

[1]: https://github.com/johnny-jack19/indigo-sky "Customer Code"
[2]: http://indigo-sky.herokuapp.com/ "Customer Website"
[3]: https://github.com/johnny-jack19/hotel-company "Company Code"
[4]: http://jackson-hotel-company.herokuapp.com/ "Company Website"
[5]: https://github.com/johnny-jack19/hotel-db "Database Code"

The company page is broken down into 5 sections:
1. Today: It lists the rooms(clickable) and displays if the room is booked and currently has someone in it. 
You can "Check in" if someone is booked, "Check out" if the room is occupied, and "Book" if the 
room isn't booked for the night (book only for the night). The buttons will only be visible under those conditions.
2. Calendar: It displays a calendar and each day displays the number of booked and vacant rooms.
3. Booking: Allows you to book a room.
4. Look Up: Allows you to search for a booking and delete it. (It will require a different parameter
if there are mutliple entries with the same value i.e. people with the same name)
5. Contacts: Just a list (nothing fancy)
