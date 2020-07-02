THE BOARD is an open source dispatching application for courier companies to manage and track on-demand deliveries. It is designed as a single-page application in React to minimize requests to and from the back-end.

ON LOAD
- On the initial page load, THE BOARD will fetch all couriers and clients, plus all incomplete tickets, as well as all tickets created, ready or due today.

TICKET BOARD
- By Default, the ticket board will display all incomplete tickets as well as all unassigned
- TODOS:
  - Pagination
  - Handle unassigned but completed tickets better - maybe hide them by default unless retrieved in search
  - Better address fields for tickets, store as json string
  - Cleaner display for ticket preview
  - Validation and additional fields for new / edit ticket forms
