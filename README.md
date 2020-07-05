THE BOARD is an open source dispatching application for courier companies to manage and track on-demand deliveries. It is designed as a single-page application in React to minimize requests to and from the back-end.

ON LOAD
- On the initial page load, THE BOARD will fetch all couriers and clients, plus all incomplete tickets, as well as all tickets created, ready or due today.

TICKET BOARD
- By Default, the ticket board will display all incomplete tickets as well as all unassigned
- TICKET PREVIEW
  - Displays basic information about the ticket. Will display courier's name if assigned or a quick assign drop down menu if unassigned
  - TICKET DETAIL
    - Displays more detailed info for ticket
    - Drop down form to edit ticket
    - Button to mark incomplete if complete, else will open form for POD and time delivered to complete ticket
    - Delete ticket button with confirm dialog
- NEW TICKET
  - Simple drop down form for adding new ticket.
- SEARCH AND FILTER
  - FILTER
    - Options will filter through the tickets in the initial fetch (all today + incomplete/unassigned) and update filteredTickets live
  - SEARCH
    - Makes a new fetch to the back-end given courier, client and/or time frame
- TODOS:
  - Pagination for all results
  - Handle unassigned but completed tickets better - maybe hide them by default unless retrieved in search
  - Better address fields for tickets, store as json string
  - Cleaner display for ticket preview
  - Validation and additional fields for new / edit ticket forms
  - More search options
  - Filters should work on search!!
  - BUG - Pagination persists after search results have been navigated away from

TICKET SHOW PAGE
- In development. Currently renders a Ticket preview card with minimal functionality

CLIENTS BOARD
- Shows all clients in simple table.
- Can be sorted up/down by each column
- Filter will filter results in real time by name, address, or phone number
- Edit opens a modal to edit, (un)archive (need to implement), or delete
- New Client opens simple form for creating new client
- TODOs
  - Up/down carrots when sort in place
  - Implement (un)archive, plus filter toggle
  - Build out more options and validation in new client form
  - Pagination

CLIENT SHOW PAGE
- In development

COURIERS BOARD
- Much the same as clients board. Adds toggle to mark courier (in)active (disabled if courier is archived)
- TODOS
  - BUG - Toggling courier back to 'active' throws an association error
  - BUG - Toggling courier's active status resets sort
  - BUG - Quick filter unaware of showArchived toggle
  - BUG - Editing courier, incl. toggling archive or active, resets archived filter (but doesnt toggle switch or state)
    ** Perhaps move the bool for showArchived to dispatchHome so couriers/filteredCouriers will remain consistent per that value
  - Toggle all active/inactive // toggle all with incomplete tickets to active
  - Pagination
  - Add tickets today column

COURIER SHOW PAGE
- Renders a table with courier's data.
- Toggle switch allows for courier's information to be edited or for courier to be deleted.
- Button to show all couriers tickets from 1/1/2000 to present.
  - This just calls the search handler in DispatchHome. There is a bug with pagination. App will crash when navigating to another results page. Issue is with the 'prevSearch' hash held in ticketList's state. Will need to restructure for more versatile searching

INVOICES
- By Default, displays all unpaid invoices
- NEW INVOICE
  - Required a client to be selected
  - Will generate and invoice with all tickets given the date range for that client
  - Dates can be picked via a month / year drop down or manually
- SHOW INVOICES BY CLIENT
  - Will return all invoices for the selected client
- TODO
  - Allow manual invoices to be created for single or selected tikets, incl. guest account
  - Invoice detail should show more ticket details
  - Allow invoice details to be exported and/or emailed

TO DO / GENERAL
- Create view pages for all models showing details, edit links, tickets, etc. Should also work in the router so /couriers/999 shows view page for courier 999. References to any instance should link to this view page (e.g., client name links to client view page)
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
