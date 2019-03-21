# MovieTime
A cinema website + its administrator page

First of all go to .env file and give an admin urername and password and then to server.js (lines 112-113) to give a real email and 
password for the confirmation mails.

After login authentication, the administrator can see in his page a reservation list and a search engine for it for the movie,
a table with the left seats/day and he can post to home page the next movie (title, description, dates of projection and images).
Also he can post articles (title, content and image) for blog page.

At Home page we a logo-picure and the next movie which administrator gave us (title, description, dates of projection and
the a carousel with the given pictures) and a button with reference to the reservation page.

At Reservation page there is a form where a viewer can make his resevation by adding his name, lastname, email, day and number of seats.
Server will send him automatically a confirmation email for his reservation. The viewer can reserve maximum 5 seats and if there aren't
enough of them, a popup corresponding message will show up.

Furthermore there is a Blog page where there are shown up the three last articles (title, content and image) that administrator gave,
an About page a link to IMDb's "Coming Soon".

An all pages (exept administrator and login page) there is a navbar on the top and at the bottom.
