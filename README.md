**THE BOARD is an open source dispatching application for courier companies to manage and track on-demand deliveries. It is designed as a single-page application in React to minimize requests to and from the back-end.**

This application is designed to work with a Rails API available [here](https://github.com/mishyjari/TheBoardApi)

## Features

**ON LOAD**
 - On the initial page load, THE BOARD will fetch all couriers and clients
 - Initial fetch of ticket data will include ALL tickets created, ready, or due TODAY, as well as ALL tickets which are incomplete or unassigned.

**TICKET BOARD**
 - By Default, the ticket board will display all incomplete and unassigned tickets
**TICKET PREVIEW**
 - Displays basic information about the ticket. Will display courier's name if assigned or a quick assign drop down menu if unassigned
  **TICKET DETAIL**
    - Displays more detailed info for ticket
    - Drop down form to edit ticket
    - Button to mark incomplete if complete, else will open form for POD and time delivered to complete ticket
    - Delete ticket button with confirm dialog
 - **NEW TICKET**
	  - Dropdown menu to create new ticket
	  - Toggling on RUSH, ROUNDTRIP, or OVERSIZE booleans will open a text field for more details, as well as a charge field for billing
 - **SEARCH AND FILTER**
	  - Search makes a new fetch to the back-end given courier, client and/or time frame
	  - Filters will apply to the inital fetch of tickets today/incomplete/unassigned
	  - Sort order will sort whatever the current display is

**CLIENTS BOARD**
- Displays all clients in a table
- Clicking heading will sort that column, clicking again will toggle sort order
- Quick search field will filter results by searching against name, address, phone or contact person
- New Client toggle opens form for new client
- Archived clients can be shown / hidden via toggle beneath filter field
- Edit button opens a modal with an edit form for that client, including an archive toggle and delete button

**COURIERS BOARD**

- Basic functions are identical to Clients Board, but adds the "ACTIVE" column, allowing any (not archived) courier to be marked in/active right from the table

**TICKETS SHOW PAGE**

- Fetches ticket instance based on ID param in URL
- Renders ticket preview/details/edit identical to tickets board.

**COURIER / CLIENT SHOW PAGE**

- Fetches instance based on ID Param in URL
- Renders details in a table
- Edit toggle will allow for editing or deleting information

**STATUS BAR**

- Toggle hide/show by clicking arrow highlighted on mouseover
- Renders all couriers marked active and all clients with incomplete tickets
- Renders number of incomplete tickets and total tickets today for each, clicking on number will render those tickets in a list

## **TODOS**

 - Global pagination
 - Form Validation
- Address fields broken into street, city, etc, plus company name
- Table header sorts should show up/down carrots to mark sort order

- BUG - Pagination persists after search results have been navigated away from

COURIER SHOW PAGE
- Renders a table with courier's data.
- Toggle switch allows for courier's information to be edited or for courier to be deleted.
 - Allow manual invoices to be created for single or selected tikets, incl. guest account
 - Invoice detail should show more ticket details
 - Allow invoice details to be exported and/or emailed

- USER ACCOUNTS / NON DISPATCH MODES
  - Ability to create user accounts with a user type (courier, client, dispatcher, admin) with different privileges associated. Dispatchers and admins should be able to create this account automatically when adding a client/courier, or they should be able to sign up on their own and have a client/courier instance be created
  - COURIER HOME - should display all tickets for the courier, ability to add notes, POD, etc
  - CLIENT HOME - Clients can view invoices, past / current orders, create new tickets, etc
  - GUEST ORDER FORM - Public. Allow non-users to order delivery as a guest.
  - Email / text integration - for dispatching jobs, sending invoices, notifying when job has been completed, etc.
- Needs pagination everywhere. Courier / client pagination can be done all on the front end. Some combination of front / back should be used for invoices and tickets.  
- BUG - DateTime instances are inconsistent per time zone offsets. Best to move all functions responsible for handling date time into a single document. Have everything converted to / from unix epoch when going to / from back end
- Make UI more responsive, scale to lower resolutions, handle mobile browsers (perhaps a React Native version for mobile devices), Collapsible containers, etc.

DEVELOPED BY Michelle Frattaroli
